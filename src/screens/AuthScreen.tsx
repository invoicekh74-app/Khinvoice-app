import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { COLORS, t } from '../theme';
import type { Language } from '../types';
import { TrendingUp, Phone, Lock, Eye, EyeOff, User, Store } from 'lucide-react';

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
  onAuthSuccess: () => void;
}

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
    setError('');
    setErrorDetail('');
    if (!phone || !password) {
      setError(lang === 'KH' ? 'សូមបំពេញទិន្នន័យឲ្យបានគ្រប់' : 'Please fill all fields');
      return;
    }

    setBusy(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ phone, password });

        if (signUpError) {
          setError(signUpError.message);
          setErrorDetail(JSON.stringify({ message: signUpError.message, name: signUpError.name, status: (signUpError as { status?: number }).status, code: (signUpError as { code?: string }).code }, null, 2));
          setBusy(false);
          return;
        }

        if (data.user && !data.session) {
          setError(lang === 'KH' ? 'Email Confirmation នៅតែបើក! សូមចូល Supabase Dashboard បិទ "Confirm Email"' : 'Email Confirmation is still ON! Turn it off in Supabase Dashboard');
          setBusy(false);
          return;
        }

        if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, business_name: businessName || null, username: username || null, phone });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ phone, password });

        if (signInError) {
          setError(signInError.message);
          setErrorDetail(JSON.stringify({ message: signInError.message, name: signInError.name, status: (signInError as { status?: number }).status, code: (signInError as { code?: string }).code }, null, 2));
          setBusy(false);
          return;
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`${t('networkError', lang)}: ${msg}`);
      setErrorDetail(e instanceof Error ? e.stack || msg : msg);
      setBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px 12px 44px', borderRadius: 12, border: `1.5px solid ${COLORS.neutral200}`,
    background: COLORS.neutral50, fontSize: 15, color: COLORS.neutral800,
    fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)', transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ minHeight: '100dvh', background: `linear-gradient(160deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 50%, ${COLORS.neutral900} 100%)`, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      <div style={{ padding: '60px 24px 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="animate-scale-in" style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '1px solid rgba(255,255,255,0.2)' }}>
          <TrendingUp size={36} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t('appName', lang)}</h1>
        <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{mode === 'signin' ? t('welcome', lang) : t('signUp', lang)}</p>
      </div>

      <div className="animate-slide-up" style={{ margin: '0 20px 20px', background: COLORS.neutral0, borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-xl)', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', background: COLORS.neutral100, borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {(['signin', 'signup'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setErrorDetail(''); }} className="btn-press" style={{
              flex: 1, padding: '10px', borderRadius: 10, border: 'none',
              background: mode === m ? COLORS.primary : 'transparent', color: mode === m ? '#fff' : COLORS.neutral500,
              fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s ease',
              fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
            }}>
              <span className={lang === 'KH' ? 'kh' : 'en'}>{m === 'signin' ? t('signIn', lang) : t('signUp', lang)}</span>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 14, position: 'relative' }}>
          <Phone size={18} color={COLORS.neutral400} style={{ position: 'absolute', left: 14, top: 13, zIndex: 1 }} />
          <input type="tel" placeholder={t('phone', lang)} value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = COLORS.primary; e.target.style.boxShadow = `0 0 0 3px ${COLORS.primaryTint}`; }}
            onBlur={(e) => { e.target.style.borderColor = COLORS.neutral200; e.target.style.boxShadow = 'none'; }} />
        </div>

        <div style={{ marginBottom: 14, position: 'relative' }}>
          <Lock size={18} color={COLORS.neutral400} style={{ position: 'absolute', left: 14, top: 13, zIndex: 1 }} />
          <input type={showPassword ? 'text' : 'password'} placeholder={t('password', lang)} value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: 44 }}
            onFocus={(e) => { e.target.style.borderColor = COLORS.primary; e.target.style.boxShadow = `0 0 0 3px ${COLORS.primaryTint}`; }}
            onBlur={(e) => { e.target.style.borderColor = COLORS.neutral200; e.target.style.boxShadow = 'none'; }} />
          <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: 10, border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
            {showPassword ? <EyeOff size={18} color={COLORS.neutral400} /> : <Eye size={18} color={COLORS.neutral400} />}
          </button>
        </div>

        {mode === 'signup' && (
          <>
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <Store size={18} color={COLORS.neutral400} style={{ position: 'absolute', left: 14, top: 13, zIndex: 1 }} />
              <input type="text" placeholder={t('businessName', lang)} value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = COLORS.primary; e.target.style.boxShadow = `0 0 0 3px ${COLORS.primaryTint}`; }}
                onBlur={(e) => { e.target.style.borderColor = COLORS.neutral200; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <User size={18} color={COLORS.neutral400} style={{ position: 'absolute', left: 14, top: 13, zIndex: 1 }} />
              <input type="text" placeholder={t('username', lang)} value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = COLORS.primary; e.target.style.boxShadow = `0 0 0 3px ${COLORS.primaryTint}`; }}
                onBlur={(e) => { e.target.style.borderColor = COLORS.neutral200; e.target.style.boxShadow = 'none'; }} />
            </div>
          </>
        )}

        {error && (
          <div className="animate-fade-in" style={{ marginTop: 8, padding: '10px 14px', borderRadius: 12, background: COLORS.dangerTint, border: `1px solid ${COLORS.danger}40`, color: COLORS.danger, fontSize: 13 }}>
            <span className={lang === 'KH' ? 'kh' : 'en'}>{error}</span>
            {errorDetail && (
              <pre style={{ marginTop: 8, padding: 8, borderRadius: 8, background: 'rgba(0,0,0,0.06)', fontSize: 10, color: '#7a1e1e', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {errorDetail}
              </pre>
            )}
          </div>
        )}

        <button onClick={handleSubmit} disabled={busy} className="btn-press" style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: busy ? COLORS.neutral300 : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          color: '#fff', fontSize: 16, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', marginTop: 16,
          transition: 'all 0.2s ease', fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {busy ? (
            <>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
              <span className={lang === 'KH' ? 'kh' : 'en'}>{t('loading', lang)}</span>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </>
          ) : (
            <span className={lang === 'KH' ? 'kh' : 'en'}>{mode === 'signin' ? t('signIn', lang) : t('signUp', lang)}</span>
          )}
        </button>
      </div>

      <div style={{ textAlign: 'center', paddingBottom: 40, position: 'relative', zIndex: 1 }}>
        <button onClick={() => setLang(lang === 'KH' ? 'EN' : 'KH')} className="btn-press" style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20,
          padding: '8px 20px', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
        }}>
          {lang === 'KH' ? 'English' : 'ខ្មែរ'}
        </button>
      </div>
    </div>
  );
}
