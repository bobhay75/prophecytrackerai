"use client";

import React, { useState } from "react";

export default function ProphecyTracker() {
  const [prophecies, setProphecies] = useState<string[]>([
    "Revelation 13 – Rise of the Beast system",
    "Matthew 24 – Wars & rumors of wars",
  ]);

  const addProphecy = () => {
    const newWord = prompt("Enter new prophecy event:");
    if (newWord) setProphecies([...prophecies, newWord]);
  };

  return (
    <section className="p-4 shadow-md rounded-2xl">
      <div>
        <h2 className="text-xl font-bold mb-3">📜 Prophecy Tracker</h2>
        <ul className="list-disc ml-6 mb-4 space-y-1">
          {prophecies.map((p, i) => (
            <li key={i} className="text-sm">{p}</li>
          ))}
        </ul>
        <button type="button" className="rounded bg-blue-700 px-4 py-2 text-white" onClick={addProphecy}>➕ Add Prophecy</button>
      </div>
    </section>
  );
}
