const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ideahub';
    console.log(`[Database] Attempting connection to ${mongoUri}...`);
    
    // Attempt standard connection with 3 sec timeout
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`[Database] Connected successfully to MongoDB: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Local MongoDB unavailable (${err.message}). Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] Connected to in-memory MongoDB server at: ${uri}`);
    } catch (memErr) {
      console.error(`[Database] Failed to initialize in-memory MongoDB:`, memErr);
      process.exit(1);
    }
  }

  // Seed default data if database is empty or missing admin
  await seedInitialData();
};

const seedInitialData = async () => {
  try {
    const User = require('../models/User');
    const Idea = require('../models/Idea');
    const bcrypt = require('bcryptjs');

    let adminUser = await User.findOne({ email: 'admin@innovationhub.org' });
    if (!adminUser) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@innovationhub.org',
        password: adminPassword,
        role: 'admin'
      });
      console.log('[Database] Admin user seeded successfully.');
    }

    let elenaUser = await User.findOne({ email: 'elena@innovationhub.org' });
    if (!elenaUser) {
      const userPassword = await bcrypt.hash('password123', 10);
      elenaUser = await User.create({
        name: 'Dr. Elena Rostova',
        email: 'elena@innovationhub.org',
        password: userPassword,
        role: 'user'
      });
    }

    let devUser = await User.findOne({ email: 'marcus@techlabs.io' });
    if (!devUser) {
      const userPassword = await bcrypt.hash('password123', 10);
      devUser = await User.create({
        name: 'Marcus Chen',
        email: 'marcus@techlabs.io',
        password: userPassword,
        role: 'user'
      });
    }

    const ideaCount = await Idea.countDocuments();
    if (ideaCount === 0) {
      const initialIdeas = [
        {
          title: 'EcoGrid: Autonomous Microgrid Load Balancer',
          problemStatement: 'Renewable energy sources cause voltage instability in legacy power grids during peak solar and wind generation surges.',
          description: 'An AI-powered decentralized microgrid controller that uses edge computing node nodes to dynamically balance energy loads across solar homes and battery storage systems, reducing grid curtailment by 40%.',
          domain: 'CleanTech',
          technologies: ['IoT', 'Python', 'TensorFlow', 'MQTT', 'Node.js'],
          expectedImpact: 'Reduces carbon emissions by 12,000 metric tons annually per urban grid sector.',
          status: 'prototype',
          votes: 42,
          votedBy: [],
          author: elenaUser._id
        },
        {
          title: 'MedPulse: Early Sepsis Detection Platform',
          problemStatement: 'Sepsis is responsible for 1 in 3 hospital deaths due to delayed diagnostic biomarkers in ICU wards.',
          description: 'Real-time telemetry analysis system that continuously monitors patient vital signs and electronic health records to trigger early sepsis alerts up to 6 hours before clinical onset using transformer models.',
          domain: 'HealthTech',
          technologies: ['React', 'Python', 'FastAPI', 'PyTorch', 'Docker', 'FHIR'],
          expectedImpact: 'Increases sepsis survival rates by 35% across participating ICU departments.',
          status: 'approved',
          votes: 38,
          votedBy: [],
          author: devUser._id
        },
        {
          title: 'QuantumShield: Post-Quantum Cryptographic API Gateway',
          problemStatement: 'Existing TLS 1.3 infrastructure is vulnerable to future harvest-now-decrypt-later quantum computer attacks.',
          description: 'A drop-in reverse proxy gateway supporting NIST-standardized Kyber lattice-based encryption for zero-trust enterprise web APIs without noticeable latency overhead.',
          domain: 'Cybersecurity',
          technologies: ['Rust', 'Go', 'WebAssembly', 'OpenSSL', 'Kubernetes'],
          expectedImpact: 'Secures high-value financial transaction streams against quantum cryptanalysis.',
          status: 'under_review',
          votes: 29,
          votedBy: [],
          author: elenaUser._id
        },
        {
          title: 'EduTwin: Personalized AR Learning Assistant for STEM',
          problemStatement: 'Students struggle to visualize abstract 3D physics and molecular chemistry concepts from 2D textbooks.',
          description: 'An augmented reality interactive sandbox that renders 3D physical simulations in real-time on mobile browsers, adapting difficulty dynamically based on eye tracking and problem-solving pace.',
          domain: 'EdTech',
          technologies: ['Three.js', 'React', 'WebXR', 'Node.js', 'WebSockets'],
          expectedImpact: 'Improves STEM quiz retention scores by 45% among high school chemistry cohorts.',
          status: 'submitted',
          votes: 18,
          votedBy: [],
          author: devUser._id
        },
        {
          title: 'PayStream: Micro-liquidity Protocol for Gig Workers',
          problemStatement: 'Gig workers experience cash flow friction due to bi-weekly pay cycles despite working daily shifts.',
          description: 'Instant wage access platform integrating real-time payroll streaming protocols to let workers claim verified earnings instantly per completed delivery or shift with sub-cent fees.',
          domain: 'FinTech',
          technologies: ['Node.js', 'Express', 'MongoDB', 'React', 'TailwindCSS'],
          expectedImpact: 'Eliminates payday loan reliance for over 50,000 platform contractors.',
          status: 'implemented',
          votes: 54,
          votedBy: [],
          author: elenaUser._id
        }
      ];

      await Idea.insertMany(initialIdeas);
    }
  } catch (seedErr) {
    console.error('[Database] Error seeding initial data:', seedErr);
  }
};

module.exports = connectDB;
