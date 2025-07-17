from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

# create an endpoint for flask server
@app.route('/save_data', methods=['POST'])
def save_data():
    data = request.get_json() # get_json gets the JSON data sent from the JS client in the request body on the call to this endpoint
    print("Received from JS:", data)

    # save to file
    with open('visual/output.json', 'w') as f:
        import json
        json.dump(data, f, indent=2)

    return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    app.run(port=5000)
