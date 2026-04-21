import React, { useState } from "react";

const MEMBERS = [
  { name: "জাকির", img: "/জাকির.jpeg" },
  { name: "ফখরুল", img: "/ফখরুল.jpeg" },
  { name: "রকিব", img: "/রকিব.jpeg" },
  { name: "মহসিন", img: "/মহসিন.jpeg" },
  { name: "জিসান", img: "/জিসান.jpeg" },
  { name: "নোকিব", img: "/নোকিব.jpeg" },
];

const RENT = 1850;

const getCleanerIndex = (date) => {
  const d = date.getDate();
  if (d <= 5) return 0;
  if (d <= 10) return 1;
  if (d <= 15) return 2;
  if (d <= 20) return 3;
  if (d <= 25) return 4;
  return 5;
};

export default function App() {
  const today = new Date();

  const [electricBill, setElectricBill] = useState("");
  const [gasBill, setGasBill] = useState("");

  const perPersonRent = RENT / MEMBERS.length;
  const perElectric = electricBill ? electricBill / MEMBERS.length : 0;
  const perGas = gasBill ? gasBill / MEMBERS.length : 0;

  const totalPerPerson = perPersonRent + perElectric + perGas;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">

      <h1 className="text-3xl font-bold text-center mb-6">
        🏠৬১২ নাম্বার বাসা ম্যানেজমেন্ট
      </h1>

      {/* Today Cleaner */}
      <div className="bg-blue-600 p-6 rounded-2xl text-center mb-6">
        <p>আজকের ক্লিনার</p>
        <h2 className="text-2xl font-bold">
          {MEMBERS[getCleanerIndex(today)].name}
        </h2>
      </div>

      {/* Bills Input */}
      <div className="bg-white text-black p-5 rounded-2xl mb-6 space-y-4">
        <input
          type="number"
          placeholder="বিদ্যুৎ বিল"
          value={electricBill}
          onChange={(e) => setElectricBill(Number(e.target.value))}
          className="w-full p-3 border rounded-xl"
        />

        <input
          type="number"
          placeholder="গ্যাস বিল"
          value={gasBill}
          onChange={(e) => setGasBill(Number(e.target.value))}
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* Members */}
      <div className="space-y-4">
        {MEMBERS.map((m, i) => (
          <div key={i} className="bg-white text-black p-4 rounded-2xl flex items-center gap-4">

            <img
              src={m.img}
              alt={m.name}
              className="w-14 h-14 rounded-xl object-cover"
              onError={(e) => e.target.src = "https://via.placeholder.com/50"}
            />

            <div className="flex-1">
              <p className="font-bold">{m.name}</p>
              <p>ভাড়া: ৳{perPersonRent.toFixed(2)}</p>
              <p>বিদ্যুৎ: ৳{perElectric.toFixed(2)}</p>
              <p>গ্যাস: ৳{perGas.toFixed(2)}</p>
              <p className="font-bold text-green-600">
                মোট: ৳{totalPerPerson.toFixed(2)}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}