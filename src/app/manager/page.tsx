"use client";

import React, { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Search, QrCode, AlertTriangle, CheckCircle, Fuel, Clock } from "lucide-react";
import { format } from "date-fns";

interface VehicleData {
  id: number;
  regNo: string;
  ownerName: string;
  phone: string;
  vehicleType: string;
  licenseNo: string;
  nid?: string;
  qrCodeData?: string;
}

interface Eligibility {
  eligible: boolean;
  daysRemaining: number;
  message: string;
  threshold: number;
  vehicleType: string;
}

interface LogData {
  id: number;
  amountBdt: number;
  fuelType: string;
  timestamp: string;
  station?: { name: string };
}

export default function ManagerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [recentLogs, setRecentLogs] = useState<LogData[]>([]);
  const [fuelAmount, setFuelAmount] = useState("");
  const [fuelType, setFuelType] = useState<"petrol" | "octane">("petrol");
  const [loading, setLoading] = useState(false);
  const [logging, setLogging] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  const lookupVehicle = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setAlertMessage("");
    setSuccessMessage("");
    setVehicleData(null);
    setEligibility(null);

    try {
      const isNumeric = !isNaN(parseInt(query));
      const url = `/api/vehicles/lookup?${isNumeric ? `id=${query}` : `regNo=${encodeURIComponent(query)}`}`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Vehicle not found");
      }

      setVehicleData(data.vehicle);
      setEligibility(data.eligibility);
      setRecentLogs(data.recentLogs || []);

      if (!data.eligibility.eligible) {
        setAlertMessage(data.eligibility.message);
      } else {
        setSuccessMessage("Vehicle is eligible for fuel dispensing.");
      }
    } catch (err: any) {
      setAlertMessage(err.message || "Vehicle not found in the system.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookupVehicle(searchTerm);
  };

  // QR Scanner using html5-qrcode
  const startScanner = async () => {
    setShowScanner(true);
    setAlertMessage("");
    setSuccessMessage("");

    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Handle QR result
          try {
            const parsed = JSON.parse(decodedText);
            if (parsed.regNo) {
              stopScanner();
              setSearchTerm(parsed.regNo);
              lookupVehicle(parsed.regNo);
            } else if (parsed.id) {
              stopScanner();
              lookupVehicle(parsed.id.toString());
            }
          } catch {
            // fallback treat as regNo
            stopScanner();
            setSearchTerm(decodedText);
            lookupVehicle(decodedText);
          }
        },
        () => {}
      );
    } catch (err) {
      setAlertMessage("Camera access failed. Please ensure camera permission is granted.");
      setShowScanner(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {}
      html5QrCodeRef.current = null;
    }
    setShowScanner(false);
  };

  const recordFuel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleData || !fuelAmount) return;

    setLogging(true);
    setAlertMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/fuel/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicleData.id,
          amountBdt: parseInt(fuelAmount),
          fuelType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.eligibility) {
          setEligibility(data.eligibility);
          setAlertMessage(data.error + " • " + data.eligibility.message);
        } else {
          throw new Error(data.error);
        }
      } else {
        setSuccessMessage(`Fuel of ${fuelAmount} BDT logged successfully!`);
        setFuelAmount("");
        
        // Refresh eligibility and logs
        const refresh = await fetch(`/api/vehicles/lookup?regNo=${vehicleData.regNo}`);
        const refreshData = await refresh.json();
        setEligibility(refreshData.eligibility);
        setRecentLogs(refreshData.recentLogs || []);
      }
    } catch (err: any) {
      setAlertMessage(err.message);
    } finally {
      setLogging(false);
    }
  };

  const resetSearch = () => {
    setVehicleData(null);
    setEligibility(null);
    setRecentLogs([]);
    setSearchTerm("");
    setFuelAmount("");
    setAlertMessage("");
    setSuccessMessage("");
    if (showScanner) stopScanner();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Pump Manager Interface</h1>
          <p className="text-slate-600 mt-1">Search or scan vehicle QR • Check eligibility • Dispense fuel</p>
        </div>
        <div className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" /> LIVE SYSTEM
        </div>
      </div>

      {/* Search Bar + Scan Button */}
      <div className="card p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter License Plate (SET-4521) or Vehicle ID"
              className="input pr-12 text-lg"
            />
            <Search className="absolute right-4 top-4 text-slate-400 w-5 h-5" />
          </div>
          <button type="submit" className="btn btn-primary px-8" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
          <button 
            type="button" 
            onClick={startScanner} 
            className="btn btn-secondary px-6 gap-2"
            disabled={showScanner}
          >
            <QrCode className="w-4 h-4" /> Scan QR
          </button>
        </form>
        <p className="text-xs text-center mt-3 text-slate-500">Supports scanning vehicle QR codes generated during registration</p>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="modal">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-xl flex items-center gap-2"><QrCode /> Scan Vehicle QR Code</h3>
              <button onClick={stopScanner} className="text-red-600">Close</button>
            </div>
            <div id="qr-reader" ref={scannerRef} className="w-full" />
            <p className="text-xs text-center mt-4 text-slate-500">Point camera at the vehicle&apos;s QR code sticker</p>
          </div>
        </div>
      )}

      {/* Results Section: Vehicle Info + Eligibility Alert */}
      {vehicleData && eligibility && (
        <div className="space-y-6">
          {/* Vehicle Card */}
          <div className="card p-7">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="uppercase text-xs tracking-widest text-emerald-600 font-semibold">Vehicle Details</div>
                <div className="font-mono text-3xl font-bold tracking-tight mt-1">{vehicleData.regNo}</div>
                <div className="text-xl text-slate-700 mt-1">{vehicleData.ownerName}</div>
              </div>
              <div className="text-right">
                <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${vehicleData.vehicleType === "motorcycle" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {vehicleData.vehicleType === "motorcycle" ? "Motorcycle" : "Motor Vehicle"}
                </div>
                <div className="text-xs text-slate-500 mt-2">License: {vehicleData.licenseNo}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm border-t pt-5">
              <div><span className="text-slate-500">Phone:</span> {vehicleData.phone}</div>
              <div><span className="text-slate-500">NID:</span> {vehicleData.nid || "N/A"}</div>
              <div><span className="text-slate-500">Threshold:</span> {eligibility.threshold} BDT</div>
            </div>
          </div>

          {/* ELIGIBILITY STATUS - Red Alert / Green Success */}
          <div className={`card p-8 border-l-[14px] ${eligibility.eligible ? "border-emerald-600 bg-emerald-50/40 alert-green" : "border-red-600 bg-red-50/50 alert-red"}`}>
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-2xl ${eligibility.eligible ? "bg-emerald-600" : "bg-red-600"}`}>
                {eligibility.eligible ? <CheckCircle className="w-9 h-9 text-white" /> : <AlertTriangle className="w-9 h-9 text-white" />}
              </div>
              <div className="flex-1">
                <div className="uppercase text-xs tracking-[1.5px] font-bold mb-1 opacity-70">
                  {eligibility.eligible ? "ELIGIBLE FOR FUEL" : "BLOCKED — ALERT"}
                </div>
                <div className="text-2xl font-semibold tracking-tight mb-1">{eligibility.eligible ? "Green Light — Approved" : "RED ALERT — Access Denied"}</div>
                <div className="text-lg text-slate-700">{eligibility.message}</div>

                {!eligibility.eligible && eligibility.daysRemaining > 0 && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-1 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" /> {eligibility.daysRemaining} days remaining in block
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fuel Logging Form - Only if eligible */}
          {eligibility.eligible && (
            <div className="card p-8">
              <h3 className="font-semibold text-xl mb-5 flex items-center gap-2"><Fuel className="text-emerald-600" /> Record Fuel Dispensing</h3>
              <form onSubmit={recordFuel} className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="text-xs uppercase font-medium tracking-wider text-slate-500">Amount (BDT)</label>
                  <input 
                    type="number" 
                    value={fuelAmount} 
                    onChange={e => setFuelAmount(e.target.value)} 
                    placeholder="500" 
                    min="50" 
                    className="input text-2xl font-mono" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-medium tracking-wider text-slate-500">Fuel Type</label>
                  <select value={fuelType} onChange={e => setFuelType(e.target.value as any)} className="input w-44">
                    <option value="petrol">Petrol</option>
                    <option value="octane">Octane</option>
                  </select>
                </div>
                <button type="submit" disabled={logging || !fuelAmount} className="btn btn-primary px-10 py-4">
                  {logging ? "Logging..." : "Confirm & Record Fuel"}
                </button>
              </form>
              <div className="text-[10px] mt-2 text-slate-500">Note: If amount ≥ {eligibility.threshold} BDT, 7-day block will be applied.</div>
            </div>
          )}

          {/* Recent Fuel Logs */}
          {recentLogs.length > 0 && (
            <div className="card p-8">
              <h4 className="font-semibold mb-4">Recent Fuel History</h4>
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Station</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{format(new Date(log.timestamp), "dd MMM yyyy, hh:mm a")}</td>
                      <td>{log.station?.name || "N/A"}</td>
                      <td className="font-mono">৳{log.amountBdt}</td>
                      <td>{log.fuelType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={resetSearch} className="btn btn-secondary text-sm">Search Another Vehicle</button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {alertMessage && !vehicleData && (
        <div className="alert-red border-l-4 px-6 py-4 text-lg">{alertMessage}</div>
      )}
      {successMessage && (
        <div className="alert-green border-l-4 px-6 py-4 text-lg mt-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5" /> {successMessage}
        </div>
      )}
    </div>
  );
}
