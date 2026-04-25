import React from 'react';
import { ScanSearch } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo">
        <ScanSearch size={28} className="logo-icon" />
        <h1>AI ML 007</h1>
      </div>
      <div className="tagline">Forensic Media Intelligence</div>
    </header>
  );
}
