import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabaseClient';
import { COLORS, t } from './theme';
import type { Language, Page, Profile, Transaction, Invoice, Product } from './types';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { InvoicesScreen } from './screens/InvoicesScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('KH');
  const [page, setPage] = useState<Page>('dashboard');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (!sess) {
        setProfile(null);
        setTransactions([]);
        setInvoices([]);
        setProducts([]);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (data) setProfile(data as Profile);
  }, []);

  const fetchTransactions = useCallback(async (userId: string) => {
    const { data } = await supabase.from('transactions').select('*').eq('user_id', userId).order('transaction_date', { ascending: false }).limit(50);
    if (data) setTransactions(data as Transaction[]);
  }, []);

  const fetchInvoices = useCallback(async (userId: string) => {
    const { data } = await supabase.from('invoices').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50);
    if (data) setInvoices(data as Invoice[]);
  }, []);

  const fetchProducts = useCallback(async (userId: string) => {
    const { data } = await supabase.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setProducts(data as Product[]);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile(session.user.id);
      fetchTransactions(session.user.id);
      fetchInvoices(session.user.id);
      fetchProducts(session.user.id);
    }
  }, [session, fetchProfile, fetchTransactions, fetchInvoices, fetchProducts]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setPage('dashboard');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: COLORS.primaryBg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${COLORS.primaryTint}`, borderTopColor: COLORS.primary, animation: 'spin 0.8s linear infinite' }} />
          <p className="kh" style={{ marginTop: 16, color: COLORS.primary, fontSize: 14, fontWeight: 500 }}>{t('loading', lang)}</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen lang={lang} setLang={setLang} onAuthSuccess={() => {}} />;
  }

  return (
    <div style={{ minHeight: '100dvh', background: COLORS.neutral100, paddingBottom: 80 }}>
      {page === 'dashboard' && (
        <DashboardScreen
          lang={lang}
          setLang={setLang}
          profile={profile}
          transactions={transactions}
          invoices={invoices}
          products={products}
          onNavigate={setPage}
          onSignOut={handleSignOut}
        />
      )}
      {page === 'transactions' && (
        <TransactionsScreen
          lang={lang}
          transactions={transactions}
          userId={session.user.id}
          onRefresh={() => fetchTransactions(session.user.id)}
        />
      )}
      {page === 'invoices' && (
        <InvoicesScreen
          lang={lang}
          invoices={invoices}
          userId={session.user.id}
          onRefresh={() => fetchInvoices(session.user.id)}
        />
      )}
      {page === 'products' && (
        <ProductsScreen
          lang={lang}
          products={products}
          userId={session.user.id}
          onRefresh={() => fetchProducts(session.user.id)}
        />
      )}
      {page === 'profile' && (
        <ProfileScreen
          lang={lang}
          setLang={setLang}
          profile={profile}
          onSignOut={handleSignOut}
          onRefresh={() => fetchProfile(session.user.id)}
        />
      )}
      <BottomNav lang={lang} page={page} onNavigate={setPage} />
    </div>
  );
}
