import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const MEMBERS = [
  { name: "জাকির", img: "/jakir.jpeg", phone: "০১৭০০-০০০০০১" },
  { name: "ফখরুল", img: "/fokrul.jpeg", phone: "০১৮০০-০০০০০২" },
  { name: "রকিব", img: "/rokib.jpeg", phone: "০১৯০০-০০০০০৩" },
  { name: "মহসিন", img: "/mahsin.jpeg", phone: "০১৬০০-০০০০০৪" },
  { name: "জিসান", img: "/jisan.jpeg", phone: "০১৫০০-০০০০০৫" },
  { name: "নোকিব", img: "/noqib.jpeg", phone: "০১৩০০-০০০০০৬" },
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
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#0f172a] to-black px-5">
        <div className="bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl w-full max-w-sm backdrop-blur-xl text-center">
          <h1 className="text-4xl mb-3">🏠</h1>
          <h2 className="text-2xl font-medium text-white mb-8 tracking-wide">৬১২ বাসা ম্যানেজমেন্ট</h2>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full p-4 bg-black/30 border border-white/10 rounded-2xl text-center text-2xl text-white tracking-[0.5em] mb-6 outline-none backdrop-blur-sm focus:border-white/30 transition-colors" placeholder="PIN" />
          <button onClick={handleLogin} className="w-full bg-emerald-500/80 hover:bg-emerald-500 text-white font-medium py-4 rounded-2xl backdrop-blur-md transition-colors text-lg">লগইন</button>
        </div>
      </div>
    );
  }

  const total = RENT + electric + gas + extra;
  const perPerson = total / MEMBERS.length;

  const renderHome = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
        <div className="flex justify-between items-center bg-black/20 rounded-2xl p-4 border border-white/10 mb-6 backdrop-blur-sm">
          <button onClick={() => changeMonth(-1)} className="text-white/60 hover:text-white text-2xl px-3 transition-colors">&lt;</button>
          <h2 className="text-2xl font-bold text-white tracking-wide">{BANGLA_MONTHS[monthIndex]} - {toBanglaDigit(year)}</h2>
          <button onClick={() => changeMonth(1)} className="text-white/60 hover:text-white text-2xl px-3 transition-colors">&gt;</button>
        </div>
        <div className="flex justify-between px-2 items-end">
          <div><p className="text-sm text-white/60 mb-1">জনপ্রতি বিল</p><p className="text-3xl font-bold text-emerald-400">৳ {toBanglaDigit(perPerson.toFixed(0))}</p></div>
          <div className="text-right"><p className="text-sm text-white/60 mb-1">সর্বমোট বিল</p><p className="text-xl font-medium text-white">৳ {toBanglaDigit(total)}</p></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-5">
        <button onClick={() => setActiveView("members")} className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 h-40 flex items-center justify-center shadow-lg active:scale-95 transition-all group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative text-xl font-bold text-white text-center leading-relaxed">সদস্যদের<br/>তালিকা</span>
        </button>
        
        <button onClick={() => setActiveView("expenses")} className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 h-40 flex items-center justify-center shadow-lg active:scale-95 transition-all group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative text-xl font-bold text-white text-center">খরচ সমূহ</span>
        </button>
        
        <button onClick={() => setActiveView("rules")} className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 h-40 flex items-center justify-center shadow-lg active:scale-95 transition-all group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative text-xl font-bold text-white text-center leading-relaxed">পরিষ্কারের<br/>নিয়ম</span>
        </button>
        
        <button onClick={() => setActiveView("schedule")} className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 h-40 flex items-center justify-center shadow-lg active:scale-95 transition-all group">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative text-xl font-bold text-white text-center leading-relaxed">পরিষ্কারের<br/>সিডিউল</span>
        </button>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="animate-fade-in">
      <button onClick={() => {setActiveView("home"); setIsEditing(false);}} className="mb-6 text-white/70 hover:text-white flex items-center gap-2 transition-colors"><span className="text-xl">&larr;</span> ফিরে যান</button>
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-7 rounded-3xl space-y-5 mb-6 shadow-xl">
        <div className="flex justify-between border-b border-white/10 pb-4"><span className="text-white/80 text-lg">বাসা ভাড়া</span><span className="text-white font-bold text-lg">৳ {toBanglaDigit(RENT)}</span></div>
        <div className="flex justify-between border-b border-white/10 pb-4"><span className="text-white/80 text-lg">বিদ্যুৎ বিল</span><span className="text-white font-bold text-lg">৳ {toBanglaDigit(electric)}</span></div>
        <div className="flex justify-between border-b border-white/10 pb-4"><span className="text-white/80 text-lg">গ্যাস বিল</span><span className="text-white font-bold text-lg">৳ {toBanglaDigit(gas)}</span></div>
        <div className="flex justify-between"><span className="text-white/80 text-lg">অন্যান্য খরচ</span><span className="text-white font-bold text-lg">৳ {toBanglaDigit(extra)}</span></div>
      </div>
      {!isEditing ? (
        <button onClick={checkEditAccess} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-2xl font-bold text-lg backdrop-blur-md transition-all shadow-lg">হিসাব সংশোধন করুন</button>
      ) : (
        <div className="bg-black/40 p-6 rounded-3xl border border-blue-400/30 space-y-4 backdrop-blur-xl shadow-2xl mt-6">
          <input type="number" placeholder="বিদ্যুৎ" value={electric || ""} onChange={e=>setElectric(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-center text-lg focus:outline-none focus:border-blue-400/50 transition-colors" />
          <input type="number" placeholder="গ্যাস" value={gas || ""} onChange={e=>setGas(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-center text-lg focus:outline-none focus:border-blue-400/50 transition-colors" />
          <input type="number" placeholder="অন্যান্য" value={extra || ""} onChange={e=>setExtra(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-center text-lg focus:outline-none focus:border-blue-400/50 transition-colors" />
          <button onClick={saveData} className="w-full bg-blue-500/80 hover:bg-blue-500 border border-blue-400/30 text-white font-bold py-4 rounded-2xl text-lg transition-colors mt-2">আপডেট সেভ করুন</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#0f172a] to-black font-sans pb-10 text-slate-300">
      <div className="pt-10 pb-8 text-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">৬১২ বাসা ম্যানেজমেন্ট</h1>
        <p className="text-white/50 text-sm mt-1">হিসাব-নিকাশ ও ড্যাশবোর্ড</p>
      </div>
      <div className="px-5 max-w-md mx-auto">
        {activeView === "home" && renderHome()}
        {activeView === "expenses" && renderExpenses()}
        {activeView === "members" && (
          <div className="animate-fade-in">
            <button onClick={() => setActiveView("home")} className="mb-6 text-white/70 hover:text-white flex items-center gap-2 transition-colors"><span className="text-xl">&larr;</span> ফিরে যান</button>
            <div className="grid grid-cols-2 gap-4">
              {MEMBERS.map((m, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl flex flex-col items-center text-center shadow-lg hover:bg-white/15 transition-colors">
                  <img src={m.img} className="w-20 h-20 rounded-full object-cover border-2 border-white/30 mb-4 shadow-inner" onError={(e)=>e.target.src=`https://ui-avatars.com/api/?name=${m.name}&background=334155&color=ffffff`} />
                  <p className="text-lg font-bold text-white mb-1">{m.name}</p>
                  <p className="text-xs font-medium text-emerald-400 tracking-wide">{toBanglaDigit(m.phone)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeView === "schedule" && (
          <div className="animate-fade-in">
            <button onClick={() => setActiveView("home")} className="mb-6 text-white/70 hover:text-white flex items-center gap-2 transition-colors"><span className="text-xl">&larr;</span> ফিরে যান</button>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold mb-8 text-center text-white">পরিষ্কারের সিডিউল</h2>
              {getSchedule().map((s, i) => (
                <div key={i} className="flex justify-between items-center bg-black/20 p-4 rounded-2xl mb-3 border border-white/5 shadow-sm">
                  <span className="text-white text-lg">{s.name}</span>
                  <span className="text-emerald-300 font-medium">{toBanglaDigit(s.date)} তারিখ</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeView === "rules" && (
          <div className="animate-fade-in">
            <button onClick={() => setActiveView("home")} className="mb-6 text-white/70 hover:text-white flex items-center gap-2 transition-colors"><span className="text-xl">&larr;</span> ফিরে যান</button>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold mb-8 text-center text-white">পরিষ্কারের নিয়মাবলি</h2>
              {rules.map((r, i) => (
                <div key={i} className="flex gap-4 bg-black/20 p-4 rounded-2xl mb-3 border border-white/5 shadow-sm items-start">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <p className="text-white/90 text-sm leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
