from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import subprocess
import time
import os
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for React Dashboard

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def generate_mjpeg_stream(source_id):
    """
    Generator function that continuously reads the latest frame
    from the RAM disk and yields it as a multipart JPEG.
    """
    file_path = f"/dev/shm/frame_{source_id}.jpg"
    while True:
        try:
            if os.path.exists(file_path):
                with open(file_path, 'rb') as f:
                    frame = f.read()
                
                if frame:
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            else:
                # If frame not found, wait a bit
                time.sleep(0.5)
        except Exception as e:
            logging.error(f"Error reading frame {source_id}: {e}")
            time.sleep(0.5)
            
        # Cap at roughly 20 FPS to save CPU
        time.sleep(0.05)

@app.route('/video_feed_0')
def video_feed_0():
    return Response(generate_mjpeg_stream(0), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed_1')
def video_feed_1():
    return Response(generate_mjpeg_stream(1), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start-enroll', methods=['POST'])
def start_enroll():
    data = request.json
    student_id = data.get('student_id')
    
    if not student_id:
        return jsonify({"status": "error", "message": "student_id is required"}), 400

    logging.info(f"Starting enrollment for student: {student_id}")
    
    try:
        # Run enroll_trt.py asynchronously
        subprocess.Popen(["python3", "enroll_trt.py", "--id", student_id])
        return jsonify({"status": "capturing"}), 200
    except Exception as e:
        logging.error(f"Failed to start enrollment: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    logging.info("Starting Edge Server on port 5001...")
    # host='0.0.0.0' allows external connections from the network
    app.run(host='0.0.0.0', port=5001, threaded=True)
