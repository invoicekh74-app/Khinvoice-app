import { C, tr } from '../theme';
import type { Language, Page, Profile, Transaction, Invoice, Product } from '../types';
import { StatCard } from '../components/StatCard';
import { TrendingUp, TrendingDown, Wallet, FileText, ArrowRight, LogOut } from 'lucide-react';

interface Props {
  lang: Language; setLang: (l: Language) => void; profile: Profile | null;
  transactions: Transaction[]; invoices: Invoice[]; products: Product[];
  onNavigate: (p: Page) => void; onSignOut: () => void;
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
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`, padding: '18px 18px 24px', paddingTop: 'calc(18px + env(safe-area-inset-top))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -25, right: -25, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -15, right: 30, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: 18 }}>
          <div>
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{tr('welcome', lang)}</p>
            <h1 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 19, fontWeight: 700, color: '#fff', margin: 0, marginTop: 1 }}>{profile?.business_name || profile?.username || (lang === 'KH' ? 'អាជីព' : 'Business')}</h1>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <button onClick={() => setLang(lang === 'KH' ? 'EN' : 'KH')} className="btn-press" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, padding: '7px 11px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-en)' }}>{lang === 'KH' ? 'EN' : 'KH'}</button>
            <button onClick={onSignOut} className="btn-press" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, padding: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><LogOut size={17} color="#fff" /></button>
          </div>
        </div>

        {/* Balance card */}
        <div className="animate-slide-up" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 18, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.12)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <Wallet size={15} color="rgba(255,255,255,0.75)" />
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{tr('netProfit', lang)} · {tr('thisMonth', lang)}</p>
          </div>
          <p className="en" style={{ fontSize: 30, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: -0.5 }}>{fmt(netProfit)}</p>
          <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={13} color={C.success} />
                <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{tr('income', lang)}</p>
              </div>
              <p className="en" style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0, marginTop: 1 }}>{fmt(totalIncome)}</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingDown size={13} color={C.danger} />
                <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{tr('expense', lang)}</p>
              </div>
              <p className="en" style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0, marginTop: 1 }}>{fmt(totalExpense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <StatCard lang={lang} label={tr('unpaid', lang)} value={unpaidInvoices.length} icon={<FileText size={17} color={C.warning} />} color={C.warning} tint={C.warningTint} />
          <StatCard lang={lang} label={tr('lowStock', lang)} value={lowStock.length} icon={<span style={{ color: C.danger, fontSize: 15, fontWeight: 700 }}>!</span>} color={C.danger} tint={C.dangerTint} />
        </div>

        <div style={{ display: 'flex', gap: 9, marginBottom: 22 }}>
          {([
            { page: 'transactions' as Page, label: tr('addTransaction', lang), color: C.primary, tint: C.primaryTint },
            { page: 'invoices' as Page, label: tr('addInvoice', lang), color: C.accent, tint: C.accentTint },
            { page: 'products' as Page, label: tr('addProduct', lang), color: C.success, tint: C.successTint },
          ]).map((a) => (
            <button key={a.page} onClick={() => onNavigate(a.page)} className="btn-press" style={{ flex: 1, padding: '11px 7px', borderRadius: 12, border: 'none', background: a.tint, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transition: 'all 0.2s ease' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>+</span></div>
              <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 10, fontWeight: 700, color: a.color, textAlign: 'center', lineHeight: 1.3 }}>{a.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 15, fontWeight: 700, color: C.n800, margin: 0 }}>{tr('recentTransactions', lang)}</h2>
          <button onClick={() => onNavigate('transactions')} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 12, color: C.primary, fontWeight: 700 }}>{tr('all', lang)}</span>
            <ArrowRight size={13} color={C.primary} />
          </button>
        </div>

        {recentTx.length === 0 ? (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '36px 18px', background: C.n0, borderRadius: 14, border: `1px dashed ${C.n200}` }}>
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, color: C.n400 }}>{tr('noTransactions', lang)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {recentTx.map((tx, i) => {
              const amt = Number(tx.amount || tx.unit_price * tx.quantity);
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms`, background: C.n0, borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--sh-sm)', border: `1px solid ${C.n200}` }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: isIncome ? C.successTint : C.dangerTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isIncome ? <TrendingUp size={17} color={C.success} /> : <TrendingDown size={17} color={C.danger} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, fontWeight: 700, color: C.n800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.description}</p>
                    <p className="en" style={{ fontSize: 11, color: C.n400, margin: 0, marginTop: 1 }}>{tx.transaction_date}</p>
                  </div>
                  <p className="en" style={{ fontSize: 14, fontWeight: 700, color: isIncome ? C.success : C.danger, margin: 0, flexShrink: 0 }}>{isIncome ? '+' : '-'}{fmt(amt)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
