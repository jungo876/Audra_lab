import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Mail, Link } from 'lucide-react';
import './Team.css';

const teamMembers = [
  {
    name: 'Gaurav Paul',
    role: 'Lead Architect & AI Engineer',
    bio: 'Pioneering forensic intelligence models and the core 007 engine.',
    initials: 'GP'
  },
  {
    name: 'Agent X',
    role: 'Security & Infrastructure',
    bio: 'Ensuring zero-knowledge privacy and global scalability.',
    initials: 'AX'
  },
  {
    name: 'Agent Y',
    role: 'Forensic UI/UX',
    bio: 'Translating complex neural data into actionable insights.',
    initials: 'AY'
  }
];

export default function Team() {
  return (
    <div className="team-grid">
      {teamMembers.map((member, index) => (
        <motion.div
          key={member.name}
          className="team-card premium-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15, duration: 0.5 }}
        >
          <div className="avatar-placeholder">
            <span>{member.initials}</span>
          </div>
          <h3>{member.name}</h3>
          <span className="role">{member.role}</span>
          <p>{member.bio}</p>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><Mail size={20} /></a>
            <a href="#"><Link size={20} /></a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
