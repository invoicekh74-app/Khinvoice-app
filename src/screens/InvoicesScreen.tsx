import { COLORS, t } from '../theme';
import type { Language, Invoice } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';
import { FileText, Plus } from 'lucide-react';

interface Props {
  lang: Language;
  invoices: Invoice[];
  userId: string;
  onRefresh: () => void;
}

export function InvoicesScreen({ lang, invoices }: Props) {
  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  const statusColor = (s: string) => {
    if (s === 'paid') return COLORS.success;
    if (s === 'partial') return COLORS.warning;
    return COLORS.danger;
  };
  const statusBg = (s: string) => {
    if (s === 'paid') return COLORS.successTint;
    if (s === 'partial') return COLORS.warningTint;
    return COLORS.dangerTint;
  };

  return (
    <div>
      <ScreenHeader
        lang={lang}
        title={t('invoices', lang)}
        right={
          <button className="btn-press" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer' }}>
            <Plus size={22} color="#fff" />
          </button>
        }
      />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: COLORS.neutral0, borderRadius: 16, border: `1px dashed ${COLORS.neutral200}` }}>
            <FileText size={40} color={COLORS.neutral300} style={{ margin: '0 auto 12px' }} />
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, color: COLORS.neutral400 }}>{t('noInvoices', lang)}</p>
          </div>
        ) : (
          invoices.map((inv, i) => (
            <div key={inv.id} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms`, background: COLORS.neutral0, borderRadius: 16, padding: '16px', boxShadow: 'var(--shadow-md)', border: `1px solid ${COLORS.neutral200}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p className="en" style={{ fontSize: 16, fontWeight: 700, color: COLORS.neutral800, margin: 0 }}>#{inv.invoice_number}</p>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, color: COLORS.neutral500, margin: 0, marginTop: 2 }}>{inv.customer_name}</p>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusBg(inv.status), color: statusColor(inv.status), fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)' }} className={lang === 'KH' ? 'kh' : 'en'}>
                  {t(inv.status as 'paid' | 'unpaid' | 'partial', lang)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: `1px solid ${COLORS.neutral100}` }}>
                <div>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: COLORS.neutral400, margin: 0 }}>{t('total', lang)}</p>
                  <p className="en" style={{ fontSize: 18, fontWeight: 700, color: COLORS.neutral800, margin: 0 }}>{fmt(inv.subtotal)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: COLORS.neutral400, margin: 0 }}>{t('balanceDue', lang)}</p>
                  <p className="en" style={{ fontSize: 16, fontWeight: 600, color: statusColor(inv.status), margin: 0 }}>{fmt(Number(inv.balance || inv.subtotal - inv.paid_amount))}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
