import os
import sys
from pathlib import Path
import tempfile
import subprocess
import shutil
from pdf2image import convert_from_path

def get_soffice_path():
    if sys.platform.startswith('win'):
        return "soffice"
    elif sys.platform.startswith('darwin'):
        return "/Applications/LibreOffice.app/Contents/MacOS/soffice"
    else:
        return "soffice"

def get_poppler_path():
    if sys.platform.startswith('win'):
        return "C:/path/to/poppler/bin"
    elif sys.platform.startswith('darwin'):
        return "/opt/homebrew/bin"
    else:
        return ""

def convert_presentation_to_jpeg(presentation_path):
    soffice_path = get_soffice_path()
    poppler_path = get_poppler_path()
    # Creating a folder to save images
    output_folder = os.path.splitext(os.path.basename(presentation_path))[0]
    os.makedirs(output_folder, exist_ok=True)
    with tempfile.TemporaryDirectory() as temp_dir:
        
        # Convert the presentation to PDF
        temp_pdf_path = os.path.join(temp_dir, f"{output_folder}.pdf")
        subprocess.run([soffice_path, "--headless", "--convert-to", "pdf", "--outdir", temp_dir, presentation_path])
        
        # Check that the PDF file is actually created
        if not os.path.exists(temp_pdf_path):
            print(f"Ошибка: не удалось создать файл PDF для (Error: failed to create a PDF file for) '{presentation_path}'")
            return
        
        # Convert PDF to images
        images = convert_from_path(temp_pdf_path, dpi=96, fmt='jpeg', poppler_path=poppler_path)

        # Saving slide images
        for i, img in enumerate(images, start=1):
            img_path = os.path.join(output_folder, f"slide_{i}.jpeg")
            img.save(img_path, 'JPEG')

            print(f"Slide {i} converted")

        print(f"Презентация успешно конвертирована в папку (The presentation has been successfully converted to a folder) '{output_folder}'")

def process_directory(directory_path):
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            if file_path.endswith(('.ppt', '.pptx')):
                print(f"File Conversion (Конвертация файла)  #'{file_path}'")
                convert_presentation_to_jpeg(file_path)

if __name__ == "__main__":
    # Command example: 
    # python3 ppt_to_jpeg.py /Users/andrey/Documents/GitHub/Template_for_the_presentation-dictionary_website/public/media/download 

    if len(sys.argv) < 2:
        print("Error: the path to the folder is not specified (Ошибка: путь к папке не указан)")
        sys.exit(1)

    directory_path = sys.argv[1]
    if not os.path.exists(directory_path) or not os.path.isdir(directory_path):
        print("Error: the specified folder does not exist (Ошибка: указанная папка не существует)")
        sys.exit(1)

    process_directory(directory_path)
