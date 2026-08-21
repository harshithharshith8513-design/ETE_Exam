const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
      trim: true
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters long'],
      trim: true
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      enum: ['AI/ML', 'HealthTech', 'FinTech', 'CleanTech', 'EdTech', 'Cybersecurity', 'IoT / Robotics', 'Other'],
      default: 'Other'
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology tag is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one technology tag is required'
      }
    },
    expectedImpact: {
      type: String,
      required: [true, 'Expected impact description is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'prototype', 'implemented'],
      default: 'submitted'
    },
    votes: {
      type: Number,
      default: 0
    },
    votedBy: {
      type: [String],
      default: []
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Search indexes
IdeaSchema.index({ title: 'text', problemStatement: 'text', description: 'text', technologies: 'text' });

module.exports = mongoose.model('Idea', IdeaSchema);
