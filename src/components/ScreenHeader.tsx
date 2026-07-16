import { COLORS } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  lang: 'EN' | 'KH';
  right?: React.ReactNode;
}

import { ChevronLeft } from 'lucide-react';

export function ScreenHeader({ title, subtitle, onBack, lang, right }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
        padding: '16px 16px',
        paddingTop: 'calc(16px + env(safe-area-inset-top))',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="btn-press"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: 10,
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={22} color="#fff" />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          className={lang === 'KH' ? 'kh' : 'en'}
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={lang === 'KH' ? 'kh' : 'en'}
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.8)',
              margin: 0,
              marginTop: 2,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}
