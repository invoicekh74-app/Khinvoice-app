import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { C, tr } from '../theme';
import type { Language, Profile } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';
import { Store, User, Phone, LogOut, Save, Globe } from 'lucide-react';

interface Props { lang: Language; setLang: (l: Language) => void; profile: Profile | null; onSignOut: () => void; onRefresh: () => void; }

export function ProfileScreen({ lang, setLang, profile, onSignOut, onRefresh }: Props) {
  const [editing, setEditing] = useState(false);
  const [businessName, setBusinessName] = useState(profile?.business_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await supabase.from('profiles').update({ business_name: businessName, username }).eq('id', profile.id);
    setSaving(false); setEditing(false); setSaved(true); onRefresh();
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10, border: `1.5px solid ${C.n200}`, background: C.n50, fontSize: 15, color: C.n800, fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)' };

  const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: `1px solid ${C.n100}` }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: C.primaryTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: C.n400, margin: 0 }}>{label}</p>
        <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 14, fontWeight: 700, color: C.n800, margin: 0, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div>
      <ScreenHeader lang={lang} title={tr('profile', lang)} right={
        editing ? (
          <button onClick={handleSave} disabled={saving} className="btn-press" style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer' }}><Save size={18} color="#fff" /></button>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-press" style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '7px 12px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)' }}>
            <span className={lang === 'KH' ? 'kh' : 'en'}>{tr('edit', lang)}</span>
          </button>
        )
      } />

      <div style={{ padding: '22px 18px', textAlign: 'center' }}>
        <div className="animate-scale-in" style={{ width: 76, height: 76, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, boxShadow: 'var(--sh-lg)' }}>
          <User size={34} color="#fff" />
        </div>
        <h2 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 19, fontWeight: 700, color: C.n800, margin: 0 }}>{profile?.business_name || profile?.username || (lang === 'KH' ? 'អាជីព' : 'Business')}</h2>
        <p className="en" style={{ fontSize: 13, color: C.n400, margin: 0, marginTop: 3 }}>{profile?.phone || ''}</p>
        {saved && <p className="animate-fade-in kh" style={{ fontSize: 12, color: C.success, marginTop: 6, fontWeight: 700 }}>{lang === 'KH' ? 'រក្សាទុកដោយជោគជ័យ!' : 'Saved successfully!'}</p>}
      </div>

      <div style={{ margin: '0 14px 14px', background: C.n0, borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--sh-md)', border: `1px solid ${C.n200}` }}>
        {editing ? (
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Store size={17} color={C.n400} style={{ position: 'absolute', left: 13, top: 13, zIndex: 1 }} />
              <input type="text" placeholder={tr('businessName', lang)} value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <User size={17} color={C.n400} style={{ position: 'absolute', left: 13, top: 13, zIndex: 1 }} />
              <input type="text" placeholder={tr('username', lang)} value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
            </div>
          </div>
        ) : (
          <>
            <Row icon={<Store size={17} color={C.primary} />} label={tr('businessName', lang)} value={profile?.business_name} />
            <Row icon={<User size={17} color={C.primary} />} label={tr('username', lang)} value={profile?.username} />
            <Row icon={<Phone size={17} color={C.primary} />} label={tr('phone', lang)} value={profile?.phone} />
          </>
        )}
      </div>

      <div style={{ margin: '0 14px 14px', background: C.n0, borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--sh-md)', border: `1px solid ${C.n200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: C.accentTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Globe size={17} color={C.accent} />
          </div>
          <span className={lang === 'KH' ? 'kh' : 'en'} style={{ flex: 1, fontSize: 14, fontWeight: 700, color: C.n800 }}>{tr('language', lang)}</span>
          <div style={{ display: 'flex', gap: 5 }}>
            {(['KH', 'EN'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className="btn-press" style={{
                padding: '5px 12px', borderRadius: 7, border: `1px solid ${lang === l ? C.primary : C.n200}`,
                background: lang === l ? C.primary : C.n0, color: lang === l ? '#fff' : C.n500,
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-en)',
              }}>{l === 'KH' ? 'ខ្មែរ' : 'English'}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ margin: '0 14px 18px' }}>
        <button onClick={onSignOut} className="btn-press" style={{
          width: '100%', padding: '13px', borderRadius: 12, border: `1.5px solid ${C.dangerTint}`,
          background: C.dangerTint, color: C.danger, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
        }}>
          <LogOut size={17} color={C.danger} />
          <span className={lang === 'KH' ? 'kh' : 'en'}>{tr('signOut', lang)}</span>
        </button>
      </div>
    </div>
  );
}
