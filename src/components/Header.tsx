"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, User, Shield, Fuel } from "lucide-react";

interface UserInfo {
  id: number;
  username: string;
  role: string;
  stationName?: string;
}

export function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        // not logged in
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center">
            <Fuel className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl tracking-tight text-emerald-900">FuelGuard</div>
            <div className="text-[10px] text-emerald-600 -mt-1">UNO Setabganj</div>
          </div>
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-emerald-700 transition">Home</Link>
          <Link href="/register" className="hover:text-emerald-700 transition">Register Vehicle</Link>
          
          {!loading && !user && (
            <Link href="/login" className="btn btn-primary text-sm px-5 py-2">Login</Link>
          )}

          {!loading && user && (
            <div className="flex items-center gap-4">
              <Link 
                href={user.role === "admin" ? "/admin" : user.role === "manager" ? "/manager" : "/profile"} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
              >
                <Shield className="w-4 h-4" />
                {user.role === "admin" ? "Admin Dashboard" : user.role === "manager" ? "Manager Dashboard" : "My Profile"}
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                {user.username} {user.stationName && `(${user.stationName})`}
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
