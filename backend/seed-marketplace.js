require('dotenv').config();
const mongoose = require('mongoose');
const Opportunity = require('./src/models/Opportunity');

const OPPORTUNITIES = [
  { 
    type: 'grant', 
    title: 'Early-Stage Founder Grant', 
    provider: 'Valkyrie Foundation',
    amount: '$50,000',
    tags: ['seed', 'grant'], 
    skills: ['fundraising', 'pitching'], 
    goals: ['fundraise'],
    description: 'A non-dilutive grant for first-time founders building in AI or Web3.',
    contactEmail: 'grants@valkyrie.io'
  },
  { 
    type: 'accelerator', 
    title: 'Global Accelerator Cohort', 
    provider: 'Valkyrie X',
    amount: '$150,000 + Equity',
    tags: ['accelerator'], 
    skills: ['growth', 'product'], 
    goals: ['scale'],
    description: '3-month intensive program to scale your startup to Series A.',
    contactEmail: 'apply@valkyrie.io'
  },
  { 
    type: 'investment', 
    title: 'AI & ML Investor Round', 
    provider: 'Network Angels',
    amount: '$500,000',
    tags: ['investment', 'ai'], 
    skills: ['machine learning', 'data science'], 
    goals: ['raise_series_a'],
    description: 'Syndicate round for startups leveraging Large Language Models.',
    contactEmail: 'deals@valkyrie.io'
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    await Opportunity.deleteMany({});
    console.log('Cleared existing opportunities.');
    
    await Opportunity.insertMany(OPPORTUNITIES);
    console.log('Inserted seed opportunities.');
    
    mongoose.connection.close();
    console.log('Done.');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
