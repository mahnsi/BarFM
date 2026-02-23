from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess

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

    # run visualization script
    try:
        subprocess.run(
            ['python', 'visual/visplot.py'],
            check=True
        )
    except subprocess.CalledProcessError as e:
        print("Error running visualization script:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

    return jsonify({"status": "success", "animation_url": "/animation"}), 200

@app.route('/animation')
def get_animation():
    return send_from_directory('visual', 'visplot_gif.gif')

if __name__ == '__main__':
    app.run(port=5000)
