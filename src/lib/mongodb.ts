import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fuelguard'

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'owner'], required: true },
  fullName: String,
  phone: String,
  stationId: String,
}, { timestamps: true })

const vehicleSchema = new mongoose.Schema({
  ownerUserId: { type: String, required: true },
  regNo: { type: String, required: true, unique: true },
  ownerName: String,
  phone: String,
  nid: String,
  licenseNo: String,
  vehicleType: { type: String, enum: ['motorcycle', 'motor_vehicle'] },
  taxToken: String,
  qrCodeData: String,
}, { timestamps: true })

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true })

const fuelLogSchema = new mongoose.Schema({
  vehicleId: String,
  stationId: String,
  amountBdt: Number,
  fuelType: { type: String, enum: ['petrol', 'octane'] },
  managerId: String,
}, { timestamps: true })

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema)
export const Station = mongoose.models.Station || mongoose.model('Station', stationSchema)
export const FuelLog = mongoose.models.FuelLog || mongoose.model('FuelLog', fuelLogSchema)