import mongoose from 'mongoose';
import { ROLE } from '@utils/string';

const Role = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 50,
    unique: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
})

export default mongoose.model(ROLE, Role)