import { C, tr } from '../theme';
import type { Language, Product } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';
import { Package, Plus, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props { lang: Language; products: Product[]; userId: string; onRefresh: () => void; }

export function ProductsScreen({ lang, products }: Props) {
  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  const stockStatus = (p: Product) => {
    if (p.quantity <= 0) return { color: C.danger, tint: C.dangerTint, icon: AlertTriangle, label: tr('outOfStock', lang) };
    if (p.quantity <= p.low_stock_threshold) return { color: C.warning, tint: C.warningTint, icon: AlertTriangle, label: tr('lowStock', lang) };
    return { color: C.success, tint: C.successTint, icon: CheckCircle, label: tr('inStock', lang) };
  };

  return (
    <div>
      <ScreenHeader lang={lang} title={tr('products', lang)} right={
        <button className="btn-press" style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer' }}><Plus size={20} color="#fff" /></button>
      } />
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 18px', background: C.n0, borderRadius: 14, border: `1px dashed ${C.n200}` }}>
            <Package size={36} color={C.n300} style={{ margin: '0 auto 10px' }} />
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, color: C.n400 }}>{tr('noProducts', lang)}</p>
          </div>
        ) : (
          products.map((p, i) => {
            const ss = stockStatus(p);
            const SsIcon = ss.icon;
            return (
              <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms`, background: C.n0, borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--sh-sm)', border: `1px solid ${C.n200}` }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: ss.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={19} color={ss.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, fontWeight: 700, color: C.n800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                    <SsIcon size={11} color={ss.color} />
                    <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: ss.color, fontWeight: 700 }}>{ss.label}</span>
                    <span className="en" style={{ fontSize: 11, color: C.n400 }}>· {p.quantity} {p.unit}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p className="en" style={{ fontSize: 14, fontWeight: 700, color: C.n800, margin: 0 }}>{fmt(p.sell_price)}</p>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 10, color: C.n400, margin: 0 }}>{tr('sellPrice', lang)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
