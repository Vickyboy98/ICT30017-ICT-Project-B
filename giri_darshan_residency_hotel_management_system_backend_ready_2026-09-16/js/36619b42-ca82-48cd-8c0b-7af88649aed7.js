
// ─── GRAND AZURE HOTEL — DESIGN SYSTEM COMPONENTS ───────────────────────────

const DS = {
  c: {
    navy: '#0B1628', navyLight: '#162238', navyMid: '#1E3050',
    gold: '#C9A96E', goldLight: '#E8D5B7', goldDark: '#A88748',
    ivory: '#F8F5F0', beige: '#EDE8E0', beigeLight: '#F5F2ED',
    white: '#FFFFFF', text: '#1A2332', textMid: '#4A5568',
    textMuted: '#8B95A1', border: '#E2DDD8', borderLight: '#F0EBE3',
    success: '#2D7A5C', successBg: '#EBF7F2',
    warning: '#B8750E', warningBg: '#FEF3E2',
    danger: '#B84040', dangerBg: '#FDEAEA',
    info: '#2B6CB0', infoBg: '#EBF4FF',
  },
  f: {
    serif: "'Cormorant Garamond', 'Georgia', serif",
    sans: "'DM Sans', system-ui, sans-serif",
  },
  r: { sm: '6px', md: '10px', lg: '16px', xl: '24px', full: '9999px' },
  s: {
    xs: '0 1px 3px rgba(11,22,40,0.06)',
    sm: '0 2px 8px rgba(11,22,40,0.09)',
    md: '0 4px 20px rgba(11,22,40,0.12)',
    lg: '0 8px 40px rgba(11,22,40,0.15)',
    gold: '0 4px 24px rgba(201,169,110,0.28)',
    inset: 'inset 0 1px 3px rgba(11,22,40,0.08)',
  }
};

