import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import { C, tr } from './theme';
import type { Language, Page, Profile, Transaction, Invoice, Product } from './types';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { InvoicesScreen } from './screens/InvoicesScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('KH');
  const [page, setPage] = useState<Page>('dashboard');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) { setProfile(null); setTransactions([]); setInvoices([]); setProducts([]); }
    });
    return () => l.subscription.unsubscribe();
  }, []);

  const fetchProfile = useCallback(async (uid: string) => { const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle(); if (data) setProfile(data as Profile); }, []);
  const fetchTx = useCallback(async (uid: string) => { const { data } = await supabase.from('transactions').select('*').eq('user_id', uid).order('transaction_date', { ascending: false }).limit(50); if (data) setTransactions(data as Transaction[]); }, []);
  const fetchInv = useCallback(async (uid: string) => { const { data } = await supabase.from('invoices').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(50); if (data) setInvoices(data as Invoice[]); }, []);
  const fetchProd = useCallback(async (uid: string) => { const { data } = await supabase.from('products').select('*').eq('user_id', uid).order('created_at', { ascending: false }); if (data) setProducts(data as Product[]); }, []);

  useEffect(() => {
    if (session?.user?.id) { fetchProfile(session.user.id); fetchTx(session.user.id); fetchInv(session.user.id); fetchProd(session.user.id); }
  }, [session, fetchProfile, fetchTx, fetchInv, fetchProd]);

  const handleSignOut = async () => { await supabase.auth.signOut(); setPage('dashboard'); };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: C.primaryBg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${C.primaryTint}`, borderTopColor: C.primary, animation: 'spin 0.8s linear infinite' }} />
        <p className="kh" style={{ marginTop: 14, color: C.primary, fontSize: 13, fontWeight: 700 }}>{tr('loading', lang)}</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (!session) return <AuthScreen lang={lang} setLang={setLang} onAuthSuccess={() => {}} />;

  return (
    <div style={{ minHeight: '100dvh', background: C.n100, paddingBottom: 76 }}>
      {page === 'dashboard' && <DashboardScreen lang={lang} setLang={setLang} profile={profile} transactions={transactions} invoices={invoices} products={products} onNavigate={setPage} onSignOut={handleSignOut} />}
      {page === 'transactions' && <TransactionsScreen lang={lang} transactions={transactions} userId={session.user.id} onRefresh={() => fetchTx(session.user.id)} />}
      {page === 'invoices' && <InvoicesScreen lang={lang} invoices={invoices} userId={session.user.id} onRefresh={() => fetchInv(session.user.id)} />}
      {page === 'products' && <ProductsScreen lang={lang} products={products} userId={session.user.id} onRefresh={() => fetchProd(session.user.id)} />}
      {page === 'profile' && <ProfileScreen lang={lang} setLang={setLang} profile={profile} onSignOut={handleSignOut} onRefresh={() => fetchProfile(session.user.id)} />}
      <BottomNav lang={lang} page={page} onNavigate={setPage} />
    </div>
  );
}
