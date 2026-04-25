import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import './Pricing.css';

const tiers = [
  {
    name: 'Operative',
    price: 'Free',
    description: 'Essential forensic tools for independent researchers.',
    features: ['50 forensic scans/mo', 'Basic metadata extraction', 'Community intelligence', 'Standard resolution'],
    buttonText: 'Initialize Access',
    highlighted: false
  },
  {
    name: 'Agency',
    price: '₹7,999',
    period: '/month',
    description: 'Professional intelligence for editorial teams.',
    features: ['Unlimited forensic scans', 'Deep-dive neural analysis', 'Priority API bandwidth', '4K high-res extraction', 'Multi-operative sync'],
    buttonText: 'Deploy Agency Plan',
    highlighted: true
  },
  {
    name: 'Government',
    price: 'Custom',
    description: 'Scalable infrastructure for global platforms.',
    features: ['Dedicated forensic clusters', 'Custom AI logic tuning', 'Mission-critical SLAs', '24/7 tactical support'],
    buttonText: 'Contact Command',
    highlighted: false
  },
  {
    name: 'Enterprise API',
    price: 'Volume',
    period: '/per scan',
    description: 'High-throughput API for food delivery and scale platforms (Revenue share model).',
    features: ['Infinite scalability', 'Per-transaction billing', 'Webhook integration', 'Custom ML deployment'],
    buttonText: 'Request API Access',
    highlighted: false
  }
];

export default function Pricing() {
  return (
    <div className="pricing-grid">
      {tiers.map((tier, index) => (
        <motion.div
          key={tier.name}
          className={`pricing-card premium-card ${tier.highlighted ? 'highlighted' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <div className="card-header">
            <h3>{tier.name}</h3>
            <div className="price-container">
              <span className="price">{tier.price}</span>
              {tier.period && <span className="period">{tier.period}</span>}
            </div>
            <p>{tier.description}</p>
          </div>
          <div className="card-features">
            <ul>
              {tier.features.map((feat, i) => (
                <li key={i}><Check size={18} className="check-icon"/> {feat}</li>
              ))}
            </ul>
          </div>
          <button className={`pricing-btn ${tier.highlighted ? 'primary' : 'secondary'}`}>
            {tier.buttonText}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
