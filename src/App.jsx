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

const BANGLA_MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

const toBanglaDigit = (num) => {
  const digits = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  return num.toString().replace(/[0-9]/g, x => digits[x]);
};

export default function App() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [isEditing, setIsEditing] = useState(false);

  const currentDate = new Date();
  const [monthIndex, setMonthIndex] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const [electric, setElectric] = useState(0);
  const [gas, setGas] = useState(0);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    const docId = `house_${year}_${monthIndex}`;
    const ref = doc(db, "house", docId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setElectric(d.electric || 0);
        setGas(d.gas || 0);
        setExtra(d.extra || 0);
      } else {
        setElectric(0);
        setGas(0);
        setExtra(0);
      }
    });
    return () => unsub();
  }, [monthIndex, year]);

  const saveData = async () => {
    const docId = `house_${year}_${monthIndex}`;
    await setDoc(doc(db, "house", docId), { electric, gas, extra });
    setIsEditing(false);
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
      setIsEditing(true);
    }
  };

  const changeMonth = (offset) => {
    let newMonth = monthIndex + offset;
    let newYear = year;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    else if (newMonth < 0) { newMonth = 11; newYear--; }
    setMonthIndex(newMonth);
    setYear(newYear);
  };

  const checkEditAccess = () => {
    const pass = prompt("এডিট পিন দিন:");
    if (pass === EDIT_PIN) setIsEditing(true);
    else alert("ভুল পিন!");
  };

  if (showSplash) {
    return <video src="/splash_video.mp4" autoPlay muted playsInline className="w-full h-screen object-cover bg-black" />;
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-5">
        <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-sm backdrop-blur-md text-center">
          <h1 className="text-3xl mb-1">🏠</h1>
          <h2 className="text-xl font-medium text-slate-200 mb-6">৬১২ বাসা ম্যানেজমেন্ট</h2>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-center text-xl text-white tracking-[0.5em] mb-4 outline-none" placeholder="PIN" />
          <button onClick={handleLogin} className="w-full bg-emerald-600 text-white font-medium py-3 rounded-2xl">লগইন</button>
        </div>
      </div>
    );
  }

  const total = RENT + electric + gas + extra;
  const perPerson = total / MEMBERS.length;

  const renderHome = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#1e293b] rounded-3xl p-5 border border-slate-700">
        <div className="flex justify-between items-center bg-[#0f172a] rounded-2xl p-4 border border-slate-600 mb-6">
          <button onClick={() => changeMonth(-1)} className="text-slate-400 text-2xl px-2">&lt;</button>
          <h2 className="text-2xl font-bold text-white">{BANGLA_MONTHS[monthIndex]} - {toBanglaDigit(year)}</h2>
          <button onClick={() => changeMonth(1)} className="text-slate-400 text-2xl px-2">&gt;</button>
        </div>
        <div className="flex justify-between px-2">
          <div><p className="text-xs text-slate-400">জনপ্রতি বিল</p><p className="text-2xl font-bold text-emerald-400">৳ {toBanglaDigit(perPerson.toFixed(0))}</p></div>
          <div className="text-right"><p className="text-xs text-slate-400">সর্বমোট বিল</p><p className="text-2xl font-bold text-slate-200">৳ {toBanglaDigit(total)}</p></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveView("members")} className="bg-[#d946ef] rounded-3xl p-6 h-40 font-bold text-2xl text-white">সদস্যদের<br/>তালিকা</button>
        <button onClick={() => setActiveView("expenses")} className="bg-[#7c3aed] rounded-3xl p-6 h-40 font-bold text-2xl text-white">খরচ সমূহ</button>
        <button onClick={() => setActiveView("rules")} className="bg-[#b91c1c] rounded-3xl p-6 h-40 font-bold text-2xl text-white">পরিষ্কারের<br/>নিয়ম</button>
        <button onClick={() => setActiveView("schedule")} className="bg-[#5eead4] rounded-3xl p-6 h-40 font-bold text-2xl text-slate-800">পরিষ্কারের<br/>সিডিউল</button>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="animate-fade-in">
      <button onClick={() => {setActiveView("home"); setIsEditing(false);}} className="mb-6 text-emerald-400">&larr; ফিরে যান</button>
      <div className="bg-slate-800 p-6 rounded-3xl space-y-4 mb-6">
        <div className="flex justify-between border-b border-slate-700 pb-3"><span className="text-slate-300">বাসা ভাড়া</span><span className="text-white font-bold">৳ {toBanglaDigit(RENT)}</span></div>
        <div className="flex justify-between border-b border-slate-700 pb-3"><span className="text-slate-300">বিদ্যুৎ বিল</span><span className="text-white font-bold">৳ {toBanglaDigit(electric)}</span></div>
        <div className="flex justify-between border-b border-slate-700 pb-3"><span className="text-slate-300">গ্যাস বিল</span><span className="text-white font-bold">৳ {toBanglaDigit(gas)}</span></div>
        <div className="flex justify-between"><span className="text-slate-300">অন্যান্য খরচ</span><span className="text-white font-bold">৳ {toBanglaDigit(extra)}</span></div>
      </div>
      {!isEditing ? (
        <button onClick={checkEditAccess} className="w-full bg-slate-700 text-slate-200 py-4 rounded-2xl font-bold">হিসাব সংশোধন করুন</button>
      ) : (
        <div className="bg-slate-900 p-5 rounded-3xl border border-blue-500/30 space-y-4">
          <input type="number" placeholder="বিদ্যুৎ" value={electric || ""} onChange={e=>setElectric(Number(e.target.value))} className="w-full bg-slate-800 p-3 rounded-xl text-white text-center" />
          <input type="number" placeholder="গ্যাস" value={gas || ""} onChange={e=>setGas(Number(e.target.value))} className="w-full bg-slate-800 p-3 rounded-xl text-white text-center" />
          <input type="number" placeholder="অন্যান্য" value={extra || ""} onChange={e=>setExtra(Number(e.target.value))} className="w-full bg-slate-800 p-3 rounded-xl text-white text-center" />
          <button onClick={saveData} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">আপডেট সেভ করুন</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans pb-10 text-slate-300">
      <div className="pt-10 pb-6 text-center">
        <h1 className="text-2xl font-bold text-teal-400">৬১২ বাসা ম্যানেজমেন্ট</h1>
        <p className="text-slate-400 text-sm">হিসাব-নিকাশ ও ড্যাশবোর্ড</p>
      </div>
      <div className="px-5 max-w-md mx-auto">
        {activeView === "home" && renderHome()}
        {activeView === "expenses" && renderExpenses()}
        {activeView === "members" && (
          <div className="animate-fade-in">
            <button onClick={() => setActiveView("home")} className="mb-6 text-emerald-400">&larr; ফিরে যান</button>
            <div className="space-y-3">
              {MEMBERS.map((m, i) => (
                <div key={i} className="bg-slate-800 p-4 rounded-2xl flex items-center gap-4">
                  <img src={m.img} className="w-16 h-16 rounded-full object-cover" onError={(e)=>e.target.src=`https://ui-avatars.com/api/?name=${m.name}&background=334155&color=10b981`} />
                  <div className="flex-1"><p className="text-xl font-bold text-white">{m.name}</p><p className="text-sm text-slate-400">রুমমেট</p></div>
                  <p className="text-lg font-bold text-emerald-400">৳ {toBanglaDigit(perPerson.toFixed(0))}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeView === "schedule" && (
          <div className="animate-fade-in">
            <button onClick={() => setActiveView("home")} className="mb-6 text-emerald-400">&larr; ফিরে যান</button>
            <div className="bg-[#5eead4] p-6 rounded-3xl text-slate-900">
              <h2 className="text-2xl font-bold mb-6 text-center">পরিষ্কারের সিডিউল</h2>
              {getSchedule().map((s, i) => (
                <div key={i} className="flex justify-between bg-white/40 p-4 rounded-2xl mb-2 font-bold"><span>{s.name}</span><span>{toBanglaDigit(s.date)} তারিখ</span></div>
              ))}
            </div>
          </div>
        )}
        {activeView === "rules" && (
          <div className="animate-fade-in">
            <button onClick={() => setActiveView("home")} className="mb-6 text-emerald-400">&larr; ফিরে যান</button>
            <div className="bg-[#b91c1c] p-6 rounded-3xl text-white">
              <h2 className="text-2xl font-bold mb-6 text-center">পরিষ্কারের নিয়মাবলি</h2>
              {rules.map((r, i) => (
                <div key={i} className="flex gap-4 bg-black/20 p-4 rounded-2xl mb-2"><span className="font-bold">✓</span><p className="text-sm">{r}</p></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
