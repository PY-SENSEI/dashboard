import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/Lead.js';
import User from './models/User.js';

dotenv.config();

// Helper function to generate random leads
const generateLeads = (count) => {
  const firstNames = [
    'John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'James', 'Maria',
    'Robert', 'Jennifer', 'Thomas', 'Amanda', 'Christopher', 'Jessica', 'Daniel',
    'Ashley', 'Matthew', 'Nicole', 'Andrew', 'Michelle', 'Joshua', 'Melissa',
    'Kevin', 'Laura', 'Brian', 'Stephanie', 'George', 'Rebecca', 'Edward', 'Rachel',
    'Jason', 'Kimberly', 'Ryan', 'Amy', 'Jacob', 'Angela', 'Gary', 'Samantha',
    'Nicholas', 'Katherine', 'Eric', 'Christina', 'Jonathan', 'Heather', 'Stephen',
    'Elizabeth', 'Larry', 'Deborah', 'Justin', 'Linda'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
    'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
    'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter',
    'Roberts', 'Gomez', 'Phillips'
  ];

  const companies = [
    'TechCorp Solutions', 'Innovate Labs', 'GlobalTech Industries', 'Startup Ventures',
    'Enterprise Networks', 'RetailPro Inc', 'Finance Corporation', 'HealthTech Solutions',
    'EduPlatform', 'Global Logistics', 'Elite Consulting', 'Fashion & Co',
    'Digital Dynamics', 'Smart Systems', 'Cloud Nine Tech', 'Data Insights Co',
    'NextGen Software', 'Peak Performance', 'Velocity Ventures', 'Horizon Analytics',
    'Fusion Technologies', 'Quantum Solutions', 'Apex Industries', 'Summit Strategies',
    'Momentum Media', 'Catalyst Consulting', 'Pioneer Products', 'Vertex Ventures',
    'Nexus Networks', 'Synergy Systems', 'Zenith Zone', 'Impact Innovations',
    'Elevate Enterprises', 'Thrive Technologies', 'Spark Solutions', 'Bright Future Inc',
    'Prime Partners', 'Core Concepts', 'Vision Ventures', 'Atlas Analytics',
    'Blueprint Business', 'Compass Corp', 'Delta Digital', 'Echo Enterprises',
    'Forge Financial', 'Gateway Group', 'Harbor Holdings', 'Icon Industries',
    'Journey Solutions', 'Keystone Corp'
  ];

  const positions = [
    'CTO', 'VP of Operations', 'Director of IT', 'Founder & CEO', 'IT Manager',
    'COO', 'Head of Technology', 'CIO', 'Dean of Technology', 'VP of Operations',
    'Managing Partner', 'Digital Director', 'CFO', 'CMO', 'VP of Sales',
    'Director of Marketing', 'Operations Manager', 'Product Manager', 'Head of Sales',
    'Business Development Manager', 'Technical Lead', 'Engineering Manager',
    'Strategy Director', 'Innovation Officer', 'General Manager'
  ];

  const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const statusWeights = [25, 20, 18, 15, 10, 8, 4]; // Weighted distribution

  const sources = ['website', 'referral', 'social', 'email', 'phone', 'event', 'partner'];
  
  const industries = [
    'Technology', 'SaaS', 'Manufacturing', 'Fintech', 'Telecommunications',
    'Retail', 'Finance', 'Healthcare', 'Education', 'Logistics',
    'Consulting', 'Fashion', 'E-commerce', 'Real Estate', 'Insurance',
    'Automotive', 'Energy', 'Media', 'Entertainment', 'Agriculture'
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Spain', 'Singapore', 'Japan', 'South Korea',
    'Brazil', 'Mexico', 'Netherlands', 'Sweden', 'Switzerland',
    'India', 'China', 'Italy', 'Poland', 'Ireland'
  ];

  const notes = [
    'Interested in enterprise package',
    'Follow-up scheduled for next week',
    'Budget approved, ready for proposal',
    'Proposal sent, awaiting decision',
    'Initial inquiry about cloud solutions',
    'Met at industry conference',
    'Large enterprise deal, multiple stakeholders',
    'Compliance requirements discussed',
    'Negotiating pricing and contract terms',
    'Contract signed! Implementation starts next month',
    'Multi-year contract secured',
    'Chose competitor due to pricing',
    'Needs custom integration',
    'Requesting demo presentation',
    'Evaluating multiple vendors',
    'Timeline: Q2 implementation',
    'Security audit in progress',
    'Requires board approval',
    'Fast-track implementation requested',
    'Annual contract renewal'
  ];

  // Helper to get weighted random status
  const getWeightedStatus = () => {
    const totalWeight = statusWeights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < statuses.length; i++) {
      random -= statusWeights[i];
      if (random <= 0) return statuses[i];
    }
    return statuses[0];
  };

  const leads = [];
  const usedEmails = new Set();

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    
    // Generate unique email
    let email;
    do {
      const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.random() > 0.5 ? Math.floor(Math.random() * 99) : ''}`;
      const domain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
      email = `${emailPrefix}@${domain}`;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    const status = getWeightedStatus();
    const hasContact = ['contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].includes(status);

    leads.push({
      firstName,
      lastName,
      email,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      company,
      position: positions[Math.floor(Math.random() * positions.length)],
      status,
      value: Math.floor(Math.random() * 200000) + 20000, // $20k - $220k
      source: sources[Math.floor(Math.random() * sources.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      lastContact: hasContact ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : null,
      notes: notes[Math.floor(Math.random() * notes.length)],
    });
  }

  return leads;
};

const sampleLeads = generateLeads(100);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the first user to assign as creator
    const user = await User.findOne();
    
    if (!user) {
      console.error('No users found. Please register a user first.');
      process.exit(1);
    }

    console.log(`Using user: ${user.email} as lead creator`);

    // Clear existing leads
    await Lead.deleteMany({});
    console.log('Cleared existing leads');

    // Add createdBy to each lead
    const leadsWithCreator = sampleLeads.map(lead => ({
      ...lead,
      createdBy: user._id,
    }));

    // Insert sample leads
    const createdLeads = await Lead.insertMany(leadsWithCreator);
    console.log(`Created ${createdLeads.length} sample leads`);

    // Calculate total value
    const totalValue = createdLeads.reduce((sum, lead) => sum + lead.value, 0);
    const wonValue = createdLeads.filter(l => l.status === 'won').reduce((sum, lead) => sum + lead.value, 0);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample leads created:');
    console.log('- New: ', createdLeads.filter(l => l.status === 'new').length);
    console.log('- Contacted: ', createdLeads.filter(l => l.status === 'contacted').length);
    console.log('- Qualified: ', createdLeads.filter(l => l.status === 'qualified').length);
    console.log('- Proposal: ', createdLeads.filter(l => l.status === 'proposal').length);
    console.log('- Negotiation: ', createdLeads.filter(l => l.status === 'negotiation').length);
    console.log('- Won: ', createdLeads.filter(l => l.status === 'won').length);
    console.log('- Lost: ', createdLeads.filter(l => l.status === 'lost').length);
    console.log('\nTotal pipeline value: $' + totalValue.toLocaleString());
    console.log('Won deals value: $' + wonValue.toLocaleString());

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
