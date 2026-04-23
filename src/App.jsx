import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const MEMBERS = [
  { name: "জাকির", img: "/জাকির.jpeg" },
  { name: "ফখরুল", img: "/ফখরুল.jpeg" },
  { name: "রকিব", img: "/রকিব.jpeg" },
  { name: "মহসিন", img: "/মহসিন.jpeg" },
  { name: "জিসান", img: "/জিসান.jpeg" },
  { name: "নোকিব", img: "/নোকিব.jpeg" },
];

const RENT = 1850;

const LOGIN_PIN = "7307";
const EDIT_PIN = "8019";

export default function App() {

  const [locked, setLocked] = useState(true);
  const [pin, setPin] = useState("");

  const [month, setMonth] = useState("2026-04");

  const [electricBill, setElectricBill] = useState("");
  const [gasBill, setGasBill] = useState("");
  const [others, setOthers] = useState("");

  const [editMode, setEditMode] = useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {
    const loadData = async () => {
      const ref = doc(db, "months", month);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setElectricBill(data.electric || "");
        setGasBill(data.gas || "");
        setOthers(data.others || "");
      }
    };

    if (!locked) loadData();
  }, [locked, month]);

  // ================= SAVE DATA =================
  const saveData = async () => {
    const ref = doc(db, "months", month);

    await setDoc(ref, {
      electric: Number(electricBill),
      gas: Number(gasBill),
      others: Number(others),
    });

    alert("Saved ✅");
  };

  // ================= PIN LOGIN =================
  const handleLogin = () => {
    if (pin === LOGIN_PIN) {
      setLocked(false);
    } else if (pin === EDIT_PIN) {
      setLocked(false);
      setEditMode(true);
    } else {
      alert("ভুল পিন ❌");
    }
  };

  if (locked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="bg-gray-900 p-6 rounded-2xl text-center">
          <h2 className="text-xl mb-4">🔐 PIN দিন</h2>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="p-3 rounded-xl text-black w-full mb-4"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 px-6 py-2 rounded-xl"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ================= CALCULATION =================
  const perRent = RENT / MEMBERS.length;
  const perElectric = electricBill ? electricBill / MEMBERS.length : 0;
  const perGas = gasBill ? gasBill / MEMBERS.length : 0;
  const perOthers = others ? others / MEMBERS.length : 0;

  const total = perRent + perElectric + perGas + perOthers;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">

      <h1 className="text-3xl font-bold text-center mb-4">
        🏠 বাসা হিসাব ({month})
      </h1>

      {/* MONTH SELECT */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="text-black p-2 rounded-xl mb-4"
      />

      {/* INPUT */}
      {editMode && (
        <div className="bg-white text-black p-4 rounded-2xl space-y-3 mb-4">
          <input
            type="number"
            placeholder="বিদ্যুৎ বিল"
            value={electricBill}
            onChange={(e) => setElectricBill(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            placeholder="গ্যাস বিল"
            value={gasBill}
            onChange={(e) => setGasBill(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            placeholder="অন্যান্য খরচ"
            value={others}
            onChange={(e) => setOthers(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={saveData}
            className="bg-green-600 w-full py-2 rounded-xl text-white"
          >
            Save
          </button>
        </div>
      )}

      {/* MEMBERS */}
      <div className="space-y-3">
        {MEMBERS.map((m, i) => (
          <div key={i} className="bg-white text-black p-3 rounded-xl flex gap-3 items-center">

            <img
              src={m.img}
              alt={m.name}
              className="w-12 h-12 rounded-xl object-cover"
              onError={(e) => e.target.src = "https://via.placeholder.com/50"}
            />

            <div>
              <p className="font-bold">{m.name}</p>
              <p>ভাড়া: ৳{perRent.toFixed(2)}</p>
              <p>বিদ্যুৎ: ৳{perElectric.toFixed(2)}</p>
              <p>গ্যাস: ৳{perGas.toFixed(2)}</p>
              <p>অন্যান্য: ৳{perOthers.toFixed(2)}</p>
              <p className="font-bold text-green-600">
                মোট: ৳{total.toFixed(2)}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}