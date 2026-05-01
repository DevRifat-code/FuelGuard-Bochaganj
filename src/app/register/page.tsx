"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, QrCode } from "lucide-react";

interface FormData {
  regNo: string;
  ownerName: string;
  phone: string;
  nid: string;
  licenseNo: string;
  vehicleType: "motorcycle" | "motor_vehicle";
  taxToken: string;
  username: string;
  password: "";
}

export default function RegisterVehicle() {
  const router = useRouter();
  const [form, setForm] = useState<any>({
    regNo: "",
    ownerName: "",
    phone: "",
    nid: "",
    licenseNo: "",
    vehicleType: "motorcycle",
    taxToken: "",
    username: "",
    password: "",
  });
  const [photos, setPhotos] = useState<Record<string, string>>({
    passportPhoto: "",
    nidPhoto: "",
    licensePhoto: "",
    taxTokenPhoto: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState("");

  const handleImageUpload = (field: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPhotos(prev => ({ ...prev, [field]: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.regNo || !form.ownerName) {
      setError("Registration number and owner name are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/vehicles/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...photos,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(null);
    setForm({
      regNo: "", ownerName: "", phone: "", nid: "", licenseNo: "", vehicleType: "motorcycle", taxToken: "",
    });
    setPhotos({ passportPhoto: "", nidPhoto: "", licensePhoto: "", taxTokenPhoto: "" });
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="card p-10 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold mb-2">Registration Successful!</h2>
          <p className="text-slate-600 mb-8">Vehicle has been registered in the FuelGuard system.</p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8 text-left">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="font-medium">Reg No / License Plate:</div><div className="font-mono">{success.vehicle.regNo}</div>
              <div className="font-medium">Owner:</div><div>{success.vehicle.ownerName}</div>
              <div className="font-medium">Type:</div><div>{success.vehicle.vehicleType}</div>
              <div className="font-medium">Phone:</div><div>{success.vehicle.phone}</div>
            </div>
          </div>

          {success.qrCode && (
            <div className="qr-container mx-auto mb-8">
              <QrCode className="w-8 h-8 text-emerald-700 mb-3" />
              <h4 className="font-semibold mb-2">Vehicle QR Code</h4>
              <img src={success.qrCode} alt="Vehicle QR Code" className="mx-auto w-52 h-52 border border-slate-200 rounded" />
              <p className="text-xs mt-4 text-slate-500">Pump managers can scan this QR code for quick lookup</p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button onClick={resetForm} className="btn btn-secondary">Register Another Vehicle</button>
            <button onClick={() => router.push("/login")} className="btn btn-primary">Go to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Vehicle Registration</h1>
        <p className="text-slate-600 mt-2">Register your motorcycle or motor vehicle for fuel monitoring at Setabganj stations.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium mb-1.5">License Plate / Reg No *</label>
            <input type="text" value={form.regNo} onChange={e => setForm({...form, regNo: e.target.value.toUpperCase()})} placeholder="SET-4521" className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Vehicle Type *</label>
            <select value={form.vehicleType} onChange={e => setForm({...form, vehicleType: e.target.value as any})} className="input">
              <option value="motorcycle">Motorcycle (মোটরসাইকেল)</option>
              <option value="motor_vehicle">Motor Vehicle (মোটর ভেহিকল)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Owner Full Name *</label>
            <input type="text" value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phone Number *</label>
            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="017XX-XXXXXX" className="input" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">NID Number *</label>
            <input type="text" value={form.nid} onChange={e => setForm({...form, nid: e.target.value})} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Driving License No *</label>
            <input type="text" value={form.licenseNo} onChange={e => setForm({...form, licenseNo: e.target.value})} className="input" required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Tax Token / Registration Card Number</label>
            <input type="text" value={form.taxToken} onChange={e => setForm({...form, taxToken: e.target.value})} className="input" />
          </div>

          <div className="border-t pt-6 md:col-span-2">
            <h3 className="font-semibold text-lg mb-4 text-emerald-800">অ্যাকাউন্ট তৈরি করুন (Create Login Account)</h3>
            <p className="text-xs text-slate-500 mb-4">লগইন করে আপনার ডিজিটাল প্রোফাইল এবং কিউআর কোড দেখতে ও ডাউনলোড করতে পারবেন।</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Username (ব্যবহারকারীর নাম) *</label>
            <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase()})} placeholder="e.g. karim4521" className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password (পাসওয়ার্ড) *</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" className="input" required />
          </div>
        </div>

        {/* Image Uploads */}
        <div className="mt-8 border-t pt-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Upload className="w-5 h-5" /> Upload Required Documents (JPG/PNG)</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { key: "passportPhoto", label: "Passport Size Photo (পাসপোর্ট সাইজ ছবি)" },
              { key: "nidPhoto", label: "NID Card Photo (জাতীয় পরিচয়পত্র)" },
              { key: "licensePhoto", label: "Driving License Photo (ড্রাইভিং লাইসেন্স)" },
              { key: "taxTokenPhoto", label: "Tax Token / Reg Card (ট্যাক্স টোকেন)" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl h-36 flex items-center justify-center bg-slate-50 overflow-hidden">
                  {photos[key] ? (
                    <img src={photos[key]} alt={label} className="image-preview" />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto w-8 h-8 text-slate-400 mb-2" />
                      <div className="text-xs text-slate-500">Click to upload</div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(key, file);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="mt-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          className="mt-8 w-full btn btn-primary py-4 text-lg disabled:opacity-60"
        >
          {loading ? "Registering Vehicle..." : "Submit Registration Application"}
        </button>

        <p className="text-xs text-center text-slate-500 mt-4">Your data is securely stored. QR code will be generated upon successful registration.</p>
      </form>
    </div>
  );
}
