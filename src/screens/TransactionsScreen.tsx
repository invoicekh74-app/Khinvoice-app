import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { COLORS, t } from '../theme';
import type { Language, Transaction, TransactionType } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';
import { TrendingUp, TrendingDown, Plus, X } from 'lucide-react';

interface Props {
  lang: Language;
  transactions: Transaction[];
  userId: string;
  onRefresh: () => void;
}

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
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('transactions').insert({
      user_id: userId, type: form.type, description: form.description,
      quantity: Number(form.quantity) || 1, unit: form.unit || null,
      unit_price: Number(form.unitPrice), amount: Number(form.unitPrice) * (Number(form.quantity) || 1),
      transaction_date: form.date, currency: 'USD',
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowAdd(false);
    setForm({ type: 'income', description: '', quantity: '1', unit: '', unitPrice: '', date: new Date().toISOString().slice(0, 10) });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete', lang))) return;
    await supabase.from('transactions').delete().eq('id', id);
    onRefresh();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${COLORS.neutral200}`,
    background: COLORS.neutral50, fontSize: 14, color: COLORS.neutral800,
    fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
  };

  return (
    <div>
      <ScreenHeader lang={lang} title={t('transactions', lang)} right={
        <button onClick={() => setShowAdd(true)} className="btn-press" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer' }}>
          <Plus size={22} color="#fff" />
        </button>
      } />

      <div style={{ display: 'flex', gap: 8, padding: '12px 16px' }}>
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="btn-press" style={{
            padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
            background: filter === f ? COLORS.primary : COLORS.neutral0,
            color: filter === f ? '#fff' : COLORS.neutral500,
            fontSize: 13, fontWeight: 600,
            fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
            boxShadow: filter === f ? 'var(--shadow-sm)' : 'none',
            border: `1px solid ${filter === f ? COLORS.primary : COLORS.neutral200}`,
          }}>
            <span className={lang === 'KH' ? 'kh' : 'en'}>{t(f, lang)}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: COLORS.neutral0, borderRadius: 16, border: `1px dashed ${COLORS.neutral200}` }}>
            <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, color: COLORS.neutral400 }}>{t('noTransactions', lang)}</p>
          </div>
        ) : (
          filtered.map((tx, i) => {
            const amt = Number(tx.amount || tx.unit_price * tx.quantity);
            const isIncome = tx.type === 'income';
            return (
              <div key={tx.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms`, background: COLORS.neutral0, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-sm)', border: `1px solid ${COLORS.neutral200}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: isIncome ? COLORS.successTint : COLORS.dangerTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isIncome ? <TrendingUp size={18} color={COLORS.success} /> : <TrendingDown size={18} color={COLORS.danger} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }} onClick={() => handleDelete(tx.id)}>
                  <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, fontWeight: 600, color: COLORS.neutral800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.description}</p>
                  <p className="en" style={{ fontSize: 11, color: COLORS.neutral400, margin: 0, marginTop: 2 }}>{tx.transaction_date} · {tx.quantity} {tx.unit || ''}</p>
                </div>
                <p className="en" style={{ fontSize: 15, fontWeight: 700, color: isIncome ? COLORS.success : COLORS.danger, margin: 0, flexShrink: 0 }}>{isIncome ? '+' : '-'}{fmt(amt)}</p>
              </div>
            );
          })
        )}
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end', maxWidth: 480, margin: '0 auto' }} onClick={() => setShowAdd(false)}>
          <div className="animate-slide-up" style={{ background: COLORS.neutral0, borderRadius: '24px 24px 0 0', padding: 24, width: '100%', maxHeight: '80dvh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 18, fontWeight: 700, color: COLORS.neutral800, margin: 0 }}>{t('addTransaction', lang)}</h2>
              <button onClick={() => setShowAdd(false)} style={{ border: 'none', background: COLORS.neutral100, borderRadius: 10, padding: 8, cursor: 'pointer' }}><X size={20} color={COLORS.neutral500} /></button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['income', 'expense'] as const).map((tp) => (
                <button key={tp} onClick={() => setForm({ ...form, type: tp })} className="btn-press" style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  border: `1.5px solid ${form.type === tp ? (tp === 'income' ? COLORS.success : COLORS.danger) : COLORS.neutral200}`,
                  background: form.type === tp ? (tp === 'income' ? COLORS.successTint : COLORS.dangerTint) : COLORS.neutral50,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  {tp === 'income' ? <TrendingUp size={16} color={form.type === tp ? COLORS.success : COLORS.neutral400} /> : <TrendingDown size={16} color={form.type === tp ? COLORS.danger : COLORS.neutral400} />}
                  <span className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, fontWeight: 600, color: form.type === tp ? (tp === 'income' ? COLORS.success : COLORS.danger) : COLORS.neutral400 }}>{t(tp, lang)}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="text" placeholder={t('description', lang)} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" placeholder={t('quantity', lang)} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                <input type="text" placeholder={t('unit', lang)} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
              </div>
              <input type="number" placeholder={t('unitPrice', lang)} value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} style={inputStyle} />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              {error && <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 13, color: COLORS.danger, margin: 0 }}>{error}</p>}
              <button onClick={handleAdd} disabled={saving} className="btn-press" style={{ padding: '14px', borderRadius: 12, border: 'none', background: COLORS.primary, color: '#fff', fontSize: 16, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)' }}>
                <span className={lang === 'KH' ? 'kh' : 'en'}>{saving ? t('loading', lang) : t('save', lang)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
