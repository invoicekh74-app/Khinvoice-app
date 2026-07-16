import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { C, tr } from '../theme';
import type { Language, Transaction, TransactionType } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';
import { TrendingUp, TrendingDown, Plus, X } from 'lucide-react';

interface Props { lang: Language; transactions: Transaction[]; userId: string; onRefresh: () => void; }

export function TransactionsScreen({ lang, transactions, userId, onRefresh }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [form, setForm] = useState({ type: 'income' as TransactionType, description: '', quantity: '1', unit: '', unitPrice: '', date: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);
  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  const handleAdd = async () => {
    if (!form.description || !form.unitPrice) { setError(lang === 'KH' ? 'សូមបំពេញទិន្នន័យ' : 'Please fill required fields'); return; }
    setSaving(true); setError('');
    const { error: err } = await supabase.from('transactions').insert({ user_id: userId, type: form.type, description: form.description, quantity: Number(form.quantity) || 1, unit: form.unit || null, unit_price: Number(form.unitPrice), amount: Number(form.unitPrice) * (Number(form.quantity) || 1), transaction_date: form.date, currency: 'USD' });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowAdd(false);
    setForm({ type: 'income', description: '', quantity: '1', unit: '', unitPrice: '', date: new Date().toISOString().slice(0, 10) });
    onRefresh();
  };

  const handleDelete = async (id: string) => { if (!confirm(tr('confirmDelete', lang))) return; await supabase.from('transactions').delete().eq('id', id); onRefresh(); };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.n200}`, background: C.n50, fontSize: 14, color: C.n800, fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)' };

  return (
    <div>
      <ScreenHeader lang={lang} title={tr('transactions', lang)} right={
        <button onClick={() => setShowAdd(true)} className="btn-press" style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer' }}><Plus size={20} color="#fff" /></button>
      } />

      <div style={{ display: 'flex', gap: 7, padding: '10px 14px' }}>
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="btn-press" style={{
            padding: '6px 14px', borderRadius: 18, cursor: 'pointer',
            background: filter === f ? C.primary : C.n0, color: filter === f ? '#fff' : C.n500,
            fontSize: 13, fontWeight: 700, fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
            boxShadow: filter === f ? 'var(--sh-sm)' : 'none', border: `1px solid ${filter === f ? C.primary : C.n200}`,
          }}><span className={lang === 'KH' ? 'kh' : 'en'}>{tr(f, lang)}</span></button>
        ))}
      </div>

      <div style={{ padding: '0 14px 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 18px', background: C.n0, borderRadius: 14, border: `1px dashed ${C.n200}` }}>
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, color: C.n400 }}>{tr('noTransactions', lang)}</p>
          </div>
        ) : (
          filtered.map((tx, i) => {
            const amt = Number(tx.amount || tx.unit_price * tx.quantity);
            const isIncome = tx.type === 'income';
            return (
              <div key={tx.id} className="animate-slide-up" style={{ animationDelay: `${i * 25}ms`, background: C.n0, borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--sh-sm)', border: `1px solid ${C.n200}` }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: isIncome ? C.successTint : C.dangerTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isIncome ? <TrendingUp size={17} color={C.success} /> : <TrendingDown size={17} color={C.danger} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }} onClick={() => handleDelete(tx.id)}>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, fontWeight: 700, color: C.n800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.description}</p>
                  <p className="en" style={{ fontSize: 11, color: C.n400, margin: 0, marginTop: 1 }}>{tx.transaction_date} · {tx.quantity} {tx.unit || ''}</p>
                </div>
                <p className="en" style={{ fontSize: 14, fontWeight: 700, color: isIncome ? C.success : C.danger, margin: 0, flexShrink: 0 }}>{isIncome ? '+' : '-'}{fmt(amt)}</p>
              </div>
            );
          })
        )}
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end', maxWidth: 480, margin: '0 auto' }} onClick={() => setShowAdd(false)}>
          <div className="animate-slide-up" style={{ background: C.n0, borderRadius: '22px 22px 0 0', padding: 22, width: '100%', maxHeight: '80dvh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 17, fontWeight: 700, color: C.n800, margin: 0 }}>{tr('addTransaction', lang)}</h2>
              <button onClick={() => setShowAdd(false)} style={{ border: 'none', background: C.n100, borderRadius: 8, padding: 7, cursor: 'pointer' }}><X size={18} color={C.n500} /></button>
            </div>
            <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
              {(['income', 'expense'] as const).map((tp) => (
                <button key={tp} onClick={() => setForm({ ...form, type: tp })} className="btn-press" style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  border: `1.5px solid ${form.type === tp ? (tp === 'income' ? C.success : C.danger) : C.n200}`,
                  background: form.type === tp ? (tp === 'income' ? C.successTint : C.dangerTint) : C.n50,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                  {tp === 'income' ? <TrendingUp size={15} color={form.type === tp ? C.success : C.n400} /> : <TrendingDown size={15} color={form.type === tp ? C.danger : C.n400} />}
                  <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, fontWeight: 700, color: form.type === tp ? (tp === 'income' ? C.success : C.danger) : C.n400 }}>{tr(tp, lang)}</span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="text" placeholder={tr('description', lang)} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
              <div style={{ display: 'flex', gap: 7 }}>
                <input type="number" placeholder={tr('quantity', lang)} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                <input type="text" placeholder={tr('unit', lang)} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
              </div>
              <input type="number" placeholder={tr('unitPrice', lang)} value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} style={inputStyle} />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              {error && <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, color: C.danger, margin: 0 }}>{error}</p>}
              <button onClick={handleAdd} disabled={saving} className="btn-press" style={{ padding: '13px', borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)' }}>
                <span className={lang === 'KH' ? 'kh' : 'en'}>{saving ? tr('loading', lang) : tr('save', lang)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
