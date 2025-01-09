from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import re
import numpy as np
import cv2  # Importiere OpenCV für Bildoperationen

# Pfad zur Tesseract-Binärdatei (anpassen, falls nötig)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Schritt 1: Bild laden
image_path = "./public/kaindorfMap.png"  # Ersetze durch den tatsächlichen Pfad
image = Image.open(image_path)

# Schritt 2: Bildvorverarbeitung (Graustufen, Skalierung, Kontrast erhöhen, Rauschen reduzieren)
print("Bild wird vorverarbeitet...")

# Zu Graustufen konvertieren
gray_image = image.convert("L")

# Bildgröße skalieren (Skalierung um 3x für bessere OCR-Erkennung)
scaled_image = gray_image.resize((gray_image.width * 3, gray_image.height * 3))

# Kontrast erhöhen
contrast_enhancer = ImageEnhance.Contrast(scaled_image)
high_contrast_image = contrast_enhancer.enhance(1.5)  # Weniger kontrastieren

# Schärfen und Rauschen mit Median-Filter reduzieren
sharpened_image = high_contrast_image.filter(ImageFilter.UnsharpMask(radius=2, percent=120, threshold=3))
blurred_image = sharpened_image.filter(ImageFilter.MedianFilter(size=3))  # Schwächerer Filter

# Schritt 3: Bildschwellenwertanpassung
# Verwende eine sanfte Schwellenwertsetzung, um Details zu bewahren
threshold_image = blurred_image.point(lambda p: p > 160 and 255)  # Erhöhe den Schwellenwert etwas auf 160

# Konvertiere in binär (Schwarz-Weiß)
threshold_image = threshold_image.convert('1')

# Bildoperationen für besseres Trennen von Zahlen und Punkten
# Bild in Numpy-Array umwandeln
np_image = np.array(threshold_image)

# Konvertiere in np.uint8 (Werte: 0 und 255)
np_image = np.uint8(np_image) * 255  # Skaliere von bool (True/False) zu 255 (weiße Pixel) und 0 (schwarze Pixel)

# Morphologische Erosion und Dilatation vorsichtig anwenden
kernel = np.ones((2, 2), np.uint8)  # Kleineren Kernel verwenden, um Details zu erhalten
eroded_image = cv2.erode(np_image, kernel, iterations=1)
dilated_image = cv2.dilate(eroded_image, kernel, iterations=1)

# Zurück in PIL konvertieren
final_image = Image.fromarray(dilated_image)

# Optional: Perspektive korrigieren (z.B. bei schrägen Texten)
rotated_image = final_image.rotate(-1, expand=True)

# Vorverarbeitetes Bild speichern (Debugging)
rotated_image.save("processed_image_optimized_final.png")
print("Verarbeitetes Bild gespeichert als 'processed_image_optimized_final.png'")

# Schritt 4: OCR anwenden
print("OCR wird angewendet...")

# Tesseract-Konfiguration
custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789.'

# Text mit Tesseract extrahieren
ocr_result = pytesseract.image_to_string(rotated_image, config=custom_config)

# Vollständiges OCR-Ergebnis ausgeben (Debugging)
print("OCR-Ergebnis:")
print(ocr_result)

# Schritt 5: Raumzahlen mit Regex extrahieren
def extract_formatted_room_numbers(ocr_text):
    room_number_pattern = r'\b\d+(\.\d+)*\b'  # Muster für Zahlen wie 1.1.10, 7.8, 3.17
    return re.findall(room_number_pattern, ocr_text)

# Regex auf OCR-Ergebnis anwenden
room_numbers = extract_formatted_room_numbers(ocr_result)

# Schritt 6: Extrahierte Raumzahlen ausgeben
print("Extrahierte Raumzahlen:")
print(room_numbers)

# Debugging: Teste die Regex separat
test_text = "1.1.10 2.2.05 3.17 7.8 9.2.5"
print("Regex-Test:")
print(re.findall(r'\b\d+(\.\d+)*\b', test_text))
