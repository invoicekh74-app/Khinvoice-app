import { C } from '../theme';
import { ChevronLeft } from 'lucide-react';
import type { Language } from '../types';

interface Props { title: string; subtitle?: string; onBack?: () => void; lang: Language; right?: React.ReactNode; }

export function ScreenHeader({ title, subtitle, onBack, lang, right }: Props) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
      padding: '14px 16px', paddingTop: 'calc(14px + env(safe-area-inset-top))',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {onBack && (
        <button onClick={onBack} className="btn-press" style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeft size={20} color="#fff" />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.2, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
        {subtitle && <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0, marginTop: 1 }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
