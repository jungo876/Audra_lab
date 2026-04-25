require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const { getForensicPrompt } = require('./forensicPrompt');

const app = express();
const port = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// ── MongoDB & Auth (fully deferred — loaded lazily) ─────────────────────────
let mongoReady = false;

setTimeout(async () => {
  try {
    const mongoose = require('mongoose');
    mongoose.set('bufferCommands', false);
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aiml007';
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to MongoDB for Authentication');
    const authRoutes = require('./routes/auth');
    const historyRoutes = require('./routes/history');
    app.use('/api/auth', authRoutes);
    app.use('/api/history', historyRoutes);
    mongoReady = true;
  } catch {
    console.warn('⚠️ MongoDB unavailable — auth disabled, forensic analysis still works.');
  }
}, 100);

// Set up multer for file handling (memory storage for easy processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize Groq (fallback)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Audra Labs Intelligence Engine is running',
    gemini: !!process.env.GEMINI_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
    mongo: mongoReady
  });
});

// ── Groq Fallback Analysis (vision-capable) ──────────────────────────────────
async function analyzeWithGroq(imageBuffer, mimeType) {
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  const prompt = `You are a forensic image analyst. Analyze the provided image and determine if it is AI-generated, manipulated, or real.

Look specifically for:
- Unnatural skin texture or smoothness (AI skin looks "plastic")
- Background blur inconsistencies
- Lighting that doesn't match the scene
- Extra/missing fingers or distorted hands
- Text that looks garbled or blurry
- Eyes that look glassy or asymmetrical
- JPEG artifacts in unusual places

You must reply in simple, plain English. Do NOT use technical jargon.

Respond ONLY with a valid JSON object in this exact format. Do NOT include Markdown formatting or code blocks:
{
  "verdict": "FAKE" | "REAL" | "SUSPICIOUS",
  "confidence": <integer between 60 and 99>,
  "reason": "<A 2-3 sentence plain-english summary of your findings>",
  "flags": ["<observation1>", "<observation2>"],
  "recommendations": "<1-2 sentences on what the user should do next>"
}

Be decisive. If confidence is above 75%, call it FAKE or REAL. Never say NOT SURE unless confidence is below 65%.`;

  const response = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: dataUrl } }
      ]
    }],
    temperature: 0.7,
    max_tokens: 800
  });

  const text = response.choices[0]?.message?.content || '';
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);
  
  // Normalize Groq field names to match Gemini format
  return {
    verdict: parsed.verdict || 'NOT SURE',
    confidence: parsed.confidence || parsed.confidenceScore || 50,
    reason: parsed.reason || parsed.summary || '',
    flags: parsed.flags || parsed.techniques || [],
    recommendations: parsed.recommendations || '',
    nutritionalAnalysis: parsed.nutritionalAnalysis || null
  };
}

// ── Anthropic Fallback Analysis ──────────────────────────────────────────────
async function analyzeWithAnthropic(imageBuffer, mimeType) {
  const base64Image = imageBuffer.toString('base64');
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mimeType, data: base64Image }
          },
          {
            type: "text",
            text: `Analyze this image for signs of deepfake manipulation.
            
Respond ONLY with a valid JSON object, no markdown, no extra text:
{
  "is_deepfake": true or false,
  "confidence": <number 0-100, how confident you are it IS a deepfake>,
  "verdict": "REAL" | "FAKE" | "NOT SURE",
  "summary": "<one sentence explanation>",
  "anomalous_traits": ["trait1", "trait2"]
}`
          }
        ]
      }]
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Anthropic API error");
  }
  
  const raw = data.content.map(b => b.text || "").join("");
  const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
  
  // Normalize to standard app format
  return {
    verdict: parsed.verdict || 'NOT SURE',
    confidence: parsed.confidence || 50,
    reason: parsed.summary || '',
    flags: parsed.anomalous_traits || [],
    recommendations: "Review the flagged anomalous traits carefully.",
    nutritionalAnalysis: null
  };
}

app.post('/api/analyze', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media file provided' });
    }

    const mimeType = req.file.mimetype;
    const filename = req.file.originalname;
    console.log(`📂 Analyzing file: ${filename} (${mimeType})`);

    // ── PRIMARY: Try Gemini 1.5 Pro ──────────────────────────────────────────
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('🔍 Attempting Gemini 1.5 Flash analysis...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const mediaPart = {
          inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType
          }
        };
        const prompt = getForensicPrompt();
        const result = await model.generateContent([prompt, mediaPart]);
        const responseText = result.response.text();
        const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedJson = JSON.parse(cleanJsonStr);
        
        // Normalize Gemini fields to ensure consistency
        const normalized = {
          verdict: parsedJson.verdict || 'NOT SURE',
          confidence: parsedJson.confidence || parsedJson.confidenceScore || 50,
          reason: parsedJson.reason || parsedJson.summary || '',
          flags: parsedJson.flags || parsedJson.techniques || [],
          recommendations: parsedJson.recommendations || '',
          nutritionalAnalysis: parsedJson.nutritionalAnalysis || null
        };
        
        console.log('✅ Gemini analysis successful — verdict:', normalized.verdict);
        return res.json(normalized);
      } catch (geminiError) {
        console.warn('⚠️ Gemini failed:', geminiError.message);
        console.warn('   Full error:', JSON.stringify(geminiError?.response?.data || geminiError.status || geminiError.code || 'unknown'));
        console.log('Falling back...');
      }
    }

    // ── FALLBACK 1: Anthropic LLM ────────────────────────────────────────────
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        console.log('🔍 Attempting Anthropic fallback analysis...');
        const parsedJson = await analyzeWithAnthropic(req.file.buffer, mimeType);
        console.log('✅ Anthropic fallback analysis successful — verdict:', parsedJson.verdict);
        return res.json(parsedJson);
      } catch (anthropicError) {
        console.warn('⚠️ Anthropic fallback failed:', anthropicError.message);
        console.log('Falling back to Groq...');
      }
    }

    // ── FALLBACK 2: Groq LLM ─────────────────────────────────────────────────
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('🔍 Attempting Groq fallback analysis...');
        const parsedJson = await analyzeWithGroq(req.file.buffer, mimeType);
        console.log('✅ Groq fallback analysis successful — verdict:', parsedJson.verdict);
        return res.json(parsedJson);
      } catch (groqError) {
        console.error('⚠️ Groq fallback also failed:', groqError.message);
      }
    }

    return res.status(500).json({
      error: 'Both Gemini and Groq are unavailable. Please check your API keys in .env'
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'An error occurred during analysis',
      details: error.message
    });
  }
});

const http = require('http');
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`🔬 Audra Labs Intelligence Engine running on port ${port}`);
  console.log(`   Gemini: ${process.env.GEMINI_API_KEY ? '✅ Active' : '❌ No key'}`);
  console.log(`   Anthropic: ${process.env.ANTHROPIC_API_KEY ? '✅ Active (fallback)' : '❌ No key'}`);
  console.log(`   Groq:   ${process.env.GROQ_API_KEY ? '✅ Active (fallback)' : '❌ No key'}`);
  console.log(`   MongoDB: connecting in background...`);
});

