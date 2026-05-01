"use client";

import React, { useEffect, useState } from "react";
import { Download, IdCard, Fuel, ShieldCheck, FileText } from "lucide-react";

interface Vehicle {
  id: number;
  regNo: string;
  ownerName: string;
  phone: string;
  nid: string;
  licenseNo: string;
  vehicleType: string;
  taxToken?: string;
  qrCodeUrl: string;
  createdAt: string;
}

export default function OwnerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Profile load failed");
        setUser(data.user);
        setVehicles(data.vehicles || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const downloadCard = async (vehicle: Vehicle) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1050;
    canvas.height = 660;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#ecfdf5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#064e3b";
    ctx.fillRect(0, 0, canvas.width, 130);
    ctx.fillStyle = "#047857";
    ctx.fillRect(0, 130, canvas.width, 16);

    // Header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px Arial";
    ctx.fillText("FuelGuard Vehicle Card", 48, 58);
    ctx.font = "24px Arial";
    ctx.fillText("Bochaganj UNO Office • Setabganj", 48, 96);

    // Card fields
    ctx.fillStyle = "#111827";
    ctx.font = "bold 58px Arial";
    ctx.fillText(vehicle.regNo, 48, 240);

    ctx.font = "bold 28px Arial";
    ctx.fillText("Owner", 48, 310);
    ctx.font = "28px Arial";
    ctx.fillText(vehicle.ownerName, 220, 310);

    ctx.font = "bold 28px Arial";
    ctx.fillText("Type", 48, 365);
    ctx.font = "28px Arial";
    ctx.fillText(vehicle.vehicleType === "motorcycle" ? "Motorcycle" : "Motor Vehicle", 220, 365);

    ctx.font = "bold 28px Arial";
    ctx.fillText("Phone", 48, 420);
    ctx.font = "28px Arial";
    ctx.fillText(vehicle.phone, 220, 420);

    ctx.font = "bold 28px Arial";
    ctx.fillText("License", 48, 475);
    ctx.font = "28px Arial";
    ctx.fillText(vehicle.licenseNo, 220, 475);

    ctx.font = "bold 28px Arial";
    ctx.fillText("Threshold", 48, 530);
    ctx.font = "28px Arial";
    ctx.fillStyle = "#dc2626";
    ctx.fillText(vehicle.vehicleType === "motorcycle" ? "500 BDT / 7-day rule" : "2000 BDT / 7-day rule", 220, 530);

    // QR
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(720, 210, 270, 270);
      ctx.drawImage(qrImg, 735, 225, 240, 240);
      ctx.fillStyle = "#064e3b";
      ctx.font = "bold 22px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Scan at Fuel Station", 855, 505);
      ctx.textAlign = "left";

      ctx.fillStyle = "#334155";
      ctx.font = "18px Arial";
      ctx.fillText(`Issued: ${new Date(vehicle.createdAt).toLocaleDateString()}`, 48, 610);
      ctx.fillText("If found, return to UNO Bochaganj Office", 600, 610);

      const link = document.createElement("a");
      link.download = `FuelGuard-Card-${vehicle.regNo}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    qrImg.src = vehicle.qrCodeUrl;
  };

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-16">Loading profile...</div>;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="card p-10 text-center">
          <div className="text-red-600 font-semibold text-xl">{error}</div>
          <p className="text-slate-600 mt-2">Please login as a vehicle owner to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="uppercase text-xs tracking-[3px] text-emerald-700 font-bold mb-2">Owner Profile</div>
          <h1 className="text-4xl font-semibold">Welcome, {user?.fullName || user?.username}</h1>
          <p className="text-slate-600 mt-1">আপনার Vehicle Card এখানে থেকে ডাউনলোড করতে পারবেন।</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-5 py-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Verified Owner Account
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="card p-10 text-center text-slate-600">No registered vehicle linked with this account.</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="card overflow-hidden">
              <div className="bg-emerald-900 text-white p-6 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-emerald-200">Vehicle Registration Card</div>
                  <div className="text-4xl font-bold font-mono mt-1">{vehicle.regNo}</div>
                </div>
                <IdCard className="w-12 h-12 text-emerald-200" />
              </div>

              <div className="p-7">
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <div className="text-slate-500">Owner</div>
                    <div className="font-semibold">{vehicle.ownerName}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Vehicle Type</div>
                    <div className="font-semibold">{vehicle.vehicleType === "motorcycle" ? "Motorcycle" : "Motor Vehicle"}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Phone</div>
                    <div className="font-semibold">{vehicle.phone}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">License</div>
                    <div className="font-semibold">{vehicle.licenseNo}</div>
                  </div>
                </div>

                <div className="flex gap-6 items-center bg-slate-50 rounded-2xl p-5 mb-6">
                  <img src={vehicle.qrCodeUrl} alt="Vehicle QR" className="w-32 h-32 rounded-xl border bg-white" />
                  <div>
                    <div className="font-semibold flex items-center gap-2"><Fuel className="w-4 h-4 text-emerald-700" /> QR Fuel Access</div>
                    <p className="text-sm text-slate-600 mt-1">Pump manager এই QR scan করে eligibility check করবে।</p>
                    <div className="text-xs mt-3 text-red-600 font-medium">
                      Limit: {vehicle.vehicleType === "motorcycle" ? "500 BDT" : "2000 BDT"} হলে ৭ দিনের block
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => downloadCard(vehicle)} className="btn btn-primary flex-1">
                    <Download className="w-4 h-4" /> Download Card
                  </button>
                  <button onClick={() => window.print()} className="btn btn-secondary">
                    <FileText className="w-4 h-4" /> Print
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
