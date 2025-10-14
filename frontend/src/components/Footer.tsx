import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 p-4 text-center mt-auto">
      © {new Date().getFullYear()} Prophecy Tracker AI. All rights reserved.
    </footer>
  );
}
