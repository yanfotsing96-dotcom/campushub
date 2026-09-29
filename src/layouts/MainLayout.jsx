import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function MainLayout() {
  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Top Navigation Bar */}
      <Navbar />

      {/* Main Routed Content Area */}
      <main className="app-main-content" style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>

      {/* Institutional Academic Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--rc-border, #e2e8f0)',
          backgroundColor: 'var(--rc-bg-surface, #ffffff)',
          padding: '24px 16px',
          marginTop: 'auto',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--rc-text-secondary, #64748b)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <strong>CampusHub UY1</strong> · Plateforme Numérique Pédagogique · Faculté des Sciences
          </div>
          <div>
            Système d'archivage & consultation académique · Année Universitaire 2025-2026
          </div>
        </div>
      </footer>
    </div>
  );
}
