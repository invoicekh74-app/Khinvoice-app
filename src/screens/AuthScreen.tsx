import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { C, tr } from '../theme';
import type { Language } from '../types';
import { TrendingUp, Phone, Lock, Eye, EyeOff, User, Store } from 'lucide-react';

interface Props { lang: Language; setLang: (l: Language) => void; onAuthSuccess: () => void; }

export function AuthScreen({ lang, setLang }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [errorDetail, setErrorDetail] = useState('');

  const handleSubmit = async () => {
    setError(''); setErrorDetail('');
    if (!phone || !password) { setError(lang === 'KH' ? 'សូមបំពេញទិន្នន័យឲ្យបានគ្រប់' : 'Please fill all fields'); return; }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error: e } = await supabase.auth.signUp({ phone, password });
        if (e) { setError(e.message); setErrorDetail(JSON.stringify({ message: e.message, name: e.name, status: (e as { status?: number }).status }, null, 2)); setBusy(false); return; }
        if (data.user && !data.session) { setError(lang === 'KH' ? 'Email Confirmation នៅតែបើក!' : 'Email Confirmation is still ON!'); setBusy(false); return; }
        if (data.user) await supabase.from('profiles').upsert({ id: data.user.id, business_name: businessName || null, username: username || null, phone });
      } else {
        const { error: e } = await supabase.auth.signInWithPassword({ phone, password });
        if (e) { setError(e.message); setErrorDetail(JSON.stringify({ message: e.message, name: e.name, status: (e as { status?: number }).status }, null, 2)); setBusy(false); return; }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`${tr('networkError', lang)}: ${msg}`); setErrorDetail(e instanceof Error ? e.stack || msg : msg); setBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10, border: `1.5px solid ${C.n200}`,
    background: C.n50, fontSize: 15, color: C.n800,
    fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)', transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ minHeight: '100dvh', background: `linear-gradient(160deg, ${C.primary} 0%, ${C.primaryDark} 55%, ${C.n900} 100%)`, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      <div style={{ padding: '56px 24px 16px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="animate-scale-in" style={{ width: 68, height: 68, borderRadius: 18, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, border: '1px solid rgba(255,255,255,0.18)' }}>
          <TrendingUp size={34} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{tr('appName', lang)}</h1>
        <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{mode === 'signin' ? tr('welcome', lang) : tr('signUp', lang)}</p>
      </div>

      <div className="animate-slide-up" style={{ margin: '0 20px 16px', background: C.n0, borderRadius: 22, padding: 22, boxShadow: 'var(--sh-xl)', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', background: C.n100, borderRadius: 10, padding: 4, marginBottom: 18 }}>
          {(['signin', 'signup'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setErrorDetail(''); }} className="btn-press" style={{
              flex: 1, padding: '10px', borderRadius: 8, border: 'none',
              background: mode === m ? C.primary : 'transparent', color: mode === m ? '#fff' : C.n500,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s ease',
              fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
            }}>
              <span className={lang === 'KH' ? 'kh' : 'en'}>{m === 'signin' ? tr('signIn', lang) : tr('signUp', lang)}</span>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 12, position: 'relative' }}>
          <Phone size={17} color={C.n400} style={{ position: 'absolute', left: 13, top: 13, zIndex: 1 }} />
          <input type="tel" placeholder={tr('phone', lang)} value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primaryTint}`; }}
            onBlur={(e) => { e.target.style.borderColor = C.n200; e.target.style.boxShadow = 'none'; }} />
        </div>

        <div style={{ marginBottom: 12, position: 'relative' }}>
          <Lock size={17} color={C.n400} style={{ position: 'absolute', left: 13, top: 13, zIndex: 1 }} />
          <input type={showPassword ? 'text' : 'password'} placeholder={tr('password', lang)} value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: 42 }}
            onFocus={(e) => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primaryTint}`; }}
            onBlur={(e) => { e.target.style.borderColor = C.n200; e.target.style.boxShadow = 'none'; }} />
          <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 11, top: 10, border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
            {showPassword ? <EyeOff size={17} color={C.n400} /> : <Eye size={17} color={C.n400} />}
          </button>
        </div>

        {mode === 'signup' && (
          <>
            <div style={{ marginBottom: 12, position: 'relative' }}>
              <Store size={17} color={C.n400} style={{ position: 'absolute', left: 13, top: 13, zIndex: 1 }} />
              <input type="text" placeholder={tr('businessName', lang)} value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primaryTint}`; }}
                onBlur={(e) => { e.target.style.borderColor = C.n200; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ marginBottom: 12, position: 'relative' }}>
              <User size={17} color={C.n400} style={{ position: 'absolute', left: 13, top: 13, zIndex: 1 }} />
              <input type="text" placeholder={tr('username', lang)} value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primaryTint}`; }}
                onBlur={(e) => { e.target.style.borderColor = C.n200; e.target.style.boxShadow = 'none'; }} />
            </div>
          </>
        )}

        {error && (
          <div className="animate-fade-in" style={{ marginTop: 6, padding: '10px 12px', borderRadius: 10, background: C.dangerTint, border: `1px solid ${C.danger}40`, color: C.danger, fontSize: 13 }}>
            <span className={lang === 'KH' ? 'kh' : 'en'}>{error}</span>
            {errorDetail && <pre style={{ marginTop: 6, padding: 6, borderRadius: 6, background: 'rgba(0,0,0,0.06)', fontSize: 10, color: '#7a1e1e', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>{errorDetail}</pre>}
          </div>
        )}

        <button onClick={handleSubmit} disabled={busy} className="btn-press" style={{
          width: '100%', padding: '13px', borderRadius: 10, border: 'none',
          background: busy ? C.n300 : `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
          color: '#fff', fontSize: 16, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', marginTop: 14,
          transition: 'all 0.2s ease', fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {busy ? (
            <>
              <div style={{ width: 17, height: 17, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
              <span className={lang === 'KH' ? 'kh' : 'en'}>{tr('loading', lang)}</span>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </>
          ) : (
            <span className={lang === 'KH' ? 'kh' : 'en'}>{mode === 'signin' ? tr('signIn', lang) : tr('signUp', lang)}</span>
          )}
        </button>
      </div>

      <div style={{ textAlign: 'center', paddingBottom: 36, position: 'relative', zIndex: 1 }}>
        <button onClick={() => setLang(lang === 'KH' ? 'EN' : 'KH')} className="btn-press" style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 18,
          padding: '7px 18px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
        }}>{lang === 'KH' ? 'English' : 'ខ្មែរ'}</button>
      </div>
    </div>
  );
}
