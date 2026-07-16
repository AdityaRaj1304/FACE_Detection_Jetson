import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { Database, AlertTriangle, CheckCircle, Loader2, Cpu, Camera, Users, Send } from 'lucide-react';
import axios from 'axios';

interface Student {
  student_id: string;
  full_name: string;
}

export default function Settings() {
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState({ text: '', error: false });

  const [students, setStudents] = useState<Student[]>([]);
  const [simData, setSimData] = useState({
    student_id: '',
    camera_id: 1,
    similarity_score: 0.95,
    is_late_entry: false
  });
  const [simMsg, setSimMsg] = useState({ text: '', error: false });
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    // Fetch students for the simulator dropdown
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/students');
        if (res.data?.success) {
          setStudents(res.data.data);
          if (res.data.data.length > 0) {
            setSimData(prev => ({ ...prev, student_id: res.data.data[0].student_id }));
          }
        }
      } catch (err) {
        console.error("Failed to load students for simulator", err);
      }
    };
    fetchStudents();
  }, []);

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedMsg({ text: '', error: false });
    try {
      const res = await axios.post('http://localhost:3000/api/v1/analytics/seed');
      if (res.data?.success) {
        setSeedMsg({ text: 'Mock data successfully seeded! Database reset.', error: false });
      }
    } catch (err) {
      setSeedMsg({ text: 'Failed to seed mock data. Check backend logs.', error: true });
    } finally {
      setSeeding(false);
    }
  };

  const handleSimulateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simData.student_id) return;

    setSimulating(true);
    setSimMsg({ text: '', error: false });
    try {
      const student = students.find(s => s.student_id === simData.student_id);
      let res;
      
      if (simData.is_late_entry) {
        // Trigger Manual Late Entry (Fires Telegram)
        const payload = {
          studentId: simData.student_id,
          entryTime: new Date().toISOString(),
          reason: 'Simulated Manual Late Entry for Testing'
        };
        res = await axios.post('http://localhost:3000/api/v1/events/attendance/late-entry', payload, {
          headers: { 'x-api-key': 'JETSON_DEV_KEY' }
        });
      } else {
        // Trigger Hardware Camera Event
        const payload = {
          student_id: simData.student_id,
          student_name: student ? student.full_name : 'Unknown',
          timestamp: Math.floor(Date.now() / 1000), // Jetson sends epoch seconds
          similarity_score: simData.similarity_score,
          device_id: 'SIMULATOR_1',
          camera_id: simData.camera_id
        };
        res = await axios.post('http://localhost:3000/api/v1/events/attendance', payload, {
          headers: { 'x-api-key': 'JETSON_DEV_KEY' }
        });
      }
      
      if (res.data?.success) {
        setSimMsg({ text: `Simulated event sent successfully for ${student?.full_name}!`, error: false });
      }
    } catch (err) {
      setSimMsg({ text: 'Failed to send mock event.', error: true });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <TopBar title="System Settings & Developer Tools" />
      
      <main className="p-margin-desktop min-h-screen max-w-[1440px] mx-auto w-full">
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-stack-xl">
          
          {/* HARDWARE SIMULATOR */}
          <section className="glass-card rounded-3xl p-stack-lg border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20">
                  <Cpu size={24} />
                </div>
                <div>
                  <h3 className="font-headline-sm text-xl font-bold text-on-surface">Hardware Event Simulator</h3>
                  <p className="text-on-surface-variant font-body-md mt-1">
                    Manually inject an attendance event into the system exactly as if the Jetson Nano camera detected a face. This will trigger real-time dashboard updates and Telegram alerts.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSimulateEvent} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-[12px] font-bold text-on-surface-variant uppercase tracking-widest pl-2">
                    Target Student
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Users size={20} className="text-on-surface-variant" />
                    </div>
                    <select
                      value={simData.student_id}
                      onChange={(e) => setSimData({...simData, student_id: e.target.value})}
                      className="w-full bg-surface-container-lowest neu-inset border border-transparent focus:border-primary/50 text-on-surface text-lg rounded-2xl py-4 pl-12 pr-4 outline-none appearance-none"
                    >
                      {students.map(s => (
                        <option key={s.student_id} value={s.student_id}>{s.full_name} ({s.student_id})</option>
                      ))}
                      {students.length === 0 && <option value="">No students available - Seed DB first</option>}
                    </select>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="font-label-md text-[12px] font-bold text-on-surface-variant uppercase tracking-widest pl-2">
                      Camera (0=IN, 1=OUT)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Camera size={20} className="text-on-surface-variant" />
                      </div>
                      <select
                        value={simData.camera_id}
                        onChange={(e) => setSimData({...simData, camera_id: Number(e.target.value)})}
                        className="w-full bg-surface-container-lowest neu-inset border border-transparent focus:border-primary/50 text-on-surface text-lg rounded-2xl py-4 pl-12 pr-4 outline-none appearance-none"
                      >
                        <option value={0}>Camera 0 (Entrance)</option>
                        <option value={1}>Camera 1 (Exit)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <label className="font-label-md text-[12px] font-bold text-on-surface-variant uppercase tracking-widest pl-2">
                      Confidence Score
                    </label>
                    <div className="h-[60px] bg-surface-container-lowest neu-inset rounded-2xl px-4 flex items-center gap-4">
                      <input 
                        type="range" 
                        min="0.1" max="1.0" step="0.05"
                        value={simData.similarity_score}
                        onChange={(e) => setSimData({...simData, similarity_score: Number(e.target.value)})}
                        className="w-full accent-primary"
                      />
                      <span className="font-mono text-primary font-bold">{simData.similarity_score.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                  <input 
                    type="checkbox" 
                    id="lateEntry"
                    checked={simData.is_late_entry}
                    onChange={(e) => setSimData({...simData, is_late_entry: e.target.checked})}
                    className="w-5 h-5 rounded accent-primary bg-surface-container-highest border-transparent focus:ring-primary focus:ring-2 focus:ring-offset-2"
                  />
                  <label htmlFor="lateEntry" className="font-label-md text-[14px] text-on-surface cursor-pointer">
                    Simulate Warden Manual Late Entry (Fires Telegram Alert)
                  </label>
                </div>

                {simMsg.text && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 border ${simMsg.error ? 'bg-error/10 text-error border-error/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                    {simMsg.error ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                    <span className="font-label-md">{simMsg.text}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={simulating || students.length === 0}
                  className="w-full mt-2 py-4 rounded-2xl bg-primary-container text-on-primary-container font-headline-md text-lg font-bold flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(203,190,255,0.2)] hover:shadow-[0_0_30px_rgba(203,190,255,0.4)] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {simulating ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                  TRIGGER MOCK EVENT
                </button>
              </form>
            </div>
          </section>

          {/* BULK DB TOOLS */}
          <section className="glass-card rounded-3xl p-stack-lg border border-outline-variant/30 h-fit">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-error/10 text-error rounded-xl border border-error/20">
                <Database size={24} />
              </div>
              <div>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface">Database Reset & Mock Seed</h3>
                <p className="text-on-surface-variant font-body-md mt-1">
                  Warning: This will completely wipe all current students and attendance logs from the database, and replace them with a set of 5 mock students and realistic test logs (including late entries).
                </p>
              </div>
            </div>

            {seedMsg.text && (
              <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 border ${seedMsg.error ? 'bg-error/10 text-error border-error/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                {seedMsg.error ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                <span className="font-label-md">{seedMsg.text}</span>
              </div>
            )}

            <button 
              onClick={handleSeedData}
              disabled={seeding}
              className="glass-button bg-error/10 border-error/30 text-error hover:bg-error/20 px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 w-full justify-center"
            >
              {seeding ? <Loader2 size={18} className="animate-spin" /> : <AlertTriangle size={18} />}
              {seeding ? 'Seeding Database...' : 'WIPE & SEED MOCK DATA'}
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}
