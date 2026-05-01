const bcrypt = require('bcryptjs')
const { initializeApp, getApps, cert } = require('firebase-admin/app')
const firestore = require('firebase-admin/firestore')

const serviceAccount = {
  projectId: "fuelguard-bochaganj",
  clientEmail: "firebase-adminsdk-fbsvc@fuelguard-bochaganj.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDLGhuysgUTaRSe\nqVNxQbLcUH9uvZKB5nKFG519p3680+pGG5Xhbdrt47FRXK2yZYh5uA39mMxRQ36G\nm0ouvHnExcOnSQS5T/vGIE0dFzP6Dg/3/4LOmlplpA6hvVkMYvaiS0ow5SzYpObP\nMWz3fu7TkPW/W2Py2BdJP1fHyzjtblF8MORypRti7R/wc6/wXmNdllxdISFWx/qF\nQItQrXYRZfWyYJOfk9gLm+SK42qKPsPaxoQ9upYIWirFMuBsmgpbSrXSG9HDlvnT\nvBRuYldJDeqUsWPE4MIZEL2Ap4N3M1/F76bEXwq/KnxY9kyMG1PyR7nYBer/zqsn\nVNtxrsUXAgMBAAECggEAGQa9Df5goL0shMZxmT2SuBIVOcSTRn1qdBtsgxy+Aa+N\nKRliFRaPyQtrAI8OejKHqBP1aV/IIWVTNGvzLqIb0RLbYoQdWGZSLF4zkleXGINe\nFV1/NU0QwYB/Kw/lZqDVKjdjy3WZ2pIrPLGm7zJNZHVyyqMMxFI7QFPVUbGpcJwU\nrUZhF8VRnr5Rmd8sFTRFBuTEwsSoRSriqx/67HQL4Al/FjGZeHqs/DcL2UomEL0z\ndcN/7R475ukAxTHPfr182SKGfmeA4UFvwDQub4oI5JNf6KndVh1KiD6m60wXqmqJ\nHZ5LUHOi7w+Ah4orFyWSEFZJkvOQT+AJsznNpXBEDQKBgQDlPM8L4w96jBjh4Apf\nAbYw5kyAkd+8tboN9Zelnb6iYfJ0QsFJRMvSBP2ZjmN0tmI1twva3pZjWZb0UYZu\nZh82I6nXXlrbvaIy9J+tjcq1cBx/1uzItfed5SluwwVMu4OMbBDUMvv+SfdhFSRC\n2XcT6BTcxqrYBHGwbTUbZkkqawKBgQDi0DCWSRm6pESokqVDiuYyVYB9c36K8fMw\nixMDpHpxWMT0+sBRR1wlkla13vBcMW8WAqqdbruuApkwAqRK01zeb9qTg35JAf/X\nGQ/sVK6BquerYMfjAQF/tL7mUeHWqd1Uw8kkLIQ2G0AmBqnOL3Vfsi+iBHcKsa3s\n0WBgWRETBQKBgQCQwgKZJgx7PYbk9B54elM7s+JxeiyINVXFROY7Xk6oqiN6CUGX\nbAstl5sxYboqVJXWB75DuzXKjSOHKwgyJOjmvkSdTOchRjHr7Y/7/8MXKjHFBMrH\nwCkam0C7wglRuEPM490Isx1wKfM+aiRY1oyclHzAIfB2su+8Empr3/6p+wKBgQCm\nwPen1lDDRvhvk3lLojhCM1iHYz1a/C2Wt/kfyXJ4GRKdJin01+koemGjzyeaMIIC\nha1Yl8wGUES95oNRu/ngVA44PAnBtWWaiAOL9mpiTPuMpVfwTpICiSl8/iBzCWn/\nYv5jyRLfEMPl8Sowu/WoiMG6dVvsEdvUa89WpsUF3QKBgQCldEXr+iW2UtRhozVo\naOAi2SsV7tb0ACJPCEQVda3odws1C02sewffMouFXTe7EYwYSD/dRMKzt8QXhk7O\nDQzP4g8KfpVIwGyiO8iqZV17R/4PcyHIc4MwANjSQu/BjeEXk7KFAuI6MQ9zF3gx\n4cDGZKDwW9pHYz1u9VMarUakCw==\n-----END PRIVATE KEY-----\n"
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount)
  })
}

const db = firestore.getFirestore()
const { addDoc, collection, Timestamp } = firestore

async function seedDemoData() {
  try {
    console.log('Starting demo data seeding...\n')

    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', 10)
    const managerHash = await bcrypt.hash('manager123', 10)
    const ownerHash = await bcrypt.hash('owner123', 10)

    // 1. Admin User
    const adminRef = await addDoc(collection(db, 'users'), {
      username: 'uno_admin@gmail.com',
      passwordHash: adminHash,
      role: 'admin',
      fullName: 'UNO Admin',
      phone: '01700000000',
      stationId: null,
      createdAt: Timestamp.now()
    })
    console.log('✓ Created admin user:', adminRef.id)

    // 2. Manager User
    const managerRef = await addDoc(collection(db, 'users'), {
      username: 'manager_bakultala',
      passwordHash: managerHash,
      role: 'manager',
      fullName: 'Manager Bakultala',
      phone: '01711111111',
      stationId: 'bakultala-station',
      createdAt: Timestamp.now()
    })
    console.log('✓ Created manager user:', managerRef.id)

    // 3. Owner User
    const ownerRef = await addDoc(collection(db, 'users'), {
      username: 'owner_karim',
      passwordHash: ownerHash,
      role: 'owner',
      fullName: 'Karim Uddin',
      phone: '01722222222',
      stationId: null,
      createdAt: Timestamp.now()
    })
    console.log('✓ Created owner user:', ownerRef.id)

    // 4. Create Station
    const stationRef = await addDoc(collection(db, 'stations'), {
      name: 'Bakultala Fuel Station',
      createdAt: Timestamp.now()
    })
    console.log('✓ Created station:', stationRef.id)

    // 5. Create Vehicle for Owner
    const vehicleRef = await addDoc(collection(db, 'vehicles'), {
      ownerUserId: ownerRef.id,
      regNo: 'DHA-123456',
      ownerName: 'Karim Uddin',
      phone: '01722222222',
      nid: '1234567890123',
      licenseNo: 'DL-789012',
      vehicleType: 'motorcycle',
      taxToken: 'TXN-12345',
      passportPhoto: null,
      nidPhoto: null,
      licensePhoto: null,
      taxTokenPhoto: null,
      qrCodeData: JSON.stringify({ regNo: 'DHA-123456', vehicleType: 'motorcycle' }),
      createdAt: Timestamp.now()
    })
    console.log('✓ Created vehicle:', vehicleRef.id)

    console.log('\n✅ Demo data seeded successfully!')
    console.log('\nDemo Credentials:')
    console.log('1. uno_admin@gmail.com / admin123 — UNO Admin')
    console.log('2. manager_bakultala / manager123 — Manager')
    console.log('3. owner_karim / owner123 — Vehicle Owner')
    console.log('   Vehicle: DHA-123456 (Motorcycle)')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seedDemoData()
