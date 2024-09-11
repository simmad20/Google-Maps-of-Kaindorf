from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.clock import Clock
from plyer import gyroscope
import socket
from threading import Thread
import time

class GyroApp(App):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.server_ip = '192.168.222.3'  # Ersetzen Sie dies durch die IP-Adresse Ihres Servers
        self.server_port = 27007           # Ersetzen Sie dies durch den Port Ihres Servers
        self.current_gyro_data = (0.0, 0.0, 0.0)
        self.send_thread_running = False
        self.is_gyroscope_enabled = False

    def build(self):
        self.title = "Gyroskop-Daten"
        self.main_layout = BoxLayout(orientation='vertical', padding=20, spacing=20)
        
        # Ein Layout für den Text, zentriert
        self.label = Label(
            text="Warte auf Gyroskop-Daten...",
            font_size='24sp',
            halign='center',
            valign='middle',
            size_hint=(1, 0.8)
        )
        self.main_layout.add_widget(self.label)

        # Layout für den Button, am unteren Rand
        self.button = Button(
            text="Start Gyroskop",
            size_hint=(1, None),
            height=60,  # Höhe des Buttons
            font_size='20sp',
            bold=True,
            background_color=(0, 0.5, 1, 1),  # Hintergrundfarbe des Buttons (Blau)
            color=(1, 1, 1, 1)  # Textfarbe (Weiß)
        )
        self.button.bind(on_press=self.toggle_gyroscope)

        # Füge den Button zum Layout hinzu
        self.main_layout.add_widget(self.button)

        # Window-Size-Handler für dynamische Anpassung
        self.bind(on_resize=self.update_button_size)

        return self.main_layout

    def on_window_size(self, *args):
        # Update text_size to adjust text width to window size
        self.label.text_size = (self.window.width, None)

    def update_button_size(self, instance, width, height):
        # Setze die Breite des Buttons entsprechend der Fensterbreite
        self.button.width = width
        self.button.text_size = (width, None)  # Optional: Textgröße anpassen

    def toggle_gyroscope(self, instance):
        if self.is_gyroscope_enabled:
            self.disable_gyroscope()
            self.button.text = "Start Gyroskop"
        else:
            self.enable_gyroscope()
            self.button.text = "Stop Gyroskop"

        self.is_gyroscope_enabled = not self.is_gyroscope_enabled

    def enable_gyroscope(self):
        try:
            gyroscope.enable()
            Clock.schedule_interval(self.update_gyro, 1.0 / 10)  # Update alle 0,1 Sekunden
            self.send_thread = Thread(target=self.send_gyro_data)
            self.send_thread_running = True
            self.send_thread.start()
        except NotImplementedError:
            self.label.text = "Gyroskop nicht unterstützt"
            print("Gyroskop nicht auf diesem Gerät verfügbar\n"
                  "oder nicht aktiviert.\n")

    def disable_gyroscope(self):
        try:
            gyroscope.disable()
            Clock.unschedule(self.update_gyro)
            self.send_thread_running = False  # Stoppe den Thread zum Senden der Daten
            self.send_thread.join()  # Warte, bis der Thread gestoppt ist
        except NotImplementedError:
            self.label.text = "Gyroskop nicht verfügbar zum Deaktivieren\n"
            print("Fehler beim Deaktivieren des Gyroskops\n")

    def update_gyro(self, dt):
        try:
            gyro_data = gyroscope.rotation
            if gyro_data is not None and all(gyro_data):
                self.label.text = (
                    f"Gyroskop-Daten:\nX: {gyro_data[0]:.2f}\n"
                    f"Y: {gyro_data[1]:.2f}\nZ: {gyro_data[2]:.2f}\n"
                )
                self.current_gyro_data = gyro_data
            else:
                self.label.text = "Keine gültigen Gyroskop-Daten"
        except NotImplementedError:
            self.label.text = "Gyroskop nicht verfügbar"
        except Exception as e:
            self.label.text = f"Fehler: {str(e)}"
            print(f"Fehler beim Abrufen der Gyrodaten: {e}")

    def send_gyro_data(self):
        while self.send_thread_running:
            if hasattr(self, 'current_gyro_data'):
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    s.settimeout(2)  # Timeout für den Verbindungsversuch
                    try:
                        s.connect((self.server_ip, self.server_port))
                        data_string = f"{self.current_gyro_data[0]:.2f},{self.current_gyro_data[1]:.2f},{self.current_gyro_data[2]:.2f}"
                        s.sendall(data_string.encode('utf-8'))
                        s.close()
                    except (socket.timeout, socket.error) as e:
                        print(f"Fehler beim Senden der Daten: {e}")
                        self.label.text = "Fehler beim Senden der Daten"
                except Exception as e:
                    print(f"Fehler beim Verbinden mit dem Server: {e}")
                    self.label.text = "Verbindungsfehler mit dem Server"
            time.sleep(1)  # Warte 1 Sekunde, bevor die Daten erneut gesendet werden

if __name__ == "__main__":
    GyroApp().run()