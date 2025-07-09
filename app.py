from flask import Flask, request, jsonify,render_template,Response,CORS
import json,time,os,csv
app = Flask(__name__)


latest_data = {}
@app.route('/')
def dashboard():
    return render_template('dashboard.html')
# Receive sensor data from IoT
@app.route('/iot/data', methods=['POST'])
def receive_data():
    global latest_data
    data = request.json
    latest_data = data  # store it
    print(f"Data from IoT: {data}")
    with open('data_log.json', 'a') as f:
        f.write(json.dumps(data) + '\n')

    print(f"Data from IoT: {data}")
    return jsonify({"status": "received"})


@app.route('/dashboard-data', methods=['GET'])
def dashboard_data():
    return jsonify(latest_data)

# Send command to IoT device (optional)
@app.route('/iot/command', methods=['GET'])
def send_command():
    # Replace with real logic
    command = {"servo": "on", "led": "off"}
    return jsonify(command)



@app.route('/history')
def view_history():
    try:
        with open('data_log.json', 'r') as f:
            lines = f.readlines()
            entries = [json.loads(line) for line in lines]
    except FileNotFoundError:
        entries = []
    return render_template('history.html', entries=entries)

@app.route('/clear-history')
def clear_history():
    try:
        open('data_log.json', 'w').close()  # clear file
    except FileNotFoundError:
        pass
    return render_template('history.html', entries=[])




@app.route('/download-csv')
def download_csv():
    try:
        with open('data_log.json', 'r') as f:
            lines = f.readlines()
            entries = [json.loads(line) for line in lines]
    except FileNotFoundError:
        entries = []

    def generate():
        header = ['timestamp', 'motion', 'distance', 'rfid', 'door']
        yield ','.join(header) + '\n'
        for e in entries:
            row = [
                e.get('timestamp', ''),
                str(e.get('motion', '')),
                str(e.get('distance', '')),
                e.get('rfid', ''),
                str(e.get('door', ''))
            ]
            yield ','.join(row) + '\n'

    return Response(generate(), mimetype='text/csv', headers={
        "Content-Disposition": "attachment; filename=logs.csv"
    })


@app.route('/iot/servo', methods=['POST'])
def trigger_servo():
    print("🚪 Door close command received!")
    return jsonify({"status": "Door closed (servo triggered)"})


@app.route('/iot/reset', methods=['POST'])
def reset_system():
    print("🔄 System reset requested.")
    

    global latest_data
    latest_data = {}

 

    return jsonify({"status": "System reset successful!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
