
// ─── MAIN APP — ROUTER + TWEAKS ───────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#C9A96E",
  "fontStyle": "serif",
  "navTransparent": true,
  "darkSidebar": true
}/*EDITMODE-END*/;

const App = () => {
  const [page, setPage] = React.useState(() => {
    try { return localStorage.getItem('ga_page') || 'home'; } catch(e) { return 'home'; }
  });
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [tweaksVisible, setTweaksVisible] = React.useState(false);

  React.useEffect(() => {
    try { localStorage.setItem('ga_page', page); } catch(e) {}
    window.scrollTo(0, 0);
  }, [page]);

  // Tweaks panel communication
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const updateTweak = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  };

  // Public pages with nav
  const publicPages = ['home', 'rooms', 'roomdetail', 'booking', 'contact'];
  const isPublic = publicPages.includes(page);
  const isAuth = page === 'auth';
  const isCustomerDash = page === 'customerdash';
  const isAdmin = ['admin', 'bookingmgmt', 'roommgmt', 'staffmgmt', 'checkinout', 'usermgmt', 'payment', 'enquiry'].includes(page);

  const renderPage = () => {
    switch(page) {
      case 'home':       return <HomePage setPage={setPage} />;
      case 'rooms':      return <RoomsPage setPage={setPage} />;
      case 'roomdetail': return <RoomDetailPage setPage={setPage} />;
      case 'booking':    return <BookingPage setPage={setPage} />;
      case 'contact':    return <ContactPage setPage={setPage} />;
      case 'auth':       return <AuthPage setPage={setPage} />;
      case 'customerdash': return <CustomerDashboard setPage={setPage} />;
      case 'admin':      return <AdminDashboard setPage={setPage} />;
      case 'bookingmgmt': return <BookingManagement setPage={setPage} />;
      case 'roommgmt':   return <RoomManagement setPage={setPage} />;
      case 'staffmgmt':  return <StaffManagement setPage={setPage} />;
      case 'checkinout': return <CheckInOut setPage={setPage} />;
      case 'usermgmt':   return <UserManagement setPage={setPage} />;
      case 'payment':    return <PaymentPage setPage={setPage} />;
      case 'enquiry':    return <EnquiryManagement setPage={setPage} />;
      default:           return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {isPublic && <PublicNav page={page} setPage={setPage} transparent={page === 'home'} />}
      <div className={isAdmin || isCustomerDash ? '' : isPublic ? 'page-scroll' : ''} style={isAdmin || isCustomerDash ? {} : { overflowX: 'hidden' }}>
        {renderPage()}
      </div>

      {/* Nav Menu Bar at bottom — quick page switcher for demo */}
      <div style={{
        position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        background: DS.c.navy, borderRadius: DS.r.full, boxShadow: DS.s.lg,
        padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 4, zIndex: 9999,
        border: `1px solid rgba(201,169,110,0.2)`,
      }}>
        <span style={{ fontSize: 10, letterSpacing: '0.1em', color: DS.c.gold, paddingRight: 8, textTransform: 'uppercase', borderRight: `1px solid rgba(255,255,255,0.1)`, marginRight: 4 }}>Demo Nav</span>
        {[
          ['home','🏨','Home'],['rooms','🛏','Rooms'],['roomdetail','🔍','Detail'],
          ['booking','📋','Book'],['contact','✉️','Contact'],['auth','🔐','Auth'],
          ['customerdash','👤','My Stay'],['admin','📊','Admin'],['bookingmgmt','📁','Bookings'],
          ['roommgmt','🏠','Rooms Mgmt'],['staffmgmt','🧑‍💼','Staff'],['checkinout','🔑','Check-In'],['usermgmt','👥','Users'],
          ['payment','💳','Payments'],
        ].map(([p, emoji, label]) => (
          <button key={p} onClick={() => setPage(p)} title={label} style={{
            background: page === p ? DS.c.gold : 'transparent', border: 'none', cursor: 'pointer',
            width: 28, height: 28, borderRadius: '50%', fontSize: 13, display: 'flex', alignItems: 'center',
            justifyContent: 'center', transition: 'background 0.15s', flexShrink: 0,
          }}>{emoji}</button>
        ))}
      </div>

      {/* Tweaks Panel */}
      {tweaksVisible && (
        <div style={{
          position: 'fixed', bottom: 60, right: 20, background: DS.c.white,
          borderRadius: DS.r.xl, boxShadow: DS.s.lg, padding: '22px',
          width: 280, zIndex: 10000, border: `1px solid ${DS.c.borderLight}`,
        }}>
          <div style={{ fontFamily: DS.f.serif, fontSize: 18, fontWeight: 600, marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${DS.c.border}` }}>Tweaks</div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: DS.c.textMuted, display: 'block', marginBottom: 8 }}>Accent Color</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['#C9A96E','Classic Gold'],['#8B6E3C','Deep Bronze'],['#5B8C5A','Forest'],['#4A7B9D','Azure'],['#8B4A6B','Rose Gold']].map(([c, l]) => (
                <div key={c} title={l} onClick={() => updateTweak('accentColor', c)} style={{ width: 28, height: 28, background: c, borderRadius: '50%', cursor: 'pointer', border: tweaks.accentColor === c ? `3px solid ${DS.c.navy}` : '3px solid transparent', transition: 'border 0.15s' }} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: DS.c.textMuted, display: 'block', marginBottom: 8 }}>View Demo Page</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[['home','🏨 Home'],['rooms','🛏 Rooms'],['booking','📋 Booking'],['admin','📊 Admin'],['customerdash','👤 Dashboard'],['payment','💳 Payments']].map(([p, l]) => (
                <button key={p} onClick={() => setPage(p)} style={{ padding: '7px 10px', background: page === p ? DS.c.navy : DS.c.beigeLight, color: page === p ? DS.c.white : DS.c.textMid, border: 'none', borderRadius: DS.r.md, cursor: 'pointer', fontSize: 12, fontFamily: DS.f.sans, transition: 'all 0.15s' }}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: DS.c.textMuted, display: 'block', marginBottom: 8 }}>Transparent Hero Nav</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['true','Yes'],['false','No']].map(([v, l]) => (
                <button key={v} onClick={() => updateTweak('navTransparent', v === 'true')} style={{ flex: 1, padding: '7px', background: String(tweaks.navTransparent) === v ? DS.c.navy : DS.c.beigeLight, color: String(tweaks.navTransparent) === v ? DS.c.white : DS.c.textMid, border: 'none', borderRadius: DS.r.md, cursor: 'pointer', fontSize: 12, fontFamily: DS.f.sans }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mount app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
