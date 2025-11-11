import cv2
from pyzbar.pyzbar import decode
from urllib.parse import urlparse, parse_qs

def scan_qr_from_image(image_path: str):
    """Liest QR-Codes aus einem Bild und gibt deren Inhalte zurück."""
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Datei nicht gefunden: {image_path}")

    decoded_objects = decode(img)
    if not decoded_objects:
        print("Keine QR-Codes gefunden.")
        return []

    results = []
    for obj in decoded_objects:
        data = obj.data.decode("utf-8")
        print(f"QR erkannt: {data}")

        if data.startswith("https://play.google.com"):
            results.append({
                "type": "app_link",
                "url": data
            })
            print("Weiterleitung zur App!")
            # Optional: Browser öffnen
            # import webbrowser
            # webbrowser.open(data)
            continue

        if data.startswith("GMapsOfKaindorf:"):
            try:
                info = data.split(":")[1]
                parts = dict(item.split("=") for item in info.split(";"))
                results.append({
                    "type": "room_data",
                    "room": parts.get("Room"),
                    "x": int(parts.get("X")),
                    "y": int(parts.get("Y")),
                })
                print(f"Raum: {parts.get('Room')} | X={parts.get('X')} | Y={parts.get('Y')}")
            except Exception as e:
                print(f"Fehler beim Parsen der Raumdaten: {e}")

    return results


if __name__ == "__main__":
    path = "map_with_qr.png"
    scanned = scan_qr_from_image(path)

    print("\n✅ Ergebnisse:")
    for s in scanned:
        print(s)