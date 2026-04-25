# 🔬 Audra Labs - Deepfake Detection Engine

A full-stack forensic analysis platform built to detect deepfakes, synthetic media, and manipulated images. This project utilizes a **Hybrid AI Pipeline**:
1. **Primary Engine:** Local PyTorch XceptionNet (trained on FaceForensics++)
2. **Cloud Fallbacks:** Gemini 1.5 Flash, Anthropic Claude 3.5 Sonnet, and Groq Llama Vision.

---

## 🚀 Getting Started for Teammates & Developers

Follow these instructions to get the application running on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/jungo876/Audra_lab.git
cd Audra_lab
```

### 2. Environment Variables
You need to create a `.env` file in the root directory. This holds your API keys for the cloud fallback models.
```bash
touch .env
```
Inside `.env`, add the following (get these keys from your team):
```env
GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GROQ_API_KEY=your_groq_key_here
PORT=5001
MONGODB_URI=mongodb://localhost:27017/audra_labs
```

### 3. Frontend Setup (React/Vite)
Open a terminal and run:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

### 4. Backend Setup (Node.js)
Open a new terminal and run:
```bash
cd backend
npm install
```

### 5. 🧠 PyTorch Deepfake Engine Setup (CRITICAL)
To run the local image manipulation detection model (XceptionNet), you must install Python dependencies and download the pretrained weights.

**A. Install Python Dependencies:**
Make sure you have Python installed, then run:
```bash
cd backend
pip install torch torchvision opencv-python
```

**B. Download Pretrained AI Weights:**
Because AI models are huge, they are not stored on GitHub.
1. Download `deepfake_c0_xception.pkl` (79.7 MB) from [this Google Drive link](https://drive.google.com/drive/folders/1GNtk3hLq6sUGZCGx8fFttvyNYH8nrQS8?usp=sharing).
2. Inside `backend/Deepfake-Detection/`, create a new folder named `pretrained_model`.
3. Move the downloaded `.pkl` file into that folder.

The final path MUST look exactly like this:
`backend/Deepfake-Detection/pretrained_model/deepfake_c0_xception.pkl`

---

## 🏃 Running the Application
Once everything is installed:

1. **Start the Frontend:** `cd frontend && npm run dev`
2. **Start the Backend:** `cd backend && npm run dev`

Navigate to `http://localhost:5173` in your browser. When you upload an image, the backend will automatically process it through the PyTorch XceptionNet model and return the forensic breakdown!
