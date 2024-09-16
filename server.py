from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE_PATH = './HandyApp/GMapsOfKaindorf/assets/data/teachers.json'

@app.route('/gyro', methods=['POST'])
def receive_gyro_data():
    data = request.get_json()
    if data and 'data' in data:
        gyro_data = data['data']
        print(f"Empfangene Gyroskop-Daten: {gyro_data}")
        return jsonify({'status': 'success', 'message': 'Daten empfangen'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Keine Daten empfangen'}), 400
    
@app.route('/getTeachers', methods=['GET'])
def get_teachers():
    if os.path.exists(DATA_FILE_PATH):
        try:
            with open(DATA_FILE_PATH, 'r', encoding='utf-8') as file:
                data = json.load(file)
                
                if isinstance(data, list):
                    return jsonify(data), 200
                else:
                    return jsonify({'status': 'error', 'message': 'Ungültiges Datenformat in der Datei'}), 500
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'Fehler beim Lesen der Datei: {str(e)}'}), 500
    else:
        return jsonify({'status': 'error', 'message': 'Datei nicht gefunden'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=27007)