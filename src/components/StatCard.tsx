import { COLORS } from '../theme';
import type { Language } from '../types';

interface Props {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  tint: string;
  lang: Language;
}

export function StatCard({ label, value, icon, color, tint, lang }: Props) {
  return (
    <div className="animate-slide-up" style={{ background: COLORS.neutral0, borderRadius: 16, padding: '14px 16px', boxShadow: 'var(--shadow-md)', border: `1px solid ${COLORS.neutral200}`, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -12, right: -12, width: 60, height: 60, borderRadius: '50%', background: tint, opacity: 0.5 }} />
      <div style={{ width: 36, height: 36, borderRadius: 10, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        {icon}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: COLORS.neutral500, fontWeight: 500, margin: 0 }}>{label}</p>
        <p className="en" style={{ fontSize: 20, fontWeight: 700, color, margin: 0, marginTop: 2 }}>{value}</p>
      </div>
    </div>
  );
}
