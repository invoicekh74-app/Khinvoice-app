import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { COLORS, t } from '../theme';
import type { Language, Profile } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';
import { Store, User, Phone, LogOut, Save, Globe } from 'lucide-react';

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
  profile: Profile | null;
  onSignOut: () => void;
  onRefresh: () => void;
}

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
    setSaving(false);
    setEditing(false);
    setSaved(true);
    onRefresh();
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px 12px 44px', borderRadius: 12, border: `1.5px solid ${COLORS.neutral200}`,
    background: COLORS.neutral50, fontSize: 15, color: COLORS.neutral800,
    fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
  };

  const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${COLORS.neutral100}` }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.primaryTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 11, color: COLORS.neutral400, margin: 0 }}>{label}</p>
        <p className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 15, fontWeight: 500, color: COLORS.neutral800, margin: 0, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value || '—'}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <ScreenHeader
        lang={lang}
        title={t('profile', lang)}
        right={
          editing ? (
            <button onClick={handleSave} disabled={saving} className="btn-press" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer' }}>
              <Save size={20} color="#fff" />
            </button>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-press" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)' }}>
              <span className={lang === 'KH' ? 'kh' : 'en'}>{t('edit', lang)}</span>
            </button>
          )
        }
      />

      {/* Avatar + name */}
      <div style={{ padding: '24px 20px', textAlign: 'center' }}>
        <div
          className="animate-scale-in"
          style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: 'var(--shadow-lg)' }}
        >
          <User size={36} color="#fff" />
        </div>
        <h2 className={lang === 'KH' ? 'kh' : 'en'} style={{ fontSize: 20, fontWeight: 700, color: COLORS.neutral800, margin: 0 }}>
          {profile?.business_name || profile?.username || (lang === 'KH' ? 'អាជីព' : 'Business')}
        </h2>
        <p className="en" style={{ fontSize: 13, color: COLORS.neutral400, margin: 0, marginTop: 4 }}>
          {profile?.phone || ''}
        </p>
        {saved && (
          <p className="animate-fade-in kh" style={{ fontSize: 13, color: COLORS.success, marginTop: 8, fontWeight: 500 }}>
            {lang === 'KH' ? 'រក្សាទុកដោយជោគជ័យ!' : 'Saved successfully!'}
          </p>
        )}
      </div>

      {/* Info card */}
      <div style={{ margin: '0 16px 16px', background: COLORS.neutral0, borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: `1px solid ${COLORS.neutral200}` }}>
        {editing ? (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <Store size={18} color={COLORS.neutral400} style={{ position: 'absolute', left: 14, top: 13, zIndex: 1 }} />
              <input type="text" placeholder={t('businessName', lang)} value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <User size={18} color={COLORS.neutral400} style={{ position: 'absolute', left: 14, top: 13, zIndex: 1 }} />
              <input type="text" placeholder={t('username', lang)} value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
            </div>
          </div>
        ) : (
          <>
            <Row icon={<Store size={18} color={COLORS.primary} />} label={t('businessName', lang)} value={profile?.business_name} />
            <Row icon={<User size={18} color={COLORS.primary} />} label={t('username', lang)} value={profile?.username} />
            <Row icon={<Phone size={18} color={COLORS.primary} />} label={t('phone', lang)} value={profile?.phone} />
          </>
        )}
      </div>

      {/* Language */}
      <div style={{ margin: '0 16px 16px', background: COLORS.neutral0, borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: `1px solid ${COLORS.neutral200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.accentTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Globe size={18} color={COLORS.accent} />
          </div>
          <span className={lang === 'KH' ? 'kh' : 'en'} style={{ flex: 1, fontSize: 15, fontWeight: 500, color: COLORS.neutral800 }}>{t('language', lang)}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['KH', 'EN'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className="btn-press" style={{
                padding: '6px 14px', borderRadius: 8, border: `1px solid ${lang === l ? COLORS.primary : COLORS.neutral200}`,
                background: lang === l ? COLORS.primary : COLORS.neutral0, color: lang === l ? '#fff' : COLORS.neutral500,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-en)',
              }}>
                {l === 'KH' ? 'ខ្មែរ' : 'English'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div style={{ margin: '0 16px 20px' }}>
        <button
          onClick={onSignOut}
          className="btn-press"
          style={{
            width: '100%', padding: '14px', borderRadius: 14, border: `1.5px solid ${COLORS.dangerTint}`,
            background: COLORS.dangerTint, color: COLORS.danger, fontSize: 15, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: lang === 'KH' ? 'var(--font-kh)' : 'var(--font-en)',
          }}
        >
          <LogOut size={18} color={COLORS.danger} />
          <span className={lang === 'KH' ? 'kh' : 'en'}>{t('signOut', lang)}</span>
        </button>
      </div>
    </div>
  );
}
