import React from "react";

export default function ProphecyTracker() {
  return (
    <div className="rounded-2xl shadow-lg bg-card text-card-foreground p-6">
      <h2 className="text-xl font-semibold mb-4">🔮 Prophecy Tracker</h2>
      <p className="text-muted-foreground">
        AI will scan world events, match them to biblical prophecy, and display results here.
      </p>
      <div className="mt-4 space-y-2">
        <div className="p-3 rounded-lg bg-muted">
          🌍 Example Event: Earthquake in diverse places (Matthew 24:7)
        </div>
        <div className="p-3 rounded-lg bg-muted">
          ☄️ Example Event: Signs in the heavens (Luke 21:11)
        </div>
      </div>
    </div>
  );
}
