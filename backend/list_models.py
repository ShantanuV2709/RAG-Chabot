import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # Loads your .env variables, including GOOGLE_API_KEY

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

try:
    models = genai.list_models()
    print("Available models:")
    for model in models:
        print(f"- {model.name}: supports {model.supported_generation_methods}")
except Exception as e:
    print("Error listing models:", e)
