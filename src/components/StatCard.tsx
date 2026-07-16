import { C } from '../theme';
import type { Language } from '../types';

interface Props { label: string; value: string | number; icon: React.ReactNode; color: string; tint: string; lang: Language; }

export function StatCard({ label, value, icon, color, tint, lang }: Props) {
  return (
    <div className="animate-slide-up" style={{
      background: C.n0, borderRadius: 14, padding: '12px 14px', boxShadow: 'var(--sh-md)',
      border: `1px solid ${C.n200}`, display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -10, right: -10, width: 50, height: 50, borderRadius: '50%', background: tint, opacity: 0.45 }} />
      <div style={{ width: 34, height: 34, borderRadius: 8, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>{icon}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: C.n500, fontWeight: 700, margin: 0 }}>{label}</p>
        <p className="en" style={{ fontSize: 19, fontWeight: 700, color, margin: 0, marginTop: 1 }}>{value}</p>
      </div>
    </div>
  );
}
