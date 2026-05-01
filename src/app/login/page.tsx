"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleHint, setRoleHint] = useState<"admin" | "manager" | "">("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "manager") {
        router.push("/manager");
      } else {
        router.push("/profile");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="card p-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center mb-4">
            <LogIn className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-semibold">Secure Login</h1>
          <p className="text-slate-600 mt-1">UNO Admin or Pump Station Manager</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-medium block mb-1.5">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="uno_admin or manager_..."
              className="input" 
              required 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1.5">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="input" 
              required 
            />
          </div>

          {error && <div className="alert-red border px-4 py-3 text-sm rounded-xl">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn btn-primary py-3.5 mt-2 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t text-xs text-center text-slate-500 space-y-1">
          <div>Demo Credentials:</div>
          <div><span className="font-mono">uno_admin</span> / <span className="font-mono">admin123</span> — UNO Admin</div>
          <div><span className="font-mono">manager_bakultala...</span> / <span className="font-mono">manager123</span> — Any Manager</div>
        </div>
      </div>
    </div>
  );
}
