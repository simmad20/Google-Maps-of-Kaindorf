from PIL import Image, ImageDraw
import qrcode

def create_qr(data, size=150):
    """Erstellt einen QR-Code als PIL-Image."""
    if not data:
        raise ValueError("QR-Daten dürfen nicht leer sein.")
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").resize((size, size))
    return img


def add_qr_to_map(map_path, qr_data_list, output_path="map_with_qr.png"):
    """
    Fügt mehrere QR-Codes zu einer Gebäudekarte hinzu.
    qr_data_list = [
        {"data": "...", "pos": (x, y)},
        ...
    ]
    """
    base = Image.open(map_path).convert("RGBA")
    draw = ImageDraw.Draw(base)

    for entry in qr_data_list:
        data = entry.get("data")
        pos = entry.get("pos")

        if not data or not pos:
            continue

        qr_img = create_qr(data)
        base.paste(qr_img, pos, qr_img.convert("RGBA"))

    base.save(output_path)
    print(f"Karte mit QR-Codes gespeichert unter: {output_path}")

google_play_url = "https://play.google.com/store/apps/details?id=com.example.gmapsofkaindorf"

room_qrs = [
    {"data": "GMapsOfKaindorf:Room=1.1.13;X=120;Y=200", "pos": (120, 200)},
    {"data": "GMapsOfKaindorf:Room=1.1.14;X=300;Y=200", "pos": (300, 200)},
    {"data": "GMapsOfKaindorf:Room=1.1.15;X=480;Y=200", "pos": (480, 200)},
]

all_qrs = [{"data": google_play_url, "pos": (50, 50)}] + room_qrs

if __name__ == "__main__":
    add_qr_to_map("OG.png", all_qrs, "map_with_qr.png")