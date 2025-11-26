import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-white text-center text-gray-600 border-t">
      © {new Date().getFullYear()} RentEase — All Rights Reserved.
    </footer>
  );
}
