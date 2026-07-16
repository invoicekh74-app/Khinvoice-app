import { C, tr } from '../theme';
import type { Language, Invoice } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';
import { FileText, Plus } from 'lucide-react';

interface Props { lang: Language; invoices: Invoice[]; userId: string; onRefresh: () => void; }

export function InvoicesScreen({ lang, invoices }: Props) {
  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  const sColor = (s: string) => s === 'paid' ? C.success : s === 'partial' ? C.warning : C.danger;
  const sBg = (s: string) => s === 'paid' ? C.successTint : s === 'partial' ? C.warningTint : C.dangerTint;

  return (
    <div>
      <ScreenHeader lang={lang} title={tr('invoices', lang)} right={
        <button className="btn-press" style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer' }}><Plus size={20} color="#fff" /></button>
      } />
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 18px', background: C.n0, borderRadius: 14, border: `1px dashed ${C.n200}` }}>
            <FileText size={36} color={C.n300} style={{ margin: '0 auto 10px' }} />
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, color: C.n400 }}>{tr('noInvoices', lang)}</p>
          </div>
        ) : (
          invoices.map((inv, i) => (
            <div key={inv.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms`, background: C.n0, borderRadius: 14, padding: '14px', boxShadow: 'var(--sh-md)', border: `1px solid ${C.n200}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <p className="en" style={{ fontSize: 15, fontWeight: 700, color: C.n800, margin: 0 }}>#{inv.invoice_number}</p>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 12, color: C.n500, margin: 0, marginTop: 1 }}>{inv.customer_name}</p>
                </div>
                <span className={lang === 'KH' ? 'kh' : 'en'} style={{ padding: '3px 11px', borderRadius: 18, fontSize: 11, fontWeight: 700, background: sBg(inv.status), color: sColor(inv.status), fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)' }}>
                  {tr(inv.status as 'paid' | 'unpaid' | 'partial', lang)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: `1px solid ${C.n100}` }}>
                <div>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: C.n400, margin: 0 }}>{tr('total', lang)}</p>
                  <p className="en" style={{ fontSize: 17, fontWeight: 700, color: C.n800, margin: 0 }}>{fmt(inv.subtotal)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: C.n400, margin: 0 }}>{tr('balanceDue', lang)}</p>
                  <p className="en" style={{ fontSize: 15, fontWeight: 700, color: sColor(inv.status), margin: 0 }}>{fmt(Number(inv.balance || inv.subtotal - inv.paid_amount))}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