// ─── CSS INJECTION ────────────────────────────────────────────────────────────
const injectGlobalStyles = () => {
  const id = 'grand-azure-global';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: ${DS.f.sans}; background: ${DS.c.ivory}; color: ${DS.c.text}; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: ${DS.c.beige}; }
    ::-webkit-scrollbar-thumb { background: ${DS.c.goldLight}; border-radius: 3px; }
    a { color: inherit; text-decoration: none; }
    input, select, textarea, button { font-family: inherit; }

    .ga-btn { display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer; font-family: ${DS.f.sans}; font-weight: 500; letter-spacing: 0.04em; transition: all 0.2s ease; white-space: nowrap; }
    .ga-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .ga-input { width: 100%; border: 1.5px solid ${DS.c.border}; border-radius: ${DS.r.md}; font-family: ${DS.f.sans}; font-size: 14px; color: ${DS.c.text}; background: ${DS.c.white}; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
    .ga-input:focus { border-color: ${DS.c.gold}; box-shadow: 0 0 0 3px rgba(201,169,110,0.15); }
    .ga-input::placeholder { color: ${DS.c.textMuted}; }

    .ga-card { background: ${DS.c.white}; border-radius: ${DS.r.lg}; box-shadow: ${DS.s.sm}; border: 1px solid ${DS.c.borderLight}; }
    .ga-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .ga-card-hover:hover { transform: translateY(-3px); box-shadow: ${DS.s.md}; }

    .ga-table { width: 100%; border-collapse: collapse; }
    .ga-table th { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${DS.c.textMuted}; padding: 12px 16px; text-align: left; background: ${DS.c.beigeLight}; border-bottom: 1px solid ${DS.c.border}; }
    .ga-table td { padding: 14px 16px; border-bottom: 1px solid ${DS.c.borderLight}; font-size: 14px; color: ${DS.c.textMid}; vertical-align: middle; }
    .ga-table tr:last-child td { border-bottom: none; }
    .ga-table tr:hover td { background: rgba(201,169,110,0.04); }

    .ga-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: ${DS.r.full}; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }

    .ga-tab { padding: 8px 18px; border-radius: ${DS.r.full}; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; border: none; background: transparent; color: ${DS.c.textMid}; }
    .ga-tab.active { background: ${DS.c.navy}; color: ${DS.c.white}; }
    .ga-tab:hover:not(.active) { background: ${DS.c.beige}; color: ${DS.c.text}; }

    .ga-divider { height: 1px; background: ${DS.c.border}; margin: 0; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
    .fade-in { animation: fadeIn 0.35s ease forwards; }
    .slide-in { animation: slideIn 0.3s ease forwards; }

    .ga-glass { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }

    .ga-sidebar { background: ${DS.c.navy}; min-height: 100vh; }
    .ga-sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: ${DS.r.md}; cursor: pointer; transition: all 0.18s; color: rgba(255,255,255,0.65); font-size: 13.5px; font-weight: 500; border: none; background: transparent; width: 100%; text-align: left; }
    .ga-sidebar-item:hover { background: rgba(201,169,110,0.12); color: ${DS.c.goldLight}; }
    .ga-sidebar-item.active { background: rgba(201,169,110,0.18); color: ${DS.c.gold}; }
    .ga-sidebar-icon { font-size: 16px; width: 20px; text-align: center; }

    .ga-stat-card { border-radius: ${DS.r.lg}; padding: 20px 22px; background: ${DS.c.white}; border: 1px solid ${DS.c.borderLight}; box-shadow: ${DS.s.xs}; }

    .room-img-placeholder { position: relative; overflow: hidden; background: linear-gradient(135deg, ${DS.c.navyLight} 0%, ${DS.c.navyMid} 100%); display: flex; align-items: center; justify-content: center; }
    .room-img-placeholder::after { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A96E' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }

    .modal-overlay { position: fixed; inset: 0; background: rgba(11,22,40,0.55); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-box { background: ${DS.c.white}; border-radius: ${DS.r.xl}; box-shadow: ${DS.s.lg}; max-height: 90vh; overflow-y: auto; animation: fadeIn 0.2s ease; }

    .ga-tooltip { position: relative; }
    .ga-tooltip:hover::after { content: attr(data-tip); position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); background: ${DS.c.navy}; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; white-space: nowrap; pointer-events: none; z-index: 100; }

    /* Scrollable page areas */
    .page-scroll { overflow-y: auto; height: 100vh; }

    /* Public nav */
    .pub-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; transition: all 0.3s; }
    .pub-nav.solid { background: ${DS.c.white}; box-shadow: ${DS.s.sm}; }
    .pub-nav.transparent { background: transparent; }
  `;
  document.head.appendChild(style);
};
injectGlobalStyles();

// ─── ICON SET (inline SVG via text) ──────────────────────────────────────────
const Icon = ({ name, size = 16, color = 'currentColor', style: st }) => {
  const icons = {
    home: 'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z M9 21V12h6v9',
    rooms: 'M3 7h18M3 12h18M3 17h18',
    booking: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
    settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
    checkin: 'M5 12h14M12 5l7 7-7 7',
    checkout: 'M19 12H5M12 19l-7-7 7-7',
    clock: 'M12 6v6l4 2 M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    payment: 'M3 10h18M3 6h18a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1z',
    enquiry: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    dashboard: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z M4 14a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z M14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    menu: 'M4 6h16M4 12h16M4 18h16',
    x: 'M6 18L18 6M6 6l12 12',
    check: 'M5 13l4 4L19 7',
    star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    wifi: 'M1.42 9a16 16 0 0121.16 0 M5 12.55a11 11 0 0114.08 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01',
    pool: 'M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2c1.3 0 1.9-.5 2.5-1 M2 19c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2c1.3 0 1.9-.5 2.5-1 M2 5c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2c1.3 0 1.9-.5 2.5-1',
    bed: 'M2 7v10 M2 12h20 M22 7v10 M5 7h14a2 2 0 012 2v3H3V9a2 2 0 012-2z',
    user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 100-6 3 3 0 000 6z',
    edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5 M17.414 2.586a2 2 0 012.828 2.828L12 14l-4 1 1-4 8.414-8.414z',
    trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    plus: 'M12 5v14M5 12h14',
    chevronDown: 'M19 9l-7 7-7-7',
    chevronRight: 'M9 18l6-6-6-6',
    chevronLeft: 'M15 18l-6-6 6-6',
    filter: 'M3 4h18M7 12h10M11 20h2',
    download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
    mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    map: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    trend: 'M23 6l-9.5 9.5-5-5L1 18',
    lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    concierge: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
    spa: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    restaurant: 'M18 8h1a4 4 0 010 8h-1 M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z M6 1v3 M10 1v3 M14 1v3',
    gym: 'M6.5 6.5h11 M17.5 6.5v11 M6.5 17.5h11 M6.5 6.5v11 M3 3l3.5 3.5 M21 3l-3.5 3.5 M21 21l-3.5-3.5 M3 21l3.5-3.5',
  };
  const d = icons[name] || icons.home;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={st}>
      <path d={d} />
    </svg>
  );
};

// ─── BUTTON ───────────────────────────────────────────────────────────────────
const Button = ({ children, variant = 'primary', size = 'md', onClick, style: st, icon, disabled, fullWidth }) => {
  const variants = {
    primary: { background: `linear-gradient(135deg, ${DS.c.gold} 0%, ${DS.c.goldDark} 100%)`, color: DS.c.navy, boxShadow: DS.s.gold },
    navy: { background: DS.c.navy, color: DS.c.white },
    outline: { background: 'transparent', color: DS.c.navy, border: `1.5px solid ${DS.c.navy}` },
    outlineGold: { background: 'transparent', color: DS.c.gold, border: `1.5px solid ${DS.c.gold}` },
    ghost: { background: 'transparent', color: DS.c.textMid },
    danger: { background: DS.c.danger, color: DS.c.white },
    success: { background: DS.c.success, color: DS.c.white },
  };
  const sizes = {
    xs: { padding: '5px 12px', fontSize: '11px', borderRadius: DS.r.md },
    sm: { padding: '7px 16px', fontSize: '12.5px', borderRadius: DS.r.md },
    md: { padding: '10px 22px', fontSize: '13.5px', borderRadius: DS.r.md },
    lg: { padding: '13px 30px', fontSize: '15px', borderRadius: DS.r.lg },
    xl: { padding: '16px 38px', fontSize: '16px', borderRadius: DS.r.lg },
  };
  return (
    <button
      className="ga-btn"
      disabled={disabled}
      onClick={onClick}
      style={{ ...variants[variant], ...sizes[size], width: fullWidth ? '100%' : 'auto', justifyContent: fullWidth ? 'center' : 'flex-start', ...st }}
    >
      {icon && <Icon name={icon} size={sizes[size].fontSize === '13.5px' ? 15 : 13} color="currentColor" />}
      {children}
    </button>
  );
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ status, text, size = 'sm' }) => {
  const map = {
    confirmed: { bg: DS.c.successBg, color: DS.c.success, dot: DS.c.success },
    pending: { bg: DS.c.warningBg, color: DS.c.warning, dot: DS.c.warning },
    cancelled: { bg: DS.c.dangerBg, color: DS.c.danger, dot: DS.c.danger },
    checkedin: { bg: DS.c.infoBg, color: DS.c.info, dot: DS.c.info },
    checkedout: { bg: DS.c.beige, color: DS.c.textMid, dot: DS.c.textMuted },
    available: { bg: DS.c.successBg, color: DS.c.success, dot: DS.c.success },
    occupied: { bg: DS.c.dangerBg, color: DS.c.danger, dot: DS.c.danger },
    maintenance: { bg: DS.c.warningBg, color: DS.c.warning, dot: DS.c.warning },
    admin: { bg: '#EEE8FF', color: '#6B46C1', dot: '#6B46C1' },
    staff: { bg: DS.c.infoBg, color: DS.c.info, dot: DS.c.info },
    customer: { bg: DS.c.beige, color: DS.c.textMid, dot: DS.c.textMuted },
    paid: { bg: DS.c.successBg, color: DS.c.success, dot: DS.c.success },
    unpaid: { bg: DS.c.dangerBg, color: DS.c.danger, dot: DS.c.danger },
  };
  const s = map[status] || map.pending;
  return (
    <span className="ga-badge" style={{ background: s.bg, color: s.color, fontSize: size === 'xs' ? 10 : 11 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, display: 'inline-block', flexShrink: 0 }} />
      {text || status}
    </span>
  );
};

// ─── INPUT ────────────────────────────────────────────────────────────────────
const Input = ({ label, placeholder, type = 'text', value, onChange, icon: ic, style: st, required }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: DS.c.textMid, textTransform: 'uppercase' }}>{label}{required && <span style={{ color: DS.c.gold, marginLeft: 3 }}>*</span>}</label>}
    <div style={{ position: 'relative' }}>
      {ic && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: DS.c.textMuted, pointerEvents: 'none' }}><Icon name={ic} size={15} /></span>}
      <input className="ga-input" type={type} placeholder={placeholder} value={value} onChange={onChange} style={{ padding: ic ? '10px 14px 10px 38px' : '10px 14px', ...st }} />
    </div>
  </div>
);

// ─── SELECT ───────────────────────────────────────────────────────────────────
const Select = ({ label, options, value, onChange, style: st }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: DS.c.textMid, textTransform: 'uppercase' }}>{label}</label>}
    <select className="ga-input" value={value} onChange={onChange} style={{ padding: '10px 14px', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238B95A1' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', ...st }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, width = 560 }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: `min(${width}px, 95vw)` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid ${DS.c.border}` }}>
          <h3 style={{ fontFamily: DS.f.serif, fontSize: 22, fontWeight: 600, color: DS.c.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: DS.c.textMuted, padding: 4, borderRadius: DS.r.sm }}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: ic, color = DS.c.gold, trend, bg }) => (
  <div className="ga-stat-card" style={{ background: bg || DS.c.white }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: bg ? 'rgba(255,255,255,0.7)' : DS.c.textMuted, marginBottom: 10 }}>{label}</div>
        <div style={{ fontFamily: DS.f.serif, fontSize: 32, fontWeight: 600, color: bg ? DS.c.white : DS.c.text, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: bg ? 'rgba(255,255,255,0.65)' : DS.c.textMuted, marginTop: 6 }}>{sub}</div>}
      </div>
      <div style={{ background: bg ? 'rgba(255,255,255,0.15)' : `${color}18`, borderRadius: DS.r.md, padding: 10 }}>
        <Icon name={ic} size={20} color={bg ? DS.c.white : color} />
      </div>
    </div>
    {trend !== undefined && (
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${bg ? 'rgba(255,255,255,0.15)' : DS.c.borderLight}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: trend >= 0 ? DS.c.success : DS.c.danger, fontWeight: 600 }}>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
        <span style={{ fontSize: 11, color: bg ? 'rgba(255,255,255,0.5)' : DS.c.textMuted }}>vs last month</span>
      </div>
    )}
  </div>
);

