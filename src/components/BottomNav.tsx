import type { Language, Page } from '../types';
import { C, tr } from '../theme';
import { Home, Receipt, FileText, Package, User } from 'lucide-react';

interface Props { lang: Language; page: Page; onNavigate: (p: Page) => void; }

const tabs: { key: Page; icon: typeof Home; label: 'dashboard' | 'transactions' | 'invoices' | 'products' | 'profile' }[] = [
  { key: 'dashboard', icon: Home, label: 'dashboard' },
  { key: 'transactions', icon: Receipt, label: 'transactions' },
  { key: 'invoices', icon: FileText, label: 'invoices' },
  { key: 'products', icon: Package, label: 'products' },
  { key: 'profile', icon: User, label: 'profile' },
];

export function BottomNav({ lang, page, onNavigate }: Props) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480, background: C.n0, borderTop: `1px solid ${C.n200}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '6px 4px', paddingBottom: 'calc(6px + env(safe-area-inset-bottom))',
      zIndex: 100, boxShadow: '0 -2px 16px rgba(27,79,114,0.06)',
    }}>
      {tabs.map(({ key, icon: Icon, label }) => {
        const active = page === key;
        return (
          <button key={key} onClick={() => onNavigate(key)} className="btn-press" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 10px', borderRadius: 10, background: active ? C.primaryTint : 'transparent',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
          }}>
            <Icon size={20} color={active ? C.primary : C.n400} strokeWidth={active ? 2.5 : 2} />
            <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 9, fontWeight: 700, color: active ? C.primary : C.n400, transition: 'all 0.2s ease' }}>
              {tr(label, lang)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
