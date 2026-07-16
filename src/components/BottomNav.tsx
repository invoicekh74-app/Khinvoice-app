import type { Language } from '../types';
import { COLORS, t } from '../theme';
import { Home, Receipt, FileText, Package, User } from 'lucide-react';
import type { Page } from '../types';

interface Props {
  lang: Language;
  page: Page;
  onNavigate: (p: Page) => void;
}

const tabs: { key: Page; icon: typeof Home; labelKey: 'dashboard' | 'transactions' | 'invoices' | 'products' | 'profile' }[] = [
  { key: 'dashboard', icon: Home, labelKey: 'dashboard' },
  { key: 'transactions', icon: Receipt, labelKey: 'transactions' },
  { key: 'invoices', icon: FileText, labelKey: 'invoices' },
  { key: 'products', icon: Package, labelKey: 'products' },
  { key: 'profile', icon: User, labelKey: 'profile' },
];

export function BottomNav({ lang, page, onNavigate }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: COLORS.neutral0,
        borderTop: `1px solid ${COLORS.neutral200}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 4px',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
        zIndex: 100,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {tabs.map(({ key, icon: Icon, labelKey }) => {
        const active = page === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className="btn-press"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '6px 10px',
              borderRadius: 12,
              background: active ? COLORS.primaryTint : 'transparent',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Icon size={22} color={active ? COLORS.primary : COLORS.neutral400} strokeWidth={active ? 2.5 : 2} />
            <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? COLORS.primary : COLORS.neutral400, transition: 'all 0.2s ease' }}>
              {t(labelKey, lang)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
