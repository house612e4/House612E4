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
        className="w-full h-screen object-cover bg-black"
      />
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-5">
        <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-sm backdrop-blur-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl text-emerald-400 mb-1">🏠</h1>
            <h2 className="text-xl font-medium text-slate-200">৬১২ বাসা ম্যানেজমেন্ট</h2>
          </div>
          <input
            type="password"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-center text-xl text-white tracking-[0.5em] focus:outline-none focus:border-emerald-500 transition-colors mb-4"
            placeholder="PIN"
          />
          <button onClick={handleLogin} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-2xl transition-colors">
            লগইন করুন
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
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pb-12 font-sans">
      <div className="pt-10 pb-6 px-5 bg-gradient-to-b from-slate-800/80 to-transparent">
        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          ৬১২ বাসা ম্যানেজমেন্ট
        </h1>
        <p className="text-center text-slate-500 text-sm mt-1">হিসাব-নিকাশ ও ড্যাশবোর্ড</p>
      </div>

      <div className="px-4 max-w-md mx-auto space-y-6">
        
        <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700 backdrop-blur-sm shadow-lg">
          <input
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="মাসের নাম (যেমন: মার্চ ২০২৬)"
            className="w-full bg-slate-900/50 border border-slate-600 p-3 rounded-xl text-slate-100 mb-5 text-center font-medium focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-slate-400 mb-1">জনপ্রতি বিল</p>
              <p className="text-3xl font-bold text-emerald-400">৳ {total.toFixed(0)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">সর্বমোট বিল</p>
              <p className="text-lg font-medium text-slate-300">৳ {(total * MEMBERS.length).toFixed(0)}</p>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="bg-slate-800 p-5 rounded-3xl border border-blue-500/30 space-y-3 shadow-lg">
            <h3 className="text-blue-400 font-medium mb-2">খরচ আপডেট করুন</h3>
            <div className="flex items-center gap-3">
              <label className="w-20 text-slate-400 text-sm">বিদ্যুৎ</label>
              <input type="number" value={electric || ""} onChange={e=>setElectric(Number(e.target.value))} className="flex-1 bg-slate-900 border border-slate-600 p-2.5 rounded-xl text-white focus:outline-none"/>
            </div>
            <div className="flex items-center gap-3">
              <label className="w-20 text-slate-400 text-sm">গ্যাস</label>
              <input type="number" value={gas || ""} onChange={e=>setGas(Number(e.target.value))} className="flex-1 bg-slate-900 border border-slate-600 p-2.5 rounded-xl text-white focus:outline-none"/>
            </div>
            <div className="flex items-center gap-3">
              <label className="w-20 text-slate-400 text-sm">অন্যান্য</label>
              <input type="number" value={extra || ""} onChange={e=>setExtra(Number(e.target.value))} className="flex-1 bg-slate-900 border border-slate-600 p-2.5 rounded-xl text-white focus:outline-none"/>
            </div>
            <button onClick={saveData} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl mt-2 transition-colors">
              সেভ করুন
            </button>
          </div>
        )}

        <div>
          <h2 className="text-sm font-medium text-slate-400 mb-3 px-2 uppercase tracking-wider">সদস্যদের তালিকা</h2>
          <div className="space-y-3">
            {MEMBERS.map((m, i) => (
              <div key={i} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 flex items-center gap-4 shadow-sm hover:border-slate-600 transition-colors">
                <div className="relative">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-600"
                    onError={(e)=> {
                      e.target.src = `https://ui-avatars.com/api/?name=${m.name}&background=334155&color=10b981&bold=true&font-size=0.4`
                    }}
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-800 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-slate-200">{m.name}</p>
                  <p className="text-xs text-slate-500">বকেয়া নেই</p>
                </div>
                <div className="pr-2">
                  <p className="text-lg font-bold text-slate-300">৳ {total.toFixed(0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800 p-6 rounded-3xl border border-indigo-500/20 mt-8">
          <h2 className="text-lg font-medium mb-4 text-indigo-300 flex items-center gap-2">
            <span>🧹</span> পরিষ্কারের সিডিউল
          </h2>
          <div className="space-y-2.5">
            {getSchedule().map((s, i) => (
              <div key={i} className="flex justify-between items-center pb-2 border-b border-slate-700/50 last:border-0 last:pb-0">
                <span className="text-slate-300">{s.name}</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-sm px-3 py-1 rounded-lg border border-indigo-500/30">{s.date} তারিখ</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800 p-6 rounded-3xl border border-emerald-500/20 mt-6">
          <h2 className="text-lg font-medium mb-4 text-emerald-400 flex items-center gap-2">
            <span>📋</span> নিয়মাবলি
          </h2>
          <div className="space-y-3">
            {rules.map((r, i) => (
              <div key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <p>{r}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