// ─── MINI BAR CHART ───────────────────────────────────────────────────────────
const MiniBarChart = ({ data, color = DS.c.gold, height = 120, label }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div>
      {label && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: DS.c.textMuted, marginBottom: 12 }}>{label}</div>}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', background: `${color}20`, borderRadius: '4px 4px 0 0', position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`, borderRadius: '4px 4px 0 0', height: `${(d.value / max) * 100}%`, transition: 'height 0.5s ease' }} />
            </div>
            <div style={{ fontSize: 10, color: DS.c.textMuted, whiteSpace: 'nowrap' }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MINI LINE CHART ──────────────────────────────────────────────────────────
const MiniLineChart = ({ data, color = DS.c.gold, height = 60 }) => {
  const vals = data.map(d => d.value);
  const max = Math.max(...vals), min = Math.min(...vals);
  const range = max - min || 1;
  const w = 300, h = height;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - min) / range) * (h - 10) - 5}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#lg1)" stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
const DonutChart = ({ segments, size = 120, thickness = 22 }) => {
  const r = (size - thickness) / 2, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap = circ - dash;
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={thickness} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} strokeLinecap="butt" />;
        offset += dash;
        return el;
      })}
    </svg>
  );
};

// ─── PUBLIC NAV ───────────────────────────────────────────────────────────────
const PublicNav = ({ page, setPage, transparent = false }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  const solid = !transparent || scrolled;
  const navItems = [
    { label: 'Home', p: 'home' }, { label: 'Rooms', p: 'rooms' },
    { label: 'Contact', p: 'contact' },
  ];
  return (
    <nav className={`pub-nav ${solid ? 'solid' : 'transparent'}`} style={{ padding: '0 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <div onClick={() => setPage('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${DS.c.gold}, ${DS.c.goldDark})`, borderRadius: DS.r.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: DS.c.navy, fontWeight: 700, fontSize: 14, fontFamily: DS.f.serif }}>GA</span>
          </div>
          <div>
            <div style={{ fontFamily: DS.f.serif, fontWeight: 600, fontSize: 17, color: solid ? DS.c.text : DS.c.white, lineHeight: 1 }}>Grand Azure</div>
            <div style={{ fontSize: 9, letterSpacing: '0.18em', color: solid ? DS.c.textMuted : 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Hotel & Resort</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {navItems.map(n => (
            <button key={n.p} onClick={() => setPage(n.p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: DS.r.md, fontSize: 13.5, fontWeight: page === n.p ? 600 : 400, color: solid ? (page === n.p ? DS.c.gold : DS.c.textMid) : (page === n.p ? DS.c.gold : 'rgba(255,255,255,0.85)'), fontFamily: DS.f.sans, transition: 'color 0.2s' }}>
              {n.label}
            </button>
          ))}
          <div style={{ width: 1, height: 20, background: solid ? DS.c.border : 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
          <Button variant="ghost" size="sm" onClick={() => setPage('auth')} style={{ color: solid ? DS.c.textMid : 'rgba(255,255,255,0.85)' }}>Sign In</Button>
          <Button variant="primary" size="sm" onClick={() => setPage('booking')}>Book Now</Button>
        </div>
      </div>
    </nav>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({ setPage }) => (
  <footer style={{ background: DS.c.navy, color: 'rgba(255,255,255,0.7)', padding: '64px 40px 32px' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48, marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: DS.f.serif, fontSize: 24, color: DS.c.white, marginBottom: 12 }}>Grand Azure Hotel</div>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', maxWidth: 280, marginBottom: 20 }}>
            Where luxury meets comfort. Experience world-class hospitality in the heart of Sydney, Australia.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['★★★★★'].map((s, i) => <span key={i} style={{ color: DS.c.gold, fontSize: 13 }}>{s}</span>)}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: DS.c.gold, marginBottom: 16 }}>Navigation</div>
          {['Home', 'Rooms', 'Amenities', 'Contact', 'Book Now'].map(l => <div key={l} style={{ marginBottom: 10, cursor: 'pointer', fontSize: 13, transition: 'color 0.2s' }} onClick={() => setPage(l.toLowerCase().replace(' ', ''))}>{l}</div>)}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: DS.c.gold, marginBottom: 16 }}>Services</div>
          {['Fine Dining', 'Spa & Wellness', 'Business Centre', 'Concierge', 'Airport Transfer'].map(s => <div key={s} style={{ marginBottom: 10, fontSize: 13 }}>{s}</div>)}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: DS.c.gold, marginBottom: 16 }}>Contact</div>
          {[
            { ic: 'map', t: '1 Circular Quay, Sydney NSW 2000, Australia' },
            { ic: 'phone', t: '+61 2 9250 7654' },
            { ic: 'mail', t: 'reservations@grandazure.com.au' },
          ].map(c => (
            <div key={c.t} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 13, alignItems: 'flex-start' }}>
              <Icon name={c.ic} size={14} color={DS.c.gold} style={{ flexShrink: 0, marginTop: 2 }} />
              {c.t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
        <span>© 2026 Grand Azure Hotel. All rights reserved.</span>
        <span style={{ color: DS.c.gold }}>Crafted with elegance for extraordinary guests</span>
      </div>
    </div>
  </footer>
);

// ─── ADMIN SIDEBAR ────────────────────────────────────────────────────────────
const AdminSidebar = ({ page, setPage, collapsed, setCollapsed }) => {
  const groups = [
    { label: 'Overview', items: [{ p: 'admin', label: 'Dashboard', icon: 'dashboard' }] },
    { label: 'Operations', items: [
      { p: 'bookingmgmt', label: 'Bookings', icon: 'booking' },
      { p: 'checkinout', label: 'Check-In / Out', icon: 'checkin' },
      { p: 'roommgmt', label: 'Room Management', icon: 'rooms' },
    ]},
    { label: 'People', items: [
      { p: 'staffmgmt', label: 'Staff Management', icon: 'users' },
      { p: 'usermgmt', label: 'Users', icon: 'users' },
      { p: 'enquiry', label: 'Enquiries', icon: 'enquiry' },
    ]},
    { label: 'Finance', items: [{ p: 'payment', label: 'Payments & Invoices', icon: 'payment' }] },
    { label: 'Public', items: [
      { p: 'home', label: 'View Website', icon: 'eye' },
    ]},
  ];
  return (
    <div className="ga-sidebar" style={{ width: collapsed ? 64 : 230, transition: 'width 0.25s ease', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: collapsed ? '20px 12px' : '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
        <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${DS.c.gold}, ${DS.c.goldDark})`, borderRadius: DS.r.sm, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: DS.f.serif, fontWeight: 700, fontSize: 13, color: DS.c.navy }}>GA</span>
        </div>
        {!collapsed && <div>
          <div style={{ fontFamily: DS.f.serif, color: DS.c.white, fontSize: 14, fontWeight: 600, lineHeight: 1 }}>Grand Azure</div>
          <div style={{ fontSize: 9, color: DS.c.gold, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Admin Portal</div>
        </div>}
      </div>
      <div style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px', overflowY: 'auto' }}>
        {groups.map(g => (
          <div key={g.label} style={{ marginBottom: 20 }}>
            {!collapsed && <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', padding: '0 8px', marginBottom: 4 }}>{g.label}</div>}
            {g.items.map(item => (
              <button key={item.p} className={`ga-sidebar-item ${page === item.p ? 'active' : ''}`} onClick={() => setPage(item.p)} title={collapsed ? item.label : ''} style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '10px 12px' }}>
                <span className="ga-sidebar-icon"><Icon name={item.icon} size={17} color="currentColor" /></span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: DS.r.md }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${DS.c.gold}40, ${DS.c.gold}20)`, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: DS.c.gold }}>A</div>
          {!collapsed && <div>
            <div style={{ color: DS.c.white, fontSize: 12.5, fontWeight: 500 }}>Admin User</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>General Manager</div>
          </div>}
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN TOPBAR ─────────────────────────────────────────────────────────────
const AdminTopBar = ({ title, subtitle }) => (
  <div style={{ background: DS.c.white, borderBottom: `1px solid ${DS.c.border}`, padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
    <div>
      <div style={{ fontFamily: DS.f.serif, fontSize: 20, fontWeight: 600, color: DS.c.text, lineHeight: 1 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: DS.c.textMuted, marginTop: 2 }}>{subtitle}</div>}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative' }}>
        <input className="ga-input" placeholder="Search..." style={{ padding: '7px 14px 7px 34px', width: 200, fontSize: 13 }} />
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: DS.c.textMuted }}><Icon name="search" size={14} /></span>
      </div>
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <Icon name="bell" size={20} color={DS.c.textMid} />
        <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, background: DS.c.danger, borderRadius: '50%', border: `2px solid ${DS.c.white}` }} />
      </div>
      <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${DS.c.gold}, ${DS.c.goldDark})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <span style={{ fontFamily: DS.f.serif, fontWeight: 600, fontSize: 14, color: DS.c.navy }}>A</span>
      </div>
    </div>
  </div>
);

// ─── SECTION HEADING ─────────────────────────────────────────────────────────
const SectionHeading = ({ eyebrow, title, subtitle, center = false, light = false }) => (
  <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 48 }}>
    {eyebrow && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: DS.c.gold, marginBottom: 10 }}>{eyebrow}</div>}
    <h2 style={{ fontFamily: DS.f.serif, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: light ? DS.c.white : DS.c.text, lineHeight: 1.15, marginBottom: subtitle ? 14 : 0 }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 16, color: light ? 'rgba(255,255,255,0.7)' : DS.c.textMid, lineHeight: 1.7, maxWidth: center ? 560 : 'none', margin: center ? '0 auto' : '0' }}>{subtitle}</p>}
  </div>
);

// ─── ROOM IMAGE PLACEHOLDER ───────────────────────────────────────────────────
const ROOM_IMAGES = {
  'Deluxe Room':        (window.__resources && window.__resources.imgDeluxe)       || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=500&fit=crop&q=80&auto=format',
  'Superior Suite':     (window.__resources && window.__resources.imgSuperior)     || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop&q=80&auto=format',
  'Presidential Suite': (window.__resources && window.__resources.imgPresidential) || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop&q=80&auto=format',
  'Garden View':        (window.__resources && window.__resources.imgGarden)       || 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=500&fit=crop&q=80&auto=format',
  'Sea View':           (window.__resources && window.__resources.imgSeaView)      || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop&q=80&auto=format',
  'Standard Room':      (window.__resources && window.__resources.imgStandard)     || 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&h=500&fit=crop&q=80&auto=format',
};

const RoomImgPlaceholder = ({ type, height = 220, width = '100%' }) => {
  const src = ROOM_IMAGES[type] || ROOM_IMAGES['Deluxe Room'];
  return (
    <div style={{ height, width, overflow: 'hidden', background: DS.c.navyLight, position: 'relative' }}>
      <img
        src={src}
        alt={type}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onError={e => { e.currentTarget.style.display='none'; }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,22,40,0.45) 0%, transparent 50%)', pointerEvents: 'none' }} />
    </div>
  );
};

// Export all shared components to window
Object.assign(window, {
  DS, Icon, Button, Badge, Input, Select, Modal,
  StatCard, MiniBarChart, MiniLineChart, DonutChart,
  PublicNav, Footer, AdminSidebar, AdminTopBar,
  SectionHeading, RoomImgPlaceholder,
});
