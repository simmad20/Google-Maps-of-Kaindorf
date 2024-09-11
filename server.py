import socket

def start_server():
    host = "0.0.0.0"  # Setzt den Server so, dass er auf allen verfügbaren Netzwerkadressen lauscht
    port = 27007      # Der Port, auf dem der Server lauscht

    # Socket erstellen
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(1)
    print(f"Server läuft und wartet auf Verbindungen unter {host}:{port}")

    # Unbegrenzte Schleife für den Empfang von Daten
    while True:
        conn, _ = server_socket.accept()
        data = conn.recv(1024).decode('utf-8')
        if not data:
            pass
        else:
            print(f"Empfangene Daten: {data}")

    #conn.close()

if __name__ == "__main__":
    start_server()