import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Gemini API key not found")
    exit()

print("✅ Gemini API key loaded")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

response = model.generate_content(
    "Explain what a Product Requirements Document is in one sentence."
)

print("\nGemini Response:")
print(response.text)