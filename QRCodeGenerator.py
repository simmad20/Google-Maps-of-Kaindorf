import qrcode
import json
from pathlib import Path

OUTPUT_DIR = Path("qr_codes")
OUTPUT_DIR.mkdir(exist_ok=True)

def create_room_qr(room: dict, size=300):
    """
    Erstellt einen QR-Code für einen Raum
    und speichert ihn als eigene PNG-Datei.
    """

    required_keys = {"type", "roomId", "floor", "x", "y"}
    if not required_keys.issubset(room):
        raise ValueError(f"Fehlende Keys in Room-Daten: {room}")

    qr_payload = json.dumps(room, separators=(",", ":"))

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )

    qr.add_data(qr_payload)
    qr.make(fit=True)

    img = (
        qr.make_image(fill_color="black", back_color="white")
        .convert("RGBA")
        .resize((size, size))
    )

    filename = OUTPUT_DIR / f"qr_room_{room['roomId']}.png"
    img.save(filename)

    print(f"QR erstellt: {filename}")


# =========================
# ROOM DEFINITIONS
# =========================

rooms = [
    {
        "type": "room",
        "roomId": "1.1.13",
        "floor": "UG",
        "x": 185,
        "y": 180,
    }
]

if __name__ == "__main__":
    for room in rooms:
        create_room_qr(room)