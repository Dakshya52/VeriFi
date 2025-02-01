import torch
import requests
from PIL import Image
from io import BytesIO
import torchvision.transforms as T
from torchvision import models

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def verify_image(image_url):
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        
        # Preprocess image for classification
        transform = T.Compose([
            T.Resize(256),
            T.CenterCrop(224),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        img_tensor = transform(img).unsqueeze(0).to(device)

        # Load a pre-trained ResNet50 model for image classification
        resnet_model = models.resnet50(pretrained=True)
        resnet_model.to(device)
        resnet_model.eval()

        with torch.no_grad():
            output = resnet_model(img_tensor)
            _, predicted_class = torch.max(output, 1)

        # Define a threshold for classifying an image as fake or real
        fake_class = 951  # Replace with correct class
        return "Fake" if predicted_class.item() == fake_class else "Real"

    except requests.RequestException as e:
        print(f"Error fetching image: {e}")
        return "Error"
