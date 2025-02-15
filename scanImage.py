from PIL import Image
import cv2
import pytesseract
import pandas as pd
import re

# Bild laden
image_path = "og_described.png"
image = cv2.imread(image_path)

if image is None:
    print("Fehler: Bild konnte nicht geladen werden!")
    exit()

# Bildgröße erhöhen (Faktor 2 für bessere Erkennung)
scale_factor = 2
image = cv2.resize(image, (image.shape[1] * scale_factor, image.shape[0] * scale_factor), interpolation=cv2.INTER_CUBIC)

# In Graustufen umwandeln
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Kontrast verbessern mit Adaptive Thresholding
gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

# OCR mit optimierter Konfiguration
custom_config = r'--oem 3 --psm 6'  # psm 6 = einzelne Wörter, psm 11 = Sparse Text
data = pytesseract.image_to_data(gray, config=custom_config, output_type=pytesseract.Output.DICT)

# Ergebnisse filtern (nur einzelne Großbuchstaben)
results = []
for i in range(len(data["text"])):
    text = data["text"][i].strip()
    if re.match(r"^[A-Z]$", text):  # Nur Großbuchstaben A-Z
        x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]
        results.append({
            "Buchstabe": text,
            "x": x // scale_factor,  # Position auf Originalgröße umrechnen
            "y": y // scale_factor,
            "width": w // scale_factor,
            "height": h // scale_factor
        })

# Ergebnisse speichern
df = pd.DataFrame(results)
df.to_csv("raumpositionen.csv", index=False)

# Debug: Bounding Boxes auf Bild zeichnen
for r in results:
    x, y, w, h = r["x"], r["y"], r["width"], r["height"]
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv2.putText(image, r["Buchstabe"], (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

# Erkanntes Bild speichern
cv2.imwrite("erkanntes_bild.png", image)

print(df)

# Bild laden
image = Image.open("og_described.png")

# Größe des Bildes abrufen
width, height = image.size
print(f"Breite: {width}px, Höhe: {height}px")