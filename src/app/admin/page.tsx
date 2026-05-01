"use client";

import React, { useState, useEffect } from "react";
import { Users, Fuel, TrendingUp, UserPlus, AlertTriangle } from "lucide-react";

interface Vehicle {
  id: number;
  regNo: string;
  ownerName: string;
  phone?: string;
  nid?: string;
  licenseNo?: string;
  taxToken?: string;
  vehicleType: string;
  passportPhoto?: string;
  nidPhoto?: string;
  licensePhoto?: string;
  taxTokenPhoto?: string;
  createdAt: string;
  owner?: { username: string; phone?: string } | null;
}

interface Manager {
  id: number;
  username: string;
  stationName?: string;
}

interface FuelLog {
  id: number;
  amountBdt: number;
  fuelType: string;
  timestamp: string;
  vehicleReg?: string;
  stationName?: string;
}

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [stats, setStats] = useState({ totalVehicles: 0, totalLogs: 0, totalFuel: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddManager, setShowAddManager] = useState(false);
  const [newManager, setNewManager] = useState({ username: "", password: "", stationId: "" });
  const [addError, setAddError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, mRes, lRes] = await Promise.all([
        fetch("/api/admin/vehicles"),
        fetch("/api/admin/managers"),
        fetch("/api/admin/logs"),
      ]);

      const vData = await vRes.json();
      const mData = await mRes.json();
      const lData = await lRes.json();

      setVehicles(vData.vehicles || []);
      setManagers(mData.managers || []);
      setLogs(lData.logs || []);

      // Calculate stats
      const totalFuel = (lData.logs || []).reduce((sum: number, log: FuelLog) => sum + log.amountBdt, 0);
      setStats({
        totalVehicles: vData.vehicles?.length || 0,
        totalLogs: lData.logs?.length || 0,
        totalFuel,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    
    try {
      const res = await fetch("/api/admin/add-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newManager.username,
          password: newManager.password,
          stationId: newManager.stationId ? parseInt(newManager.stationId) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setShowAddManager(false);
      setNewManager({ username: "", password: "", stationId: "" });
      fetchData();
    } catch (err: any) {
      setAddError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold">UNO Admin Dashboard</h1>
          <p className="text-slate-600">Bochaganj Upazila Nirbahi Office • Fuel Monitoring</p>
        </div>
        <button onClick={() => setShowAddManager(true)} className="btn btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Pump Manager
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="text-emerald-700"><Users className="w-5 h-5" /></div>
          <div className="text-4xl font-semibold mt-3">{stats.totalVehicles}</div>
          <div className="text-sm text-slate-600">Registered Vehicles</div>
        </div>
        <div className="card p-6">
          <div className="text-emerald-700"><Fuel className="w-5 h-5" /></div>
          <div className="text-4xl font-semibold mt-3">{stats.totalLogs}</div>
          <div className="text-sm text-slate-600">Total Fuel Transactions</div>
        </div>
        <div className="card p-6">
          <div className="text-emerald-700"><TrendingUp className="w-5 h-5" /></div>
          <div className="text-4xl font-semibold mt-3">৳{stats.totalFuel}</div>
          <div className="text-sm text-slate-600">Total Fuel Dispensed</div>
        </div>
        <div className="card p-6 bg-emerald-900 text-white">
          <div>5 Active Stations</div>
          <div className="mt-6 text-xs opacity-75">Bakultala • Tulei • Setabganj • Rampur • MI</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Vehicles List */}
        <div className="card p-7">
          <h3 className="font-semibold mb-4 flex items-center gap-2">All Registered Vehicles</h3>
          <div className="overflow-auto max-h-[420px]">
            <table className="table w-full text-sm">
              <thead><tr><th>Reg No</th><th>Owner</th><th>Type</th><th>Account</th><th>Files</th></tr></thead>
              <tbody>
                {vehicles.length ? vehicles.map(v => (
                  <tr key={v.id}>
                    <td className="font-mono font-medium">{v.regNo}</td>
                    <td>{v.ownerName}</td>
                    <td><span className="text-xs px-2 py-0.5 rounded bg-slate-100">{v.vehicleType}</span></td>
                    <td className="text-xs text-slate-500">{v.owner?.username || "N/A"}</td>
                    <td>
                      <button onClick={() => setSelectedVehicle(v)} className="text-emerald-700 hover:underline text-xs font-semibold">
                        View Files
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={5} className="text-center py-8 text-slate-500">No vehicles yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Managers */}
        <div className="card p-7">
          <h3 className="font-semibold mb-4 flex items-center gap-2">Pump Managers ({managers.length})</h3>
          <div className="space-y-2">
            {managers.length ? managers.map(m => (
              <div key={m.id} className="flex items-center justify-between border px-4 py-3 rounded-xl">
                <div>
                  <div className="font-medium">{m.username}</div>
                  <div className="text-xs text-slate-500">{m.stationName || "All Stations (Admin)"}</div>
                </div>
                <div className="text-xs px-3 py-1 rounded bg-emerald-100 text-emerald-700">Manager</div>
              </div>
            )) : <div className="text-slate-500 text-sm">No managers</div>}
          </div>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="card p-7 mt-8">
        <h3 className="font-semibold mb-4">Recent Fuel Transactions</h3>
        <table className="table">
          <thead><tr><th>Date</th><th>Vehicle</th><th>Station</th><th>Amount</th><th>Type</th></tr></thead>
          <tbody>
            {logs.length ? logs.slice(0, 8).map(log => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td className="font-mono text-sm">{log.vehicleReg}</td>
                <td>{log.stationName}</td>
                <td className="font-semibold">৳{log.amountBdt}</td>
                <td>{log.fuelType}</td>
              </tr>
            )) : <tr><td colSpan={5} className="text-center py-4 text-slate-500">No transactions recorded</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Registration Files Modal */}
      {selectedVehicle && (
        <div className="modal">
          <div className="card max-w-5xl w-full p-8 max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold">Registration Files</h3>
                <p className="text-slate-600">{selectedVehicle.regNo} • {selectedVehicle.ownerName}</p>
              </div>
              <button onClick={() => setSelectedVehicle(null)} className="btn btn-secondary text-sm px-4 py-2">Close</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm bg-slate-50 rounded-2xl p-5">
              <div><strong>Phone:</strong> {selectedVehicle.phone}</div>
              <div><strong>NID:</strong> {selectedVehicle.nid}</div>
              <div><strong>License:</strong> {selectedVehicle.licenseNo}</div>
              <div><strong>Tax Token:</strong> {selectedVehicle.taxToken || "N/A"}</div>
              <div><strong>Owner Account:</strong> {selectedVehicle.owner?.username || "N/A"}</div>
              <div><strong>Registered:</strong> {new Date(selectedVehicle.createdAt).toLocaleString()}</div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Passport Photo", src: selectedVehicle.passportPhoto },
                { label: "NID Card", src: selectedVehicle.nidPhoto },
                { label: "Driving License", src: selectedVehicle.licensePhoto },
                { label: "Tax Token / Reg Card", src: selectedVehicle.taxTokenPhoto },
              ].map((doc) => (
                <div key={doc.label} className="border rounded-2xl p-4 bg-white">
                  <div className="font-semibold text-sm mb-3">{doc.label}</div>
                  {doc.src ? (
                    <a href={doc.src} target="_blank" rel="noreferrer" className="block">
                      <img src={doc.src} alt={doc.label} className="w-full h-48 object-cover rounded-xl border" />
                      <span className="text-xs text-emerald-700 mt-2 block">Open full file</span>
                    </a>
                  ) : (
                    <div className="h-48 rounded-xl border bg-slate-100 flex items-center justify-center text-xs text-slate-500">No file uploaded</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Manager Modal */}
      {showAddManager && (
        <div className="modal">
          <div className="card max-w-md w-full p-8">
            <h3 className="text-2xl font-semibold mb-6">Add New Pump Manager</h3>
            <form onSubmit={addManager} className="space-y-5">
              <div>
                <label className="text-sm font-medium">Username</label>
                <input value={newManager.username} onChange={e => setNewManager({...newManager, username: e.target.value})} className="input mt-1" placeholder="manager_rampur" required />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input type="password" value={newManager.password} onChange={e => setNewManager({...newManager, password: e.target.value})} className="input mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium">Assign Station ID (optional)</label>
                <input value={newManager.stationId} onChange={e => setNewManager({...newManager, stationId: e.target.value})} type="number" className="input mt-1" placeholder="1-5" />
                <div className="text-xs mt-1 text-slate-500">1=Bakultala, 2=Tulei, 3=Setabganj, 4=Rampur, 5=MI</div>
              </div>
              {addError && <div className="text-sm text-red-600">{addError}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddManager(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Create Manager</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
