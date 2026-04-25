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
  const [editMode, setEditMode] = useState(false);

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
    await setDoc(doc(db, "house", docId), {
      electric,
      gas,
      extra,
    });
    setActiveView("home");
  };

  const handleLogin = () => {
    if (pin === LOGIN_PIN) {
      setShowSplash(true);
      setTimeout(() => {
        setShowSplash(false);
        setUnlocked(true);
        setEditMode(false);
      }, 7000);
    } else if (pin === EDIT_PIN) {
      setUnlocked(true);
      setEditMode(true);
    }
  };

  const changeMonth = (offset) => {
    let newMonth = monthIndex + offset;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setMonthIndex(newMonth);
    setYear(newYear);
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

  const total = RENT + electric + gas + extra;
  const perPerson = total / MEMBERS.length;

  const renderHome = () => (
    <div className="animate-fade-in space-y-6">
      <div className="bg-[#1e293b] rounded-3xl p-5 border border-slate-700 shadow-lg">
        <div className="flex justify-between items-center bg-[#0f172a] rounded-2xl p-4 border border-slate-600 mb-6">
          <button onClick={() => changeMonth(-1)} className="text-slate-400 hover:text-white px-2 py-1 text-2xl">&lt;</button>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {BANGLA_MONTHS[monthIndex]} - {toBanglaDigit(year)}
          </h2>
          <button onClick={() => changeMonth(1)} className="text-slate-400 hover:text-white px-2 py-1 text-2xl">&gt;</button>
        </div>
        
        <div className="flex justify-between items-end px-2">
          <div>
            <p className="text-sm text-slate-400 mb-1">জনপ্রতি বিল</p>
            <p className="text-xl md:text-2xl font-bold text-slate-200">৳ {toBanglaDigit(perPerson.toFixed(0))}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400 mb-1">সর্বমোট বিল</p>
            <p className="text-xl md:text-2xl font-bold text-slate-200">৳ {toBanglaDigit(total)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveView("members")} className="bg-[#d946ef] rounded-3xl p-6 h-40 flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <span className="text-2xl font-bold text-white text-center leading-relaxed">সদস্যদের<br/>তালিকা</span>
        </button>
        
        <button onClick={() => setActiveView("expenses")} className="bg-[#7c3aed] rounded-3xl p-6 h-40 flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <span className="text-2xl font-bold text-white text-center">খরচ সমূহ</span>
        </button>
        
        <button onClick={() => setActiveView("rules")} className="bg-[#b91c1c] rounded-3xl p-6 h-40 flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <span className="text-2xl font-bold text-white text-center leading-relaxed">পরিষ্কারের<br/>নিয়ম</span>
        </button>
        
        <button onClick={() => setActiveView("schedule")} className="bg-[#5eead4] rounded-3xl p-6 h-40 flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <span className="text-2xl font-bold text-slate-800 text-center leading-relaxed">পরিষ্কারের<br/>সিডিউল</span>
        </button>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="animate-fade-in">
      <button onClick={() => setActiveView("home")} className="mb-6 text-emerald-400 flex items-center gap-2">
        <span className="text-xl">&larr;</span> ড্যাশবোর্ডে ফিরুন
      </button>
      <h2 className="text-xl font-medium text-slate-300 mb-4 px-2">সদস্যদের তালিকা</h2>
      <div className="space-y-3">
        {MEMBERS.map((m, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <img src={m.img} alt={m.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-600" onError={(e)=> { e.target.src = `https://ui-avatars.com/api/?name=${m.name}&background=334155&color=10b981` }}/>
            <div className="flex-1">
              <p className="text-xl font-bold text-white">{m.name}</p>
              <p className="text-sm text-slate-400">রুমমেট</p>
            </div>
            <div className="pr-2 text-right">
               <p className="text-sm text-slate-400">মোট বিল</p>
               <p className="text-lg font-bold text-emerald-400">৳ {toBanglaDigit(perPerson.toFixed(0))}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="animate-fade-in">
      <button onClick={() => setActiveView("home")} className="mb-6 text-emerald-400 flex items-center gap-2">
        <span className="text-xl">&larr;</span> ড্যাশবোর্ডে ফিরুন
      </button>
      <h2 className="text-xl font-medium text-slate-300 mb-4 px-2">মাসের খরচের বিবরণ</h2>
      
      <div className="bg-slate-800 p-5 rounded-3xl space-y-4 mb-6">
        <div className="flex justify-between border-b border-slate-700 pb-3">
          <span className="text-slate-300 text-lg">বাসা ভাড়া</span>
          <span className="text-white font-bold text-lg">৳ {toBanglaDigit(RENT)}</span>
        </div>
        <div className="flex justify-between border-b border-slate-700 pb-3">
          <span className="text-slate-300 text-lg">বিদ্যুৎ বিল</span>
          <span className="text-white font-bold text-lg">৳ {toBanglaDigit(electric)}</span>
        </div>
        <div className="flex justify-between border-b border-slate-700 pb-3">
          <span className="text-slate-300 text-lg">গ্যাস বিল</span>
          <span className="text-white font-bold text-lg">৳ {toBanglaDigit(gas)}</span>
        </div>
        <div className="flex justify-between pb-1">
          <span className="text-slate-300 text-lg">অন্যান্য খরচ</span>
          <span className="text-white font-bold text-lg">৳ {toBanglaDigit(extra)}</span>
        </div>
      </div>

      {editMode && (
        <div className="bg-slate-900 p-5 rounded-3xl border border-blue-500/30 space-y-4">
          <h3 className="text-blue-400 font-medium text-center">নতুন খরচ যোগ করুন</h3>
          <div className="flex items-center gap-3">
            <label className="w-24 text-slate-400">বিদ্যুৎ বিল</label>
            <input type="number" value={electric || ""} onChange={e=>setElectric(Number(e.target.value))} className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-center focus:outline-none"/>
          </div>
          <div className="flex items-center gap-3">
            <label className="w-24 text-slate-400">গ্যাস বিল</label>
            <input type="number" value={gas || ""} onChange={e=>setGas(Number(e.target.value))} className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-center focus:outline-none"/>
          </div>
          <div className="flex items-center gap-3">
            <label className="w-24 text-slate-400">অন্যান্য</label>
            <input type="number" value={extra || ""} onChange={e=>setExtra(Number(e.target.value))} className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-center focus:outline-none"/>
          </div>
          <button onClick={saveData} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4">
            আপডেট সেভ করুন
          </button>
        </div>
      )}
    </div>
  );

  const renderSchedule = () => (
    <div className="animate-fade-in">
      <button onClick={() => setActiveView("home")} className="mb-6 text-emerald-400 flex items-center gap-2">
        <span className="text-xl">&larr;</span> ড্যাশবোর্ডে ফিরুন
      </button>
      <div className="bg-[#5eead4] p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center">পরিষ্কারের সিডিউল</h2>
        <div className="space-y-4">
          {getSchedule().map((s, i) => (
            <div key={i} className="flex justify-between items-center bg-white/40 p-4 rounded-2xl shadow-sm">
              <span className="text-slate-900 font-bold text-lg">{s.name}</span>
              <span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium">{toBanglaDigit(s.date)} তারিখ</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="animate-fade-in">
      <button onClick={() => setActiveView("home")} className="mb-6 text-emerald-400 flex items-center gap-2">
        <span className="text-xl">&larr;</span> ড্যাশবোর্ডে ফিরুন
      </button>
      <div className="bg-[#b91c1c] p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">পরিষ্কারের নিয়মাবলি</h2>
        <div className="space-y-4">
          {rules.map((r, i) => (
            <div key={i} className="flex gap-4 items-start bg-black/20 p-4 rounded-2xl">
              <div className="bg-white text-red-700 rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</div>
              <p className="text-white text-sm leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans pb-10">
      <div className="pt-10 pb-6">
        <h1 className="text-2xl font-bold text-center text-teal-400 tracking-wide">
          ৬১২ বাসা ম্যানেজমেন্ট
        </h1>
        <p className="text-center text-slate-400 text-sm mt-1">হিসাব-নিকাশ ও ড্যাশবোর্ড</p>
      </div>

      <div className="px-5 max-w-md mx-auto">
        {activeView === "home" && renderHome()}
        {activeView === "members" && renderMembers()}
        {activeView === "expenses" && renderExpenses()}
        {activeView === "schedule" && renderSchedule()}
        {activeView === "rules" && renderRules()}
      </div>
    </div>
  );
}
