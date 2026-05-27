import 'dotenv/config'; // Must be the absolute first line
import mqtt from 'mqtt';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase via REST API (Bypasses all IPv6 restrictions!)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Connect to the Mosquitto Broker
const BROKER_URL = process.env.MQTT_BROKER_URL || 'wss://test.mosquitto.org:8089';
const client = mqtt.connect(BROKER_URL);

client.on('connect', () => {
  console.log('✅ Node.js Backend connected to MQTT Broker');
});

// --- ADD THESE DEBUG LOGS ---
client.on('error', (err) => {
  console.error('❌ MQTT Connection Error:', err);
});

client.on('reconnect', () => {
  console.log('🔄 Attempting to reconnect to broker...');
});

client.on('offline', () => {
  console.log('🔌 Broker is unreachable (Offline).');
});
// -----------------------------
// Subscribe to all gate attendance topics
client.subscribe('campus/gates/+/attendance', { qos: 1 });

client.on('message', async (topic, message) => {
  try {
    const eventData = JSON.parse(message.toString());
    console.log(`📥 Received event from [${topic}]:`, eventData);

    // Insert into Supabase using the REST SDK
    const { data, error } = await supabase
      .from('attendance_logs')
      .insert([
        {
          student_id: eventData.student_id,
          // Convert Python's Unix timestamp (seconds) to a standard ISO date string
          detection_time: new Date(eventData.timestamp * 1000).toISOString(),
          cosine_similarity_score: eventData.similarity_score
        }
      ]);

    if (error) {
      console.error('❌ Supabase Insert Error:', error.message);
    } else {
      console.log(`✅ Successfully logged attendance for ${eventData.student_id}`);
    }

  } catch (error) {
    console.error('⚠️ Error processing MQTT message:', error);
  }
});