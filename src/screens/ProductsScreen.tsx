import { COLORS, t } from '../theme';
import type { Language, Product } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';
import { Package, Plus, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  lang: Language;
  products: Product[];
  userId: string;
  onRefresh: () => void;
}

export function ProductsScreen({ lang, products }: Props) {
  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  const stockStatus = (p: Product) => {
    if (p.quantity <= 0) return { color: COLORS.danger, tint: COLORS.dangerTint, icon: AlertTriangle, label: t('outOfStock', lang) };
    if (p.quantity <= p.low_stock_threshold) return { color: COLORS.warning, tint: COLORS.warningTint, icon: AlertTriangle, label: t('lowStock', lang) };
    return { color: COLORS.success, tint: COLORS.successTint, icon: CheckCircle, label: t('inStock', lang) };
  };

  return (
    <div>
      <ScreenHeader
        lang={lang}
        title={t('products', lang)}
        right={
          <button className="btn-press" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer' }}>
            <Plus size={22} color="#fff" />
          </button>
        }
      />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: COLORS.neutral0, borderRadius: 16, border: `1px dashed ${COLORS.neutral200}` }}>
            <Package size={40} color={COLORS.neutral300} style={{ margin: '0 auto 12px' }} />
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, color: COLORS.neutral400 }}>{t('noProducts', lang)}</p>
          </div>
        ) : (
          products.map((p, i) => {
            const ss = stockStatus(p);
            const SsIcon = ss.icon;
            return (
              <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms`, background: COLORS.neutral0, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-sm)', border: `1px solid ${COLORS.neutral200}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: ss.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={20} color={ss.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, fontWeight: 600, color: COLORS.neutral800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <SsIcon size={12} color={ss.color} />
                    <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: ss.color, fontWeight: 500 }}>{ss.label}</span>
                    <span className="en" style={{ fontSize: 11, color: COLORS.neutral400 }}>· {p.quantity} {p.unit}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p className="en" style={{ fontSize: 15, fontWeight: 700, color: COLORS.neutral800, margin: 0 }}>{fmt(p.sell_price)}</p>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 10, color: COLORS.neutral400, margin: 0 }}>{t('sellPrice', lang)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
