import os
import sys
from pathlib import Path
import tempfile
import subprocess
import shutil
from pdf2image import convert_from_path

def get_poppler_path():
    if sys.platform.startswith('win'):
        return "C:/path/to/poppler/bin"
    elif sys.platform.startswith('darwin'):
        return "/opt/homebrew/bin"
    else:
        return ""

def convert_pdf_to_images(pdf_path, output_folder):
    try:
        poppler_path = get_poppler_path()
        
        # Convert PDF to images
        images = convert_from_path(pdf_path, dpi=96, fmt='jpeg', poppler_path=poppler_path)

        # Saving page images
        for i, img in enumerate(images, start=1):
            img_path = os.path.join(output_folder, f"slide_{i}.jpeg")
            img.save(img_path, 'JPEG')

            print(f"Page {i} converted")

        print(f"PDF successfully converted to images in folder '{output_folder}'")
    except Exception as e:
        print(f"Error converting PDF: {str(e)}")

def process_directory(directory_path):
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            if file_path.endswith('.pdf'):
                print(f"Converting file '{file_path}'")
                output_folder = os.path.splitext(file_path)[0]
                output_folder = output_folder.replace(" ", "_")  # Replace spaces with underscores
                os.makedirs(output_folder, exist_ok=True)
                convert_pdf_to_images(file_path, output_folder)

if __name__ == "__main__":
    # Command example: 
    # python3 pdf_to_images.py /path/to/directory
    
    if len(sys.argv) < 2:
        print("Error: the path to the folder is not specified")
        sys.exit(1)

    directory_path = sys.argv[1]
    if not os.path.exists(directory_path) or not os.path.isdir(directory_path):
        print("Error: the specified folder does not exist")
        sys.exit(1)

    process_directory(directory_path)
