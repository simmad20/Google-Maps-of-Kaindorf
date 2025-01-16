import cv2
import pytesseract
from PIL import Image
import re

# Lade das Bild ohne Upscaling
image_path = './upscaled_image.png'
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

# OCR-Konfiguration: Nur Ziffern und Punkte für Raumnummern
custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789.'
extracted_text = pytesseract.image_to_string(Image.fromarray(image), config=custom_config)

# Ausgabe des extrahierten Textes zur Analyse
print("Extrahierter Text:")
print(extracted_text)

# Textbereinigung: Ersetze fehlerhafte Trennungen wie "11.17" -> "1.1.17"
corrected_text = re.sub(r'(\d)\.(\d{2,})\.(\d{2,})', r'\1.\2.\3', extracted_text)

# Filtern der Raumnummern basierend auf dem Format x.x.x oder x.x
room_numbers = re.findall(r'\b\d+(?:\.\d+)+\b', corrected_text)

# Duplikate entfernen und sortieren
unique_room_numbers = sorted(set(room_numbers))

# Ausgabe der gefundenen Raumnummern
print("Gefundene Raumnummern:")
for number in unique_room_numbers:
    print(number)
