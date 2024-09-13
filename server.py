from flask import Flask, request, jsonify

app = Flask(__name__)

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
def getTeachers():
    return ['Kohlweg', 'Valesi', 'Reischel', 'Gugerbauer']

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=27007)