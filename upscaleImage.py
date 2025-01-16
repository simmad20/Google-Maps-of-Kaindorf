import cv2
import pytesseract
from PIL import Image

# Lade das Bild
image_path = './image.png'
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

# Upscaling des Bildes (Vergrößerung)
scale_factor = 2  # Beispiel: 2x Vergrößerung
new_width = int(image.shape[1] * scale_factor)
new_height = int(image.shape[0] * scale_factor)

# Hochskalieren des Bildes mit LANCZOS Interpolation
upscaled_image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

# OCR-Konfiguration: Ziffern und Punkte
custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789.'
text = pytesseract.image_to_string(Image.fromarray(upscaled_image), config=custom_config)

# Speichere das hochskalierte Bild
upscaled_image_path = './upscaled_image.png'
cv2.imwrite(upscaled_image_path, upscaled_image)

# Optional: Zeige das hochskalierte Bild
cv2.imshow('Upscaled Image', upscaled_image)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ausgabe des extrahierten Texts (Raumnummern)
print("Extrahierter Text nach Upscaling:")
print(text)

# Pfad zum gespeicherten hochskalierten Bild ausgeben
print(f"Hochskaliertes Bild wurde gespeichert unter: {upscaled_image_path}")
