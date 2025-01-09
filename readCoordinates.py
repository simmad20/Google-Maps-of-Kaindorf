import cv2

# Load the image
image = cv2.imread('./kaindorfMap.png')  # Replace with the path to your image file

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply threshold to detect edges
_, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

# Detect contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Prepare the React-compatible format for output
rooms = []
for i, cnt in enumerate(contours):
    x, y, w, h = cv2.boundingRect(cnt)
    room_object = {
        "id": f"room{i + 1}",
        "label": f"Room {i + 101}",  # Starting labels from 101, adjust as needed
        "style": {
            "top": f"{y}px",
            "left": f"{x}px",
            "width": f"{w}px",
            "height": f"{h}px"
        }
    }
    rooms.append(room_object)

# Print out the list in React-friendly format
print("const rooms = [")
for room in rooms:
    print(f"    {room},")
print("];")
