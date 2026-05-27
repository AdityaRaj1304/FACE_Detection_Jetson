import sqlite3
import json
import time
import threading
from datetime import datetime
import random

# We use paho-mqtt. To install: pip install paho-mqtt
import paho.mqtt.client as mqtt

DB_FILE = 'attendance_buffer.db'
BROKER = 'test.mosquitto.org'
TOPIC = 'campus/gates/gate_1/attendance'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            similarity_score REAL NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def save_to_buffer(student_id, timestamp, similarity_score):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO events (student_id, timestamp, similarity_score)
        VALUES (?, ?, ?)
    ''', (student_id, timestamp, similarity_score))
    conn.commit()
    conn.close()
    print(f"[BUFFER] Saved to local DB: {student_id} at {timestamp}")

class SyncDaemon:
    def __init__(self):
        # Using CallbackAPIVersion to support both paho-mqtt v1 and v2, but keeping it simple for maximum compatibility
        try:
            self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        except AttributeError:
            self.client = mqtt.Client() # Fallback for paho-mqtt < 2.0
            
        self.client.on_connect = self.on_connect
        self.connected = False

    def on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            self.connected = True
            print("[DAEMON] Connected to MQTT broker.")
        else:
            print(f"[DAEMON] Connection failed with code {rc}")

    def run(self):
        self.client.connect(BROKER, 1883, 60)
        self.client.loop_start()

        while True:
            if not self.connected:
                time.sleep(2)
                continue

            try:
                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute('SELECT id, student_id, timestamp, similarity_score FROM events ORDER BY id ASC LIMIT 50')
                rows = cursor.fetchall()
                
                if not rows:
                    conn.close()
                    time.sleep(2)
                    continue

                for row in rows:
                    event_id, student_id, timestamp, similarity_score = row
                    payload = {
                        "student_id": student_id,
                        "timestamp": timestamp,
                        "similarity_score": similarity_score
                    }
                    
                    # Publish with QoS 1
                    msg_info = self.client.publish(TOPIC, json.dumps(payload), qos=1)
                    msg_info.wait_for_publish() # Wait for QoS 1 confirmation
                    
                    if msg_info.is_published():
                        print(f"[DAEMON] Published event {event_id} ({student_id}) to {TOPIC}")
                        cursor.execute('DELETE FROM events WHERE id = ?', (event_id,))
                        conn.commit()
                    else:
                        print(f"[DAEMON] Failed to publish event {event_id}. Retrying later.")
                        break # Break loop to try again later
                
                conn.close()
            except Exception as e:
                print(f"[DAEMON] Sync error: {e}")
                
            time.sleep(1) # Sleep before next batch

if __name__ == "__main__":
    print("Initializing edge buffer system...")
    init_db()
    
    daemon = SyncDaemon()
    sync_thread = threading.Thread(target=daemon.run, daemon=True)
    sync_thread.start()
    
    print("Starting mock camera feed (publishing every 3 seconds)...")
    try:
        while True:
            student_id = f"student_{random.randint(100, 999)}"
            timestamp = datetime.now().isoformat()
            similarity_score = round(random.uniform(0.65, 0.99), 2)
            
            save_to_buffer(student_id, timestamp, similarity_score)
            time.sleep(3)
    except KeyboardInterrupt:
        print("\nExiting edge node...")
