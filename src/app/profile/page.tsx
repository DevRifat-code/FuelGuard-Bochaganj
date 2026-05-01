"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, QrCode, Shield, Fuel, Download } from "lucide-react";

interface Vehicle {
  id: number;
  regNo: string;
  ownerName: string;
  phone: string;
  vehicleType: string;
  licenseNo: string;
  nid: string;
  taxToken?: string;
  qrCodeData?: string;
}

interface Eligibility {
  eligible: boolean;
  daysRemaining: number;
  message: string;
  threshold: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setVehicle(data.vehicle);
        setEligibility(data.eligibility);
        setQrCodeUrl(data.qrCode);
      } catch (e) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const downloadCard = () => {
    window.print();
  };

  if (loading) {
    return <div className="max-w-xl mx-auto py-20 text-center text-slate-600">Loading your profile...</div>;
  }

  if (!vehicle) {
    return <div className="max-w-xl mx-auto py-20 text-center text-red-600">Vehicle data not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8 no-print">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Owner Profile</h1>
          <p className="text-slate-600">Download your digital fuel card &amp; monitoring status</p>
        </div>
        <button onClick={downloadCard} className="btn btn-primary gap-2 no-print">
          <Download className="w-4 h-4" /> Print / Download Card
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Digital Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="card border-2 border-emerald-600 p-6 bg-gradient-to-r from-emerald-50 to-white relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-600/10 rounded-full flex items-center justify-center pointer-events-none">
              <Fuel className="w-24 h-24 text-emerald-600/20" />
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] font-bold tracking-[2px] text-emerald-800 uppercase">FuelGuard Digital Card</div>
                <div className="font-mono text-3xl font-black mt-1 text-emerald-950">{vehicle.regNo}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold px-2.5 py-1 bg-emerald-700 text-white rounded">
                  {vehicle.vehicleType === "motorcycle" ? "MOTORCYCLE" : "MOTOR VEHICLE"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-8 border-t pt-4 border-emerald-100">
              <div>
                <div className="text-slate-500 text-xs">Owner Name</div>
                <div className="font-semibold text-slate-800">{vehicle.ownerName}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs">Mobile Number</div>
                <div className="font-semibold text-slate-800">{vehicle.phone}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs">License Number</div>
                <div className="font-semibold text-slate-800">{vehicle.licenseNo}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs">NID Number</div>
                <div className="font-semibold text-slate-800">{vehicle.nid}</div>
              </div>
            </div>

            <div className="mt-6 text-[10px] text-slate-400 text-center border-t border-dashed pt-3">
              UNO Setabganj • Bochaganj Upazila Nirbahi Office
            </div>
          </div>

          {/* Eligibility Status */}
          {eligibility && (
            <div className={`card p-6 border-l-8 ${eligibility.eligible ? "border-emerald-600 bg-emerald-50/50" : "border-red-600 bg-red-50/50"}`}>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Shield className={eligibility.eligible ? "text-emerald-700" : "text-red-700"} />
                বর্তমান অবস্থা (Current Status)
              </h3>
              <p className="text-slate-800 text-sm">{eligibility.message}</p>
              {!eligibility.eligible && eligibility.daysRemaining > 0 && (
                <div className="mt-3 text-xs font-semibold text-red-800">
                  বাকি আছে: {eligibility.daysRemaining} দিন
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: QR Code */}
        <div className="card p-6 flex flex-col items-center justify-center">
          <h3 className="font-semibold text-sm text-slate-600 mb-4 text-center">Scan QR at the Pump</h3>
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 border-4 border-slate-100 p-1 rounded-xl" />
          ) : (
            <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center p-4">
              Generating QR Code...
            </div>
          )}
          <p className="text-[10px] text-slate-500 mt-4 text-center">আপনার ডিজিটাল কার্ডে দ্রুত অ্যাক্সেস পেতে এটি ব্যবহার করুন।</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
