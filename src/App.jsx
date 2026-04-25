import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const MEMBERS = [
  { name: "জাকির", img: "/jakir.jpeg" },
  { name: "ফখরুল", img: "/fokrul.jpeg" },
  { name: "রকিব", img: "/rokib.jpeg" },
  { name: "মহসিন", img: "/mahsin.jpeg" },
  { name: "জিসান", img: "/jisan.jpeg" },
  { name: "নোকিব", img: "/noqib.jpeg" },
];

const RENT = 1850;
const LOGIN_PIN = "7307";
const EDIT_PIN = "8019";

const rules = [
  "কিচেন রুম ও গলি ঝাড়ু ও মোব দিতে হবে",
  "চুলার উপরে-নিচে পরিষ্কার করতে হবে",
  "ফ্রিজ ভিতরে-বাহিরে পরিষ্কার করতে হবে",
  "ডাইনিং টেবিল পরিষ্কার করতে হবে",
  "সিঙ্ক পরিষ্কার করতে হবে",
  "কিচেন ওয়াল মুছতে হবে",
  "বাথরুম, বাথরুমের ওয়াল, বাথটাব ও বেসিন পরিষ্কার করতে হবে",
  "রাত ১০টার আগে ময়লার ব্যাগ পরিবর্তন",
];

const getSchedule = () => {
  return MEMBERS.map((m, i) => ({
    name: m.name,
    date: `${i * 5 + 1} - ${i * 5 + 5}`,
  }));
};

export default function App() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const [electric, setElectric] = useState(0);
  const [gas, setGas] = useState(0);
  const [extra, setExtra] = useState(0);

  const [editMode, setEditMode] = useState(false);
  const [month, setMonth] = useState("");

  useEffect(() => {
    const ref = doc(db, "house", "current");

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setElectric(d.electric || 0);
        setGas(d.gas || 0);
        setExtra(d.extra || 0);
        setMonth(d.month || "");
      }
    });

    return () => unsub();
  }, []);

  const saveData = async () => {
    await setDoc(doc(db, "house", "current"), {
      electric,
      gas,
      extra,
      month,
    });
  };

  const handleLogin = () => {
    if (pin === LOGIN_PIN) {
      setShowSplash(true);
      setTimeout(() => {
  setShowSplash(false);
  setUnlocked(true);
}, 7000);
    } else if (pin === EDIT_PIN) {
      setUnlocked(true);
      setEditMode(true);
    }
  };

  if (showSplash) {
    return (
      <video
  src="/splash_video.mp4"
  autoPlay
  muted
  playsInline
  className="w-full h-screen object-cover"
/>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-white p-6 rounded-2xl text-center">
          <input
            type="password"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="p-3 border rounded-xl text-center text-black"
            placeholder="PIN"
          />
          <button onClick={handleLogin} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl w-full">
            Enter
          </button>
        </div>
      </div>
    );
  }

  const perRent = RENT / MEMBERS.length;
  const perElectric = electric / MEMBERS.length;
  const perGas = gas / MEMBERS.length;
  const perExtra = extra / MEMBERS.length;

  const total = perRent + perElectric + perGas + perExtra;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl text-center mb-4">🏠 ৬১২ বাসা ম্যানেজমেন্ট</h1>

  <input
    value={month}
    onChange={(e) => setMonth(e.target.value)}
    placeholder="মাস (যেমন: মার্চ ২০২৬)"
    className="w-full p-3 rounded-xl text-black mb-4 text-center font-semibold"
  />

      {editMode && (
        <div className="bg-white text-black p-4 rounded-xl space-y-2">
          <input type="number" placeholder="বিদ্যুৎ" value={electric || ""} onChange={e=>setElectric(Number(e.target.value))} className="w-full p-2 border rounded"/>
          <input type="number" placeholder="গ্যাস" value={gas || ""} onChange={e=>setGas(Number(e.target.value))} className="w-full p-2 border rounded"/>
          <input type="number" placeholder="অন্যান্য খরচ" value={extra || ""} onChange={e=>setExtra(Number(e.target.value))} className="w-full p-2 border rounded"/>
          <button onClick={saveData} className="bg-green-600 text-white w-full py-2 rounded-xl">Save</button>
        </div>
      )}

      <div className="space-y-3 mt-5">
        {MEMBERS.map((m, i) => (
          <div key={i} className="bg-white text-black p-3 rounded-xl flex gap-3 items-center">
            <img
  src={m.img}
  alt={m.name}
  className="w-14 h-14 rounded-xl object-cover"
  onError={(e)=> {
    e.target.src = "https://via.placeholder.com/100?text=No+Image"
  }}
/>
            <div>
              <p className="text-lg font-bold">{m.name}</p>
              <p>মোট: ৳{total.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-purple-600 p-4 rounded-xl">
        <h2 className="text-xl mb-2 text-white">🧹বাসা পরিষ্কারের সিডিউল</h2>
        {getSchedule().map((s, i) => (
          <p key={i} className="text-white">{s.name} → {s.date}</p>
        ))}
      </div>

      <div className="mt-6 bg-green-600 p-4 rounded-xl">
        <h2 className="text-xl mb-2 text-white">📋বাসা পরিষ্কারের নিয়মাবলি</h2>
        {rules.map((r, i) => (
          <p key={i} className="text-white">✅ {r}</p>
        ))}
      </div>
    </div>
  );
}
