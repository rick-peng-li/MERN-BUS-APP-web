import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    busType: { type: String, required: true, trim: true },
    busNumber: { type: String, required: true, trim: true },
    startCity: { type: String, required: true, trim: true, index: true },
    destination: { type: String, required: true, trim: true, index: true },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true, min: 0 },
    pricePerSeat: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

busSchema.index({ startCity: 1, destination: 1 });

export const Bus = mongoose.model('Bus', busSchema);
