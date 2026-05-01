'use client'

import { useEffect, useState } from 'react'
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { app } from '@/lib/firebase'
import bcrypt from 'bcryptjs'

const db = getFirestore(app)

export default function SeedPage() {
  const [status, setStatus] = useState('Ready to seed...')
  const [loading, setLoading] = useState(false)

  async function seed() {
    setLoading(true)
    setStatus('Seeding demo data...')
    
    try {
      const adminHash = await bcrypt.hash('admin123', 10)
      const managerHash = await bcrypt.hash('manager123', 10)
      const ownerHash = await bcrypt.hash('owner123', 10)
      
      setStatus('Passwords hashed. Creating users...')
      
      // Check admin
      const adminQuery = query(collection(db, "users"), where("username", "==", "uno_admin@gmail.com"))
      const adminSnap = await getDocs(adminQuery)
      
      if (adminSnap.empty) {
        await addDoc(collection(db, "users"), {
          username: "uno_admin@gmail.com",
          passwordHash: adminHash,
          role: "admin",
          fullName: "UNO Admin",
          phone: "01700000000",
          stationId: null,
          createdAt: serverTimestamp()
        })
        setStatus('✓ Admin created')
      } else {
        setStatus('✓ Admin exists')
      }
      
      // Check manager
      const managerQuery = query(collection(db, "users"), where("username", "==", "manager_bakultala"))
      const managerSnap = await getDocs(managerQuery)
      
      if (managerSnap.empty) {
        await addDoc(collection(db, "users"), {
          username: "manager_bakultala",
          passwordHash: managerHash,
          role: "manager",
          fullName: "Manager Bakultala",
          phone: "01711111111",
          stationId: "bakultala-station",
          createdAt: serverTimestamp()
        })
        setStatus('✓ Manager created')
      } else {
        setStatus('✓ Manager exists')
      }
      
      // Check owner
      const ownerQuery = query(collection(db, "users"), where("username", "==", "owner_karim"))
      const ownerSnap = await getDocs(ownerQuery)
      
      let ownerId
      
      if (ownerSnap.empty) {
        const ownerRef = await addDoc(collection(db, "users"), {
          username: "owner_karim",
          passwordHash: ownerHash,
          role: "owner",
          fullName: "Karim Uddin",
          phone: "01722222222",
          stationId: null,
          createdAt: serverTimestamp()
        })
        ownerId = ownerRef.id
        setStatus('✓ Owner created')
      } else {
        ownerId = ownerSnap.docs[0].id
        setStatus('✓ Owner exists')
      }
      
      // Check station
      const stationQuery = query(collection(db, "stations"), where("name", "==", "Bakultala Fuel Station"))
      const stationSnap = await getDocs(stationQuery)
      
      if (stationSnap.empty) {
        await addDoc(collection(db, "stations"), {
          name: "Bakultala Fuel Station",
          createdAt: serverTimestamp()
        })
        setStatus('✓ Station created')
      } else {
        setStatus('✓ Station exists')
      }
      
      // Check vehicle
      const vehicleQuery = query(collection(db, "vehicles"), where("regNo", "==", "DHA-123456"))
      const vehicleSnap = await getDocs(vehicleQuery)
      
      if (vehicleSnap.empty) {
        await addDoc(collection(db, "vehicles"), {
          ownerUserId: ownerId,
          regNo: "DHA-123456",
          ownerName: "Karim Uddin",
          phone: "01722222222",
          nid: "1234567890123",
          licenseNo: "DL-789012",
          vehicleType: "motorcycle",
          taxToken: "TXN-12345",
          passportPhoto: null,
          nidPhoto: null,
          licensePhoto: null,
          taxTokenPhoto: null,
          qrCodeData: JSON.stringify({ regNo: "DHA-123456", vehicleType: "motorcycle" }),
          createdAt: serverTimestamp()
        })
        setStatus('✓ Vehicle created')
      } else {
        setStatus('✓ Vehicle exists')
      }
      
      setStatus('✅ Seed complete! All demo data is ready. You can now login.')
      setLoading(false)
      
    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Seed Demo Data</h1>
        <p className="mb-4 text-gray-600">{status}</p>
        <button
          onClick={seed}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Seeding...' : 'Seed Demo Data'}
        </button>
        <div className="mt-6 text-sm text-gray-500">
          <p>Demo Credentials after seeding:</p>
          <ul className="list-disc list-inside mt-2">
            <li>uno_admin@gmail.com / admin123</li>
            <li>manager_bakultala / manager123</li>
            <li>owner_karim / owner123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
