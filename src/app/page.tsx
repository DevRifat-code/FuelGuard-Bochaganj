import Link from "next/link";
import { Fuel, ShieldCheck, AlertTriangle, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm mb-6">
            <ShieldCheck className="w-4 h-4" /> Official System • Bochaganj UNO
          </div>
          
          <h1 className="text-6xl font-bold tracking-tighter mb-4">
            FuelGuard<br />Setabganj
          </h1>
          <p className="text-2xl text-emerald-300 mb-8 max-w-xl mx-auto">
            Fuel Control &amp; Monitoring System
          </p>
          <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto mb-10">
            Regulating Petrol &amp; Octane consumption for motorcycles and motor vehicles across 5 fuel stations in Setabganj.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn btn-primary px-8 py-4 text-lg bg-white text-emerald-900 hover:bg-emerald-100">
              Register New Vehicle
            </Link>
            <Link href="/login" className="btn btn-secondary px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10">
              Pump Manager / Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Rules Section - Bengali Explanation */}
      <div className="bg-white text-slate-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-emerald-700 text-sm font-semibold tracking-[3px] mb-3">CORE RULES • মূল নিয়ম</div>
            <h2 className="text-4xl font-semibold tracking-tight">7-Day Fuel Restriction Rule</h2>
            <p className="mt-3 text-slate-600 max-w-md mx-auto">যানবাহনের জ্বালানি ব্যবহার নিয়ন্ত্রণের জন্য ৭ দিনের ব্লক নিয়ম</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Motorcycle Rule */}
            <div className="card p-8 border-l-4 border-emerald-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl"><Fuel className="w-6 h-6 text-emerald-700" /></div>
                <div>
                  <div className="font-semibold text-xl">মোটরসাইকেল (Motorcycle)</div>
                  <div className="text-sm text-emerald-600">Two-wheeler vehicles</div>
                </div>
              </div>
              <div className="pl-14 text-lg">
                যদি <span className="font-bold text-emerald-700">৫০০ টাকা বা তার বেশি</span> মূল্যের জ্বালানি নেয়া হয়, তাহলে পরবর্তী <span className="font-bold">৭ দিন</span> সব স্টেশনে জ্বালানি নেওয়া বন্ধ থাকবে।
              </div>
              <div className="pl-14 mt-4 text-xs text-slate-500">Threshold: ৫০০ BDT → ৭ দিন ব্লক</div>
            </div>

            {/* Motor Vehicle Rule */}
            <div className="card p-8 border-l-4 border-amber-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-100 rounded-xl"><Users className="w-6 h-6 text-amber-700" /></div>
                <div>
                  <div className="font-semibold text-xl">মোটর ভেহিকল (Motor Vehicle)</div>
                  <div className="text-sm text-amber-600">Cars, Jeeps, Three-wheelers</div>
                </div>
              </div>
              <div className="pl-14 text-lg">
                যদি <span className="font-bold text-amber-700">২০০০ টাকা বা তার বেশি</span> মূল্যের জ্বালানি নেয়া হয়, তাহলে পরবর্তী <span className="font-bold">৭ দিন</span> সব স্টেশনে জ্বালানি নেওয়া বন্ধ থাকবে।
              </div>
              <div className="pl-14 mt-4 text-xs text-slate-500">Threshold: ২০০০ BDT → ৭ দিন ব্লক</div>
            </div>
          </div>

          <div className="mt-10 max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div className="text-red-800">
              <div className="font-semibold">Alert for Pump Managers</div>
              <div className="text-sm mt-1">যদি কোনো যানবাহন ৭ দিনের মধ্যে জ্বালানি নিতে চায়, Pump Manager-কে <strong>Red Alert</strong> দেখানো হবে এবং লেনদেন বন্ধ থাকবে।</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stations */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="uppercase text-emerald-400 text-xs tracking-[4px] mb-4">5 AUTHORIZED STATIONS</div>
        <h3 className="text-3xl font-semibold mb-10 text-white">Setabganj Fuel Stations</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["Bakultala", "Tulei", "Setabganj Main", "Rampur", "MI Fuel Station"].map((name, idx) => (
            <div key={idx} className="bg-white/10 hover:bg-white/15 transition px-5 py-5 rounded-2xl text-sm font-medium border border-white/10">
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
