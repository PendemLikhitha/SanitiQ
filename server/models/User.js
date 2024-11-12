const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gmail: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  primaryContactNumber: {
    type: String,
    required: true
  },
  alternateContactNumber: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  cycleDay: {
    type: Number,
    required: true
  },
  problems: {
    cramps: {
      type: Boolean,
      default: false
    },
    backbonePain: {
      type: Boolean,
      default: false
    },
    legsPain: {
      type: Boolean,
      default: false
    },
    moodSwings: {
      type: Boolean,
      default: false
    },
    other: {
      type: Boolean,
      default: false
    }
  }
});

module.exports = mongoose.model('User ', userSchema);