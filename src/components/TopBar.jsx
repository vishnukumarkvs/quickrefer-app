"use client";

export default function TopBar() {
  return (
    <div className="w-full flex items-center justify-between bg-[#3a032d] border text-white px-4 py-2">
      <div className="font-bold text-white pl-8">JT Company</div>
      <button className="px-3 py-1 rounded bg-[#ffc800] hover:bg-[#c9ac43] text-black">
        Profile
      </button>
    </div>
  );
}
