import { COLORS, t } from '../theme';
import type { Language, Page, Profile, Transaction, Invoice, Product } from '../types';
import { StatCard } from '../components/StatCard';
import { TrendingUp, TrendingDown, Wallet, FileText, ArrowRight, LogOut } from 'lucide-react';

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
  profile: Profile | null;
  transactions: Transaction[];
  invoices: Invoice[];
  products: Product[];
  onNavigate: (p: Page) => void;
  onSignOut: () => void;
}

export function DashboardScreen({ lang, setLang, profile, transactions, invoices, products, onNavigate, onSignOut }: Props) {
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const monthTx = transactions.filter((t) => t.transaction_date.startsWith(monthStr));
  const totalIncome = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount || t.unit_price * t.quantity), 0);
  const totalExpense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount || t.unit_price * t.quantity), 0);
  const netProfit = totalIncome - totalExpense;

  const unpaidInvoices = invoices.filter((i) => i.status === 'unpaid');
  const lowStock = products.filter((p) => p.quantity <= p.low_stock_threshold && p.is_active);

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  const recentTx = [...transactions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, padding: '20px 20px 28px', paddingTop: 'calc(20px + env(safe-area-inset-top))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: 20 }}>
          <div>
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{t('welcome', lang)}</p>
            <h1 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0, marginTop: 2 }}>{profile?.business_name || profile?.username || (lang === 'KH' ? 'អាជីព' : 'Business')}</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setLang(lang === 'KH' ? 'EN' : 'KH')} className="btn-press" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 12px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-en)' }}>
              {lang === 'KH' ? 'EN' : 'KH'}
            </button>
            <button onClick={onSignOut} className="btn-press" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <LogOut size={18} color="#fff" />
            </button>
          </div>
        </div>

        <div className="animate-slide-up" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '20px 24px', border: '1px solid rgba(255,255,255,0.15)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Wallet size={16} color="rgba(255,255,255,0.8)" />
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{t('netProfit', lang)} · {t('thisMonth', lang)}</p>
          </div>
          <p className="en" style={{ fontSize: 32, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: -0.5 }}>{fmt(netProfit)}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={14} color={COLORS.success} />
                <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{t('income', lang)}</p>
              </div>
              <p className="en" style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0, marginTop: 2 }}>{fmt(totalIncome)}</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingDown size={14} color={COLORS.danger} />
                <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{t('expense', lang)}</p>
              </div>
              <p className="en" style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0, marginTop: 2 }}>{fmt(totalExpense)}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <StatCard lang={lang} label={t('unpaid', lang)} value={unpaidInvoices.length} icon={<FileText size={18} color={COLORS.warning} />} color={COLORS.warning} tint={COLORS.warningTint} />
          <StatCard lang={lang} label={t('lowStock', lang)} value={lowStock.length} icon={<span style={{ color: COLORS.danger, fontSize: 16 }}>!</span>} color={COLORS.danger} tint={COLORS.dangerTint} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {([
            { page: 'transactions' as Page, label: t('addTransaction', lang), color: COLORS.primary, tint: COLORS.primaryTint },
            { page: 'invoices' as Page, label: t('addInvoice', lang), color: COLORS.accent, tint: COLORS.accentTint },
            { page: 'products' as Page, label: t('addProduct', lang), color: COLORS.success, tint: COLORS.successTint },
          ]).map((a) => (
            <button key={a.page} onClick={() => onNavigate(a.page)} className="btn-press" style={{ flex: 1, padding: '12px 8px', borderRadius: 14, border: 'none', background: a.tint, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.2s ease' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>+</span>
              </div>
              <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 10, fontWeight: 600, color: a.color, textAlign: 'center', lineHeight: 1.3 }}>{a.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 16, fontWeight: 700, color: COLORS.neutral800, margin: 0 }}>{t('recentTransactions', lang)}</h2>
          <button onClick={() => onNavigate('transactions')} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 12, color: COLORS.primary, fontWeight: 600 }}>{t('all', lang)}</span>
            <ArrowRight size={14} color={COLORS.primary} />
          </button>
        </div>

        {recentTx.length === 0 ? (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px', background: COLORS.neutral0, borderRadius: 16, border: `1px dashed ${COLORS.neutral200}` }}>
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, color: COLORS.neutral400 }}>{t('noTransactions', lang)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentTx.map((tx, i) => {
              const amt = Number(tx.amount || tx.unit_price * tx.quantity);
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms`, background: COLORS.neutral0, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-sm)', border: `1px solid ${COLORS.neutral200}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: isIncome ? COLORS.successTint : COLORS.dangerTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isIncome ? <TrendingUp size={18} color={COLORS.success} /> : <TrendingDown size={18} color={COLORS.danger} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, fontWeight: 600, color: COLORS.neutral800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.description}</p>
                    <p className="en" style={{ fontSize: 11, color: COLORS.neutral400, margin: 0, marginTop: 2 }}>{tx.transaction_date}</p>
                  </div>
                  <p className="en" style={{ fontSize: 15, fontWeight: 700, color: isIncome ? COLORS.success : COLORS.danger, margin: 0, flexShrink: 0 }}>{isIncome ? '+' : '-'}{fmt(amt)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
