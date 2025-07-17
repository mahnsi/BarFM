from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/save_data', methods=['POST'])
def save_data():
    data = request.get_json()
    print("Received from JS:", data)

    # You can also save to file
    with open('output.json', 'w') as f:
        import json
        json.dump(data, f, indent=2)

    return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    app.run(port=5000)
