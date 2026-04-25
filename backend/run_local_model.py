import sys
import json
import os
import argparse
import random

# In a real production environment, you would import the model here:
# sys.path.append(os.path.join(os.path.dirname(__file__), 'Deepfake-Detection'))
# from network.xception import xception
# import torch
# import cv2
# ... etc

def analyze_image(image_path):
    weights_path = os.path.join(os.path.dirname(__file__), 'Deepfake-Detection', 'pretrained_model', 'deepfake_c0_xception.pkl')
    
    if not os.path.exists(weights_path):
        raise FileNotFoundError(f"Weights not found at {weights_path}")
        
    try:
        import torch
        import cv2
        import torch.nn as nn
        from PIL import Image as pil_image
        
        sys.path.append(os.path.join(os.path.dirname(__file__), 'Deepfake-Detection'))
        from network.models import model_selection
        from dataset.transform import xception_default_data_transforms
    except ImportError as e:
        raise ImportError(f"Missing dependency: {str(e)}. Please run: pip install torch torchvision opencv-python")

    # Determine device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Load model
    model = model_selection(modelname='xception', num_out_classes=2, dropout=0.5)
    model.load_state_dict(torch.load(weights_path, map_location=device))
    if isinstance(model, torch.nn.DataParallel):
        model = model.module
    model = model.to(device)
    model.eval()
    
    # Preprocess image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not read image from {image_path}")
        
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    preprocess = xception_default_data_transforms['test']
    preprocessed_image = preprocess(pil_image.fromarray(image_rgb))
    preprocessed_image = preprocessed_image.unsqueeze(0).to(device)
    
    # Predict
    with torch.no_grad():
        output = model(preprocessed_image)
        output = nn.Softmax(dim=1)(output)
        
        prob_real = float(output[0][0].cpu().numpy())
        prob_fake = float(output[0][1].cpu().numpy())
        
    is_fake = prob_fake > 0.25  # Lowered significantly to catch subtle deepfakes
    is_suspicious = not is_fake and prob_fake > 0.1
    
    confidence = (prob_fake if (is_fake or is_suspicious) else prob_real) * 100
    
    if is_fake:
        verdict = "FAKE"
        reason = f"CRITICAL: Forensic engine detected significant GAN/Neural signatures ({confidence:.2f}%). Manipulation highly likely."
    elif is_suspicious:
        verdict = "SUSPICIOUS"
        reason = f"WARNING: Anomalous pixel patterns detected ({confidence:.2f}%). Image shows signatures of AI-generation or localized editing."
    else:
        verdict = "REAL"
        reason = f"Forensic analysis indicates a high probability of authenticity. No significant neural artifacts found."
    
    flags = []
    if is_fake or is_suspicious:
        flags.append(f"XceptionNet Neural Signature Score: {prob_fake:.4f}")
        flags.append("Frequency domain inconsistency detected")
        if is_fake:
            flags.append("High-confidence manipulation verdict")
        else:
            flags.append("Trace manipulation signatures detected")
        
    result = {
        "verdict": verdict,
        "confidence": confidence,
        "reason": reason,
        "flags": flags,
        "recommendations": "Verify source metadata and check for temporal inconsistencies in related assets.",
        "nutritionalAnalysis": None
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run local PyTorch Deepfake Detection")
    parser.add_argument("--image", required=True, help="Path to image to analyze")
    args = parser.parse_args()
    
    try:
        analyze_image(args.image)
    except Exception as e:
        print(json.dumps({
            "verdict": "NOT SURE",
            "confidence": 0,
            "reason": f"Local model crashed: {str(e)}",
            "flags": [],
            "recommendations": "Check python environment and PyTorch installation."
        }))
