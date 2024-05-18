from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files (x86)\\Tesseract\\tesseract.exe'

@app.route('/extract_text', methods=['GET', 'POST'])
def extract_text():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']
        file_data = file.read()  # Read the file data into a variable
        image = Image.open(io.BytesIO(file_data))  # Create a BytesIO object from the file data
        extracted_text = pytesseract.image_to_string(image)
        return jsonify({'extracted_text': extracted_text}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
from app import app

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)