
// ─── DASHBOARD PAGES: Customer, Admin, Booking Mgmt, Room Mgmt, CheckIn/Out, Users, Payments ───

// ─── CUSTOMER DASHBOARD ───────────────────────────────────────────────────────
const CustomerDashboard = ({ setPage }) => {
  const [tab, setTab] = React.useState('upcoming');

  const bookings = BOOKINGS_SAMPLE.slice(0, 4);

  return (
    <div style={{ minHeight: '100vh', background: DS.c.ivory }}>
      {/* Header */}
      <div style={{ background: DS.c.navy, padding: '28px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => setPage('home')}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${DS.c.gold}, ${DS.c.goldDark})`, borderRadius: DS.r.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: DS.f.serif, fontWeight: 700, fontSize: 14, color: DS.c.navy }}>GA</span>
            </div>
            <span style={{ fontFamily: DS.f.serif, color: DS.c.white, fontSize: 17, fontWeight: 600 }}>Grand Azure</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Button variant="outlineGold" size="sm" onClick={() => setPage('booking')}>New Booking</Button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${DS.c.gold}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontFamily: DS.f.serif, fontWeight: 600, color: DS.c.gold }}>R</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 40px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: DS.f.serif, fontSize: 34, fontWeight: 600 }}>Welcome back, <span style={{ color: DS.c.gold }}>Liam</span></h1>
          <p style={{ fontSize: 14, color: DS.c.textMuted, marginTop: 4 }}>Member since January 2025 · Gold Loyalty Member</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 32 }}>
          <StatCard label="Upcoming Stays" value="1" sub="Next: Apr 25" icon="booking" trend={0} />
          <StatCard label="Total Bookings" value="12" sub="All time" icon="checkin" trend={25} />
          <StatCard label="Loyalty Points" value="2,450" sub="Gold Member" icon="star" color={DS.c.gold} />
          <StatCard label="Total Spent" value="A$12,400" sub="This year" icon="payment" trend={12} />
        </div>

        {/* Current booking banner */}
        <div style={{ background: `linear-gradient(135deg, ${DS.c.navy} 0%, ${DS.c.navyMid} 100%)`, borderRadius: DS.r.xl, padding: '24px 28px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: DS.c.gold, marginBottom: 6 }}>Upcoming Reservation</div>
            <div style={{ fontFamily: DS.f.serif, fontSize: 22, color: DS.c.white, fontWeight: 600, marginBottom: 4 }}>Superior Suite · Apr 25 – 28</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Booking ID: GA-2026-0841 · 3 Nights · A$2,346</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Badge status="confirmed" text="Confirmed" />
            <Button variant="primary" size="sm">View Details</Button>
          </div>
        </div>

        {/* Bookings table */}
        <div className="ga-card" style={{ overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '18px 22px', borderBottom: `1px solid ${DS.c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: DS.f.serif, fontSize: 20, fontWeight: 600 }}>My Bookings</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              {['upcoming', 'history', 'cancelled'].map(t => (
                <button key={t} className={`ga-tab ${tab === t ? 'active' : ''}`} style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <table className="ga-table">
            <thead><tr><th>Booking ID</th><th>Room</th><th>Check-In</th><th>Check-Out</th><th>Nights</th><th>Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600, color: DS.c.navy, fontFamily: DS.f.serif }}>{b.id}</td>
                  <td>{b.room}</td>
                  <td>{b.checkIn}</td>
                  <td>{b.checkOut}</td>
                  <td style={{ textAlign: 'center' }}>{b.nights}</td>
                  <td style={{ fontWeight: 600 }}>A${b.total.toLocaleString()}</td>
                  <td><Badge status={b.status} text={b.status} /></td>
                  <td><Button variant="ghost" size="xs" icon="eye">View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick actions + Profile side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          <div className="ga-card" style={{ padding: '22px' }}>
            <h3 style={{ fontFamily: DS.f.serif, fontSize: 18, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['booking', 'Make a New Booking', 'booking'], ['enquiry', 'Submit an Enquiry', 'contact'], ['payment', 'View Payment History', 'payment'], ['user', 'Edit Profile', 'customerdash']].map(([ic, l, p]) => (
                <button key={l} onClick={() => setPage(p)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: DS.c.beigeLight, border: 'none', borderRadius: DS.r.md, cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', fontSize: 14, color: DS.c.text, fontFamily: DS.f.sans }}
                  onMouseEnter={e => e.currentTarget.style.background = `${DS.c.gold}15`}
                  onMouseLeave={e => e.currentTarget.style.background = DS.c.beigeLight}
                >
                  <Icon name={ic} size={16} color={DS.c.gold} />
                  {l}
                  <Icon name="chevronRight" size={13} color={DS.c.textMuted} style={{ marginLeft: 'auto' }} />
                </button>
              ))}
            </div>
          </div>
          <div className="ga-card" style={{ padding: '22px' }}>
            <h3 style={{ fontFamily: DS.f.serif, fontSize: 18, marginBottom: 16 }}>Profile</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${DS.c.gold}, ${DS.c.goldDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DS.f.serif, fontSize: 22, fontWeight: 600, color: DS.c.navy }}>R</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Liam Anderson</div>
                <div style={{ fontSize: 12, color: DS.c.textMuted }}>liam@example.com.au</div>
                <Badge status="confirmed" text="Gold Member" />
              </div>
            </div>
            {[['Phone', '+61 412 345 678'], ['Nationality', 'Australian'], ['Member Since', 'January 2025'], ['Loyalty Points', '2,450 pts']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${DS.c.borderLight}`, fontSize: 13 }}>
                <span style={{ color: DS.c.textMuted }}>{l}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN LAYOUT WRAPPER ─────────────────────────────────────────────────────
const AdminLayout = ({ page, setPage, title, subtitle, children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AdminSidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminTopBar title={title} subtitle={subtitle} />
        <div style={{ flex: 1, overflowY: 'auto', background: DS.c.ivory }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const AdminDashboard = ({ setPage }) => {
  const bookingData = [
    { label: 'Jan', value: 38 }, { label: 'Feb', value: 52 }, { label: 'Mar', value: 61 },
    { label: 'Apr', value: 74 }, { label: 'May', value: 68 }, { label: 'Jun', value: 83 },
    { label: 'Jul', value: 91 }, { label: 'Aug', value: 87 },
  ];
  const revenueData = [
    { label: 'W1', value: 145 }, { label: 'W2', value: 189 }, { label: 'W3', value: 162 },
    { label: 'W4', value: 210 }, { label: 'W5', value: 195 }, { label: 'W6', value: 234 },
    { label: 'W7', value: 218 }, { label: 'W8', value: 251 },
  ];

  return (
    <AdminLayout page="admin" setPage={setPage} title="Dashboard" subtitle="Sunday, 20 April 2026">
      <div style={{ padding: '28px' }}>
        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Bookings" value="847" sub="This month" icon="booking" trend={12} />
          <StatCard label="Occupied Rooms" value="103" sub="of 148 total" icon="bed" trend={8} color={DS.c.info} />
          <StatCard label="Available Rooms" value="38" sub="Ready for check-in" icon="checkin" color={DS.c.success} />
          <StatCard label="Monthly Revenue" value="A$4.2M" sub="April 2026" icon="payment" trend={18} color={DS.c.gold} bg={DS.c.navy} />
          <StatCard label="Pending Enquiries" value="14" sub="Awaiting response" icon="enquiry" trend={-3} color={DS.c.warning} />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 18, marginBottom: 24 }}>
          <div className="ga-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 18 }}>Booking Trends</h3>
              <Badge status="confirmed" text="+12% MoM" />
            </div>
            <MiniBarChart data={bookingData} height={130} />
          </div>
          <div className="ga-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 18 }}>Revenue (Weekly)</h3>
              <span style={{ fontSize: 11, color: DS.c.textMuted }}>A$ Thousands</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <span style={{ fontFamily: DS.f.serif, fontSize: 28, fontWeight: 600, color: DS.c.gold }}>A$251K</span>
              <span style={{ fontSize: 11, color: DS.c.success }}>↑ 18% this week</span>
            </div>
            <MiniLineChart data={revenueData} height={80} />
          </div>
          <div className="ga-card" style={{ padding: '22px' }}>
            <h3 style={{ fontFamily: DS.f.serif, fontSize: 18, marginBottom: 14 }}>Room Types</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <DonutChart size={110} thickness={18} segments={[
                { value: 45, color: DS.c.gold }, { value: 28, color: DS.c.navy },
                { value: 15, color: DS.c.goldLight }, { value: 12, color: DS.c.textMuted },
              ]} />
            </div>
            {[['Deluxe Room', 45, DS.c.gold], ['Superior Suite', 28, DS.c.navy], ['Sea View', 15, DS.c.goldLight], ['Other', 12, DS.c.textMuted]].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}</div>
                <span style={{ fontWeight: 600 }}>{v}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings + Room Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18 }}>
          <div className="ga-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${DS.c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 18 }}>Recent Bookings</h3>
              <Button variant="ghost" size="xs" icon="chevronRight" onClick={() => setPage('bookingmgmt')}>View All</Button>
            </div>
            <table className="ga-table">
              <thead><tr><th>ID</th><th>Guest</th><th>Room</th><th>Check-In</th><th>Status</th><th>Amount</th></tr></thead>
              <tbody>
                {BOOKINGS_SAMPLE.map(b => (
                  <tr key={b.id} style={{ cursor: 'pointer' }}>
                    <td style={{ fontFamily: DS.f.serif, fontWeight: 600, fontSize: 12, color: DS.c.gold }}>{b.id.split('-').pop()}</td>
                    <td style={{ fontWeight: 500 }}>{b.guest}</td>
                    <td style={{ fontSize: 13 }}>{b.room}</td>
                    <td style={{ fontSize: 13 }}>{b.checkIn}</td>
                    <td><Badge status={b.status} text={b.status} /></td>
                    <td style={{ fontWeight: 600 }}>A${b.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ga-card" style={{ padding: '20px' }}>
            <h3 style={{ fontFamily: DS.f.serif, fontSize: 18, marginBottom: 16 }}>Room Status</h3>
            {[['Occupied', 103, DS.c.danger], ['Available', 38, DS.c.success], ['Maintenance', 4, DS.c.warning], ['Reserved', 3, DS.c.info]].map(([l, v, c]) => (
              <div key={l} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: DS.c.textMid }}>{l}</span>
                  <span style={{ fontWeight: 600, color: DS.c.text }}>{v}</span>
                </div>
                <div style={{ height: 6, background: `${c}20`, borderRadius: DS.r.full }}>
                  <div style={{ height: '100%', width: `${(v / 148) * 100}%`, background: c, borderRadius: DS.r.full }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 18, padding: '12px', background: DS.c.beigeLight, borderRadius: DS.r.md, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: DS.c.textMuted }}>Occupancy Rate</span>
              <span style={{ fontFamily: DS.f.serif, fontSize: 20, fontWeight: 600, color: DS.c.gold }}>69.6%</span>
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['checkin', 'Process Check-Ins (5)', 'checkinout'], ['checkout', 'Process Check-Outs (3)', 'checkinout']].map(([ic, l, p]) => (
                <button key={l} onClick={() => setPage(p)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: DS.c.navy, border: 'none', borderRadius: DS.r.md, cursor: 'pointer', color: DS.c.goldLight, fontSize: 12, fontFamily: DS.f.sans, fontWeight: 500, transition: 'opacity 0.2s' }}>
                  <Icon name={ic} size={14} color={DS.c.gold} />{l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// ─── BOOKING MANAGEMENT ───────────────────────────────────────────────────────
const BookingManagement = ({ setPage }) => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [selected, setSelected] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const filtered = BOOKINGS_SAMPLE.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search && !b.guest.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout page="bookingmgmt" setPage={setPage} title="Booking Management" subtitle="Manage all hotel reservations">
      <div style={{ padding: '24px 28px' }}>
        {/* Filters */}
        <div className="ga-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['all', 'confirmed', 'checkedin', 'checkedout', 'pending', 'cancelled'].map(f => (
              <button key={f} className={`ga-tab ${filter === f ? 'active' : ''}`} style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <input className="ga-input" placeholder="Search bookings…" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 14px 8px 34px', width: 220, fontSize: 13 }} />
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: DS.c.textMuted }}><Icon name="search" size={14} /></span>
            </div>
            <Button variant="primary" size="sm" icon="plus" onClick={() => { setSelected(null); setShowModal(true); }}>New Booking</Button>
          </div>
        </div>

        <div className="ga-card" style={{ overflow: 'hidden' }}>
          <table className="ga-table">
            <thead>
              <tr><th>Booking ID</th><th>Guest</th><th>Room</th><th>Check-In</th><th>Check-Out</th><th>Nights</th><th>Amount</th><th>Payment</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => { setSelected(b); setShowModal(true); }}>
                  <td style={{ fontFamily: DS.f.serif, fontWeight: 600, color: DS.c.navy }}>{b.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${DS.c.gold}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: DS.c.goldDark }}>{b.guest[0]}</div>
                      <span style={{ fontWeight: 500 }}>{b.guest}</span>
                    </div>
                  </td>
                  <td>{b.room}</td>
                  <td>{b.checkIn}</td>
                  <td>{b.checkOut}</td>
                  <td style={{ textAlign: 'center' }}>{b.nights}</td>
                  <td style={{ fontWeight: 600 }}>A${b.total.toLocaleString()}</td>
                  <td><Badge status={b.paid ? 'paid' : 'unpaid'} text={b.paid ? 'Paid' : 'Unpaid'} /></td>
                  <td><Badge status={b.status} text={b.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: DS.c.info, padding: 4 }} title="Edit"><Icon name="edit" size={14} /></button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: DS.c.danger, padding: 4 }} title="Cancel"><Icon name="trash" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: DS.c.textMuted, fontSize: 14 }}>No bookings found matching your search.</div>}
        </div>
      </div>

      {/* Booking Detail Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={selected ? `Booking ${selected.id}` : 'New Booking'} width={580}>
        {selected ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {[['Guest Name', selected.guest], ['Room', selected.room], ['Check-In', selected.checkIn], ['Check-Out', selected.checkOut], ['Nights', selected.nights], ['Total Amount', `A${selected.total.toLocaleString()}`]].map(([l, v]) => (
                <div key={l} style={{ padding: '12px 14px', background: DS.c.beigeLight, borderRadius: DS.r.md }}>
                  <div style={{ fontSize: 11, color: DS.c.textMuted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <Badge status={selected.status} text={selected.status} />
              <Badge status={selected.paid ? 'paid' : 'unpaid'} text={selected.paid ? 'Paid' : 'Unpaid'} />
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="primary" size="sm" icon="edit">Update Status</Button>
              <Button variant="success" size="sm" icon="checkin" onClick={() => setPage('checkinout')}>Check In</Button>
              <Button variant="outline" size="sm" icon="download">Invoice</Button>
              <Button variant="danger" size="sm" icon="trash">Cancel</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="Guest Name" placeholder="Full name" required />
              <Input label="Phone" placeholder="+61 4XX XXX XXX" required />
            </div>
            <Select label="Room" options={ROOMS.map(r => ({ value: r.id, label: `${r.type} (Floor ${r.floor})` }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="Check-In" type="date" required />
              <Input label="Check-Out" type="date" required />
            </div>
            <Select label="Number of Guests" options={[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'}]} />
            <Button variant="primary" size="md" fullWidth icon="plus">Create Booking</Button>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

// ─── ROOM MANAGEMENT ──────────────────────────────────────────────────────────
const RoomManagement = ({ setPage }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [editRoom, setEditRoom] = React.useState(null);
  const [view, setView] = React.useState('grid');

  return (
    <AdminLayout page="roommgmt" setPage={setPage} title="Room Management" subtitle="Manage rooms, availability and pricing">
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['grid', 'table'].map(v => (
              <button key={v} className={`ga-tab ${view === v ? 'active' : ''}`} style={{ fontSize: 12 }} onClick={() => setView(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)} View
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm" icon="plus" onClick={() => { setEditRoom(null); setShowModal(true); }}>Add New Room</Button>
        </div>

        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {ROOMS.map(room => (
              <div key={room.id} className="ga-card" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <RoomImgPlaceholder type={room.type} height={150} />
                  <div style={{ position: 'absolute', top: 10, right: 10 }}><Badge status={room.status} text={room.status} /></div>
                  <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(11,22,40,0.7)', borderRadius: DS.r.sm, padding: '3px 8px' }}>
                    <span style={{ fontFamily: DS.f.serif, color: DS.c.gold, fontSize: 15, fontWeight: 600 }}>A${room.price.toLocaleString()}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>/night</span>
                  </div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontFamily: DS.f.serif, fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{room.type}</div>
                  <div style={{ fontSize: 12, color: DS.c.textMuted, marginBottom: 10 }}>{room.size} · Floor {room.floor} · {room.beds} · {room.view}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="outline" size="xs" icon="edit" onClick={() => { setEditRoom(room); setShowModal(true); }}>Edit</Button>
                    <Button variant="ghost" size="xs" icon="eye">Preview</Button>
                    <Button variant="ghost" size="xs" style={{ color: DS.c.danger, marginLeft: 'auto' }} icon="trash">Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ga-card" style={{ overflow: 'hidden' }}>
            <table className="ga-table">
              <thead><tr><th>Room</th><th>Type</th><th>Floor</th><th>Capacity</th><th>Size</th><th>Price/Night</th><th>Status</th><th>Rating</th><th>Actions</th></tr></thead>
              <tbody>
                {ROOMS.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>#{r.id.toString().padStart(3,'0')}</td>
                    <td>{r.type}</td>
                    <td>Floor {r.floor}</td>
                    <td>{r.capacity} guests</td>
                    <td>{r.size}</td>
                    <td style={{ fontWeight: 600, color: DS.c.gold }}>A${r.price.toLocaleString()}</td>
                    <td><Badge status={r.status} text={r.status} /></td>
                    <td><span style={{ color: DS.c.gold }}>★</span> {r.rating}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: DS.c.info }} onClick={() => { setEditRoom(r); setShowModal(true); }}><Icon name="edit" size={14} /></button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: DS.c.danger }}><Icon name="trash" size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editRoom ? `Edit — ${editRoom.type}` : 'Add New Room'} width={600}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Select label="Room Type" options={[{value:'deluxe',label:'Deluxe Room'},{value:'superior',label:'Superior Suite'},{value:'presidential',label:'Presidential Suite'},{value:'garden',label:'Garden View'},{value:'sea',label:'Sea View'},{value:'standard',label:'Standard Room'}]} />
            <Input label="Room Number" placeholder="e.g. 501" defaultValue={editRoom ? `${editRoom.floor}0${editRoom.id}` : ''} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <Input label="Floor" placeholder="Floor number" defaultValue={editRoom?.floor} />
            <Input label="Size (sqm)" placeholder="e.g. 38" defaultValue={editRoom?.size?.replace(' sqm','')} />
            <Select label="Capacity" options={[{value:'1',label:'1 Guest'},{value:'2',label:'2 Guests'},{value:'3',label:'3 Guests'},{value:'4',label:'4 Guests'}]} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Input label="Price per Night (A$)" placeholder="e.g. 380" defaultValue={editRoom?.price} />
            <Select label="View Type" options={[{value:'city',label:'City View'},{value:'pool',label:'Pool View'},{value:'garden',label:'Garden View'},{value:'sea',label:'Sea View'},{value:'panoramic',label:'Panoramic'}]} />
          </div>
          <Select label="Status" options={[{value:'available',label:'Available'},{value:'occupied',label:'Occupied'},{value:'maintenance',label:'Under Maintenance'}]} />
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: DS.c.textMid, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea className="ga-input" style={{ padding: '10px 14px', minHeight: 72, resize: 'vertical' }} placeholder="Room description for guests…" />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="primary" size="md" icon={editRoom ? 'check' : 'plus'} fullWidth>{editRoom ? 'Save Changes' : 'Add Room'}</Button>
            <Button variant="outline" size="md" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

// ─── CHECK-IN / CHECK-OUT ─────────────────────────────────────────────────────
const CheckInOut = ({ setPage }) => {
  const [lookup, setLookup] = React.useState('');
  const [found, setFound] = React.useState(null);
  const [tab, setTab] = React.useState('checkin');

  const doSearch = () => {
    const b = BOOKINGS_SAMPLE.find(b => b.id.includes(lookup.toUpperCase()) || b.guest.toLowerCase().includes(lookup.toLowerCase()));
    setFound(b || 'notfound');
  };

  const todayCheckIns = BOOKINGS_SAMPLE.filter(b => b.status === 'confirmed').slice(0, 3);
  const todayCheckOuts = BOOKINGS_SAMPLE.filter(b => b.status === 'checkedin').slice(0, 2);

  return (
    <AdminLayout page="checkinout" setPage={setPage} title="Check-In / Check-Out" subtitle="Process guest arrivals and departures">
      <div style={{ padding: '24px 28px' }}>
        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Expected Arrivals" value="8" sub="Today" icon="checkin" color={DS.c.success} />
          <StatCard label="Expected Departures" value="5" sub="Today" icon="checkout" color={DS.c.warning} />
          <StatCard label="Currently Checked In" value="103" sub="Active stays" icon="users" />
          <StatCard label="Rooms Ready" value="38" sub="Housekeeping done" icon="rooms" color={DS.c.gold} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          {/* Left: Lookup + Lists */}
          <div>
            {/* Search */}
            <div className="ga-card" style={{ padding: '22px', marginBottom: 18 }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 20, marginBottom: 14 }}>Guest Lookup</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input className="ga-input" placeholder="Enter Booking ID or Guest Name…" value={lookup} onChange={e => setLookup(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} style={{ padding: '11px 14px 11px 36px', fontSize: 14 }} />
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: DS.c.textMuted }}><Icon name="search" size={15} /></span>
                </div>
                <Button variant="primary" size="md" onClick={doSearch}>Search</Button>
              </div>

              {found && found !== 'notfound' && (
                <div style={{ marginTop: 18, padding: '18px', background: DS.c.beigeLight, borderRadius: DS.r.lg, border: `1px solid ${DS.c.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontFamily: DS.f.serif, fontSize: 18, fontWeight: 600 }}>{found.guest}</div>
                      <div style={{ fontSize: 12, color: DS.c.textMuted }}>{found.id} · {found.room}</div>
                    </div>
                    <Badge status={found.status} text={found.status} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[['Check-In', found.checkIn], ['Check-Out', found.checkOut], ['Nights', found.nights], ['Total', `A${found.total.toLocaleString()}`]].map(([l, v]) => (
                      <div key={l} style={{ background: DS.c.white, borderRadius: DS.r.md, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, color: DS.c.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {found.status === 'confirmed' && <Button variant="success" size="sm" icon="checkin" fullWidth>Confirm Check-In</Button>}
                    {found.status === 'checkedin' && <Button variant="primary" size="sm" icon="checkout" fullWidth>Process Check-Out</Button>}
                    <Button variant="outline" size="sm" icon="download">Invoice</Button>
                  </div>
                </div>
              )}
              {found === 'notfound' && <div style={{ marginTop: 14, padding: '14px', background: DS.c.dangerBg, borderRadius: DS.r.md, color: DS.c.danger, fontSize: 13 }}>No booking found. Please check the ID or name.</div>}
            </div>

            {/* Tabs: expected today */}
            <div className="ga-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${DS.c.border}`, display: 'flex', gap: 4 }}>
                {['checkin', 'checkout'].map(t => (
                  <button key={t} className={`ga-tab ${tab === t ? 'active' : ''}`} style={{ fontSize: 12 }} onClick={() => setTab(t)}>
                    {t === 'checkin' ? `Arrivals Today (${todayCheckIns.length})` : `Departures Today (${todayCheckOuts.length})`}
                  </button>
                ))}
              </div>
              <table className="ga-table">
                <thead><tr><th>Guest</th><th>Room</th><th>Booking ID</th><th>Amount</th><th>Action</th></tr></thead>
                <tbody>
                  {(tab === 'checkin' ? todayCheckIns : todayCheckOuts).map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 500 }}>{b.guest}</td>
                      <td>{b.room}</td>
                      <td style={{ fontFamily: DS.f.serif, fontSize: 12, color: DS.c.gold }}>{b.id}</td>
                      <td>A${b.total.toLocaleString()}</td>
                      <td>
                        <Button variant={tab === 'checkin' ? 'success' : 'primary'} size="xs">
                          {tab === 'checkin' ? 'Check In' : 'Check Out'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Invoice preview */}
          <div>
            <div className="ga-card" style={{ padding: '22px' }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 18, marginBottom: 16 }}>Invoice Preview</h3>
              <div style={{ background: DS.c.navy, borderRadius: DS.r.md, padding: '16px', marginBottom: 14 }}>
                <div style={{ fontFamily: DS.f.serif, fontSize: 20, color: DS.c.white, marginBottom: 2 }}>Grand Azure Hotel</div>
                <div style={{ fontSize: 10, color: DS.c.gold, letterSpacing: '0.1em' }}>TAX INVOICE</div>
              </div>
              {[['Invoice No.', 'INV-2026-0841'], ['Guest', 'Liam Anderson'], ['Room', 'Superior Suite'], ['Check-In', '22 Apr 2026'], ['Check-Out', '25 Apr 2026'], ['Nights', '3']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${DS.c.borderLight}`, fontSize: 13 }}>
                  <span style={{ color: DS.c.textMuted }}>{l}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '12px', background: DS.c.beigeLight, borderRadius: DS.r.md }}>
                {[['Room Rate × 3', 'A$2,040'], ['Service Charge', 'A$204'], ['VAT', 'A$102']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                    <span style={{ color: DS.c.textMid }}>{l}</span><span>{v}</span>
                  </div>
                ))}
                <div className="ga-divider" style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total Due</span>
                  <span style={{ color: DS.c.gold, fontFamily: DS.f.serif, fontSize: 17 }}>A$2,346</span>
                </div>
              </div>
              <Button variant="primary" size="sm" fullWidth icon="download" style={{ marginTop: 14 }}>Download Invoice</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────
const UserManagement = ({ setPage }) => {
  const [showModal, setShowModal] = React.useState(false);
  const users = [
    { id: 1, name: 'Liam Anderson', email: 'liam@example.com.au', role: 'customer', status: 'active', joined: 'Jan 2025', bookings: 12 },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'customer', status: 'active', joined: 'Mar 2025', bookings: 4 },
    { id: 3, name: 'Cameron Harris', email: 'kamrul@grandazure.com', role: 'staff', status: 'active', joined: 'Jun 2023', bookings: 0 },
    { id: 4, name: 'Natalie Archer', email: 'nadia@grandazure.com', role: 'staff', status: 'active', joined: 'Sep 2023', bookings: 0 },
    { id: 5, name: 'General Manager', email: 'gm@grandazure.com', role: 'admin', status: 'active', joined: 'Jan 2018', bookings: 0 },
    { id: 6, name: 'Michael Thompson', email: 'malrashid@example.com', role: 'customer', status: 'inactive', joined: 'Nov 2024', bookings: 2 },
  ];

  return (
    <AdminLayout page="usermgmt" setPage={setPage} title="User Management" subtitle="Staff, customers and role permissions">
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Users" value="1,284" sub="Registered accounts" icon="users" />
          <StatCard label="Active Staff" value="47" sub="Hotel team members" icon="user" color={DS.c.info} />
          <StatCard label="New This Month" value="38" sub="New registrations" icon="plus" color={DS.c.success} trend={14} />
        </div>

        <div className="ga-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${DS.c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'admin', 'staff', 'customer'].map(r => (
                <button key={r} className="ga-tab" style={{ fontSize: 12 }}>{r.charAt(0).toUpperCase() + r.slice(1)}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <input className="ga-input" placeholder="Search users…" style={{ padding: '7px 14px 7px 32px', width: 200, fontSize: 13 }} />
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: DS.c.textMuted }}><Icon name="search" size={13} /></span>
              </div>
              <Button variant="primary" size="sm" icon="plus" onClick={() => setShowModal(true)}>Add User</Button>
            </div>
          </div>
          <table className="ga-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Bookings</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.role === 'admin' ? `linear-gradient(135deg, ${DS.c.gold}, ${DS.c.goldDark})` : `${DS.c.navy}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: u.role === 'admin' ? DS.c.navy : DS.c.navyMid }}>{u.name[0]}</div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: DS.c.textMuted }}>{u.email}</td>
                  <td><Badge status={u.role} text={u.role} /></td>
                  <td style={{ fontSize: 13 }}>{u.joined}</td>
                  <td style={{ textAlign: 'center', fontWeight: 500 }}>{u.bookings || '—'}</td>
                  <td><Badge status={u.status === 'active' ? 'confirmed' : 'cancelled'} text={u.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: DS.c.info }}><Icon name="edit" size={14} /></button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: DS.c.danger }}><Icon name="trash" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New User" width={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Input label="First Name" placeholder="Liam" required />
            <Input label="Last Name" placeholder="Islam" required />
          </div>
          <Input label="Email" type="email" placeholder="user@example.com" required />
          <Input label="Phone" placeholder="+61 4XX XXX XXX" />
          <Select label="Role" options={[{value:'customer',label:'Customer'},{value:'staff',label:'Hotel Staff'},{value:'admin',label:'Administrator'}]} />
          <Input label="Temporary Password" type="password" placeholder="Min. 8 characters" required />
          <Button variant="primary" size="md" fullWidth icon="user">Create User Account</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

// ─── PAYMENT / INVOICE PAGE ───────────────────────────────────────────────────
const PaymentPage = ({ setPage }) => {
  const [tab, setTab] = React.useState('transactions');

  const transactions = [
    { id: 'TXN-2026-4521', booking: 'GA-2026-0841', guest: 'Liam Anderson', amount: 2346, method: 'Card', date: '22 Apr 2026', status: 'paid' },
    { id: 'TXN-2026-4522', booking: 'GA-2026-0842', guest: 'Priya Sharma', amount: 1140, method: 'bKash', date: '23 Apr 2026', status: 'paid' },
    { id: 'TXN-2026-4523', booking: 'GA-2026-0843', guest: 'Michael Thompson', amount: 7400, method: 'Bank Transfer', date: '—', status: 'unpaid' },
    { id: 'TXN-2026-4524', booking: 'GA-2026-0844', guest: 'Anjali Roy', amount: 640, method: 'Card', date: '20 Apr 2026', status: 'paid' },
    { id: 'TXN-2026-4525', booking: 'GA-2026-0845', guest: 'Thomas Bennett', amount: 2550, method: 'Nagad', date: '—', status: 'unpaid' },
  ];

  return (
    <AdminLayout page="payment" setPage={setPage} title="Payments & Invoices" subtitle="Financial records and billing management">
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="April Revenue" value="A$4.21M" sub="Total collected" icon="payment" trend={18} color={DS.c.gold} bg={DS.c.navy} />
          <StatCard label="Pending" value="A$205K" sub="Awaiting payment" icon="bell" color={DS.c.warning} trend={-5} />
          <StatCard label="Transactions" value="284" sub="This month" icon="trend" trend={12} />
          <StatCard label="Avg. Booking Value" value="A$1,840" sub="Per stay" icon="star" color={DS.c.gold} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {['transactions', 'invoices'].map(t => (
                <button key={t} className={`ga-tab ${tab === t ? 'active' : ''}`} style={{ fontSize: 12 }} onClick={() => setTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="ga-card" style={{ overflow: 'hidden' }}>
              <table className="ga-table">
                <thead><tr><th>Transaction ID</th><th>Guest</th><th>Booking</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontFamily: DS.f.serif, fontSize: 12, fontWeight: 600, color: DS.c.navy }}>{t.id}</td>
                      <td style={{ fontWeight: 500 }}>{t.guest}</td>
                      <td style={{ fontSize: 12, color: DS.c.gold }}>{t.booking}</td>
                      <td style={{ fontWeight: 700 }}>A${t.amount.toLocaleString()}</td>
                      <td style={{ fontSize: 13 }}>{t.method}</td>
                      <td style={{ fontSize: 13, color: DS.c.textMuted }}>{t.date}</td>
                      <td><Badge status={t.status} text={t.status} /></td>
                      <td><Button variant="ghost" size="xs" icon="download">PDF</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice template */}
          <div>
            <div className="ga-card" style={{ padding: '22px' }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 18, marginBottom: 14 }}>Invoice Template</h3>
              <div style={{ border: `1px solid ${DS.c.border}`, borderRadius: DS.r.md, overflow: 'hidden' }}>
                <div style={{ background: DS.c.navy, padding: '16px 18px' }}>
                  <div style={{ fontFamily: DS.f.serif, color: DS.c.white, fontSize: 16 }}>Grand Azure Hotel</div>
                  <div style={{ fontSize: 9, color: DS.c.gold, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Official Invoice</div>
                </div>
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: DS.c.textMuted, textTransform: 'uppercase' }}>Bill To</div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>Liam Anderson</div>
                      <div style={{ fontSize: 11, color: DS.c.textMuted }}>liam@example.com.au</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: DS.c.textMuted, textTransform: 'uppercase' }}>Invoice</div>
                      <div style={{ fontWeight: 600, fontSize: 12, color: DS.c.gold }}>INV-2026-0841</div>
                      <div style={{ fontSize: 11, color: DS.c.textMuted }}>22 Apr 2026</div>
                    </div>
                  </div>
                  <div style={{ background: DS.c.beigeLight, borderRadius: DS.r.sm, padding: '10px 12px', marginBottom: 10 }}>
                    {[['Superior Suite × 3 nights', 'A$2,040'], ['Service Charge (10%)', 'A$204'], ['VAT (5%)', 'A$102']].map(([l, v]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                        <span style={{ color: DS.c.textMid }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                    <div className="ga-divider" style={{ margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 13 }}>
                      <span>Total</span><span style={{ color: DS.c.gold }}>A$2,346</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="primary" size="xs" fullWidth icon="download">Download PDF</Button>
                    <Button variant="outline" size="xs" fullWidth icon="mail">Email</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="ga-card" style={{ padding: '18px', marginTop: 16 }}>
              <h4 style={{ fontFamily: DS.f.serif, fontSize: 15, marginBottom: 12 }}>Payment Methods</h4>
              {[['💳', 'Credit / Debit Cards', '68%'], ['📱', 'bKash / Nagad', '22%'], ['🏦', 'Bank Transfer', '10%']].map(([e, l, v]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>{e}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 3 }}>
                      <span>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                    <div style={{ height: 4, background: DS.c.beige, borderRadius: DS.r.full }}>
                      <div style={{ height: '100%', width: v, background: DS.c.gold, borderRadius: DS.r.full }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};


// ─── STAFF MANAGEMENT ────────────────────────────────────────────────────────
const StaffManagement = ({ setPage }) => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const staff = [
    { id: 'STF-001', name: 'Amina Rahman', role: 'Front Desk Manager', department: 'Reception', clockIn: '07:00 AM', clockOut: '03:30 PM', weeklyHours: 40, hourlyRate: 32, hiringDate: '12 Jan 2024', status: 'active' },
    { id: 'STF-002', name: 'James Carter', role: 'Housekeeping Lead', department: 'Housekeeping', clockIn: '08:00 AM', clockOut: '04:00 PM', weeklyHours: 38, hourlyRate: 29, hiringDate: '04 Mar 2023', status: 'active' },
    { id: 'STF-003', name: 'Priya Sen', role: 'Restaurant Supervisor', department: 'Food & Beverage', clockIn: '02:00 PM', clockOut: '10:00 PM', weeklyHours: 42, hourlyRate: 31, hiringDate: '19 Jul 2022', status: 'active' },
    { id: 'STF-004', name: 'Daniel Brooks', role: 'Maintenance Officer', department: 'Maintenance', clockIn: '09:00 AM', clockOut: '05:30 PM', weeklyHours: 36, hourlyRate: 34, hiringDate: '25 Sep 2024', status: 'onleave' },
    { id: 'STF-005', name: 'Nusrat Jahan', role: 'Night Auditor', department: 'Finance', clockIn: '10:00 PM', clockOut: '06:00 AM', weeklyHours: 40, hourlyRate: 35, hiringDate: '08 Feb 2025', status: 'active' },
  ];

  const filtered = staff.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false;
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q) && !s.department.toLowerCase().includes(q)) return false;
    return true;
  });

  const totalHours = staff.reduce((sum, s) => sum + s.weeklyHours, 0);
  const weeklyPayroll = staff.reduce((sum, s) => sum + (s.weeklyHours * s.hourlyRate), 0);
  const activeStaff = staff.filter(s => s.status === 'active').length;

  return (
    <AdminLayout page="staffmgmt" setPage={setPage} title="Staff Management" subtitle="Manage staff clock-in/out times, weekly hours and payroll details">
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Staff" value={staff.length.toString()} sub="Registered employees" icon="users" />
          <StatCard label="Active Staff" value={activeStaff.toString()} sub="Currently working" icon="check" color={DS.c.success} />
          <StatCard label="Weekly Hours" value={totalHours.toString()} sub="Total scheduled hours" icon="clock" color={DS.c.info} />
          <StatCard label="Weekly Payroll" value={`A$${weeklyPayroll.toLocaleString()}`} sub="Hours × hourly rate" icon="payment" color={DS.c.gold} bg={DS.c.navy} />
        </div>

        <div className="ga-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['all', 'active', 'onleave'].map(f => (
              <button key={f} className={`ga-tab ${filter === f ? 'active' : ''}`} style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'onleave' ? 'On Leave' : 'Active'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <input className="ga-input" placeholder="Search staff…" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 14px 8px 34px', width: 220, fontSize: 13 }} />
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: DS.c.textMuted }}><Icon name="search" size={14} /></span>
            </div>
            <Button variant="primary" size="sm" icon="plus">Add Staff</Button>
          </div>
        </div>

        <div className="ga-card" style={{ overflow: 'hidden', marginBottom: 24 }}>
          <table className="ga-table">
            <thead>
              <tr><th>Staff ID</th><th>Name</th><th>Role</th><th>Department</th><th>Clock-In</th><th>Clock-Out</th><th>Weekly Hours</th><th>Hourly Pay</th><th>Weekly Pay</th><th>Hiring Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily: DS.f.serif, fontWeight: 600, color: DS.c.navy }}>{s.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${DS.c.gold}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: DS.c.goldDark }}>{s.name[0]}</div>
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td>{s.role}</td>
                  <td>{s.department}</td>
                  <td style={{ fontWeight: 600 }}>{s.clockIn}</td>
                  <td style={{ fontWeight: 600 }}>{s.clockOut}</td>
                  <td>{s.weeklyHours} hrs</td>
                  <td>A${s.hourlyRate}/hr</td>
                  <td style={{ fontWeight: 600, color: DS.c.gold }}>A${(s.weeklyHours * s.hourlyRate).toLocaleString()}</td>
                  <td>{s.hiringDate}</td>
                  <td><Badge status={s.status === 'active' ? 'confirmed' : 'pending'} text={s.status === 'active' ? 'Active' : 'On Leave'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
          <div className="ga-card" style={{ padding: '20px' }}>
            <h3 style={{ fontFamily: DS.f.serif, fontSize: 18, marginBottom: 14 }}>Today&apos;s Shift Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {staff.slice(0, 3).map(s => (
                <div key={s.id} style={{ background: DS.c.beigeLight, borderRadius: DS.r.lg, padding: '14px', border: `1px solid ${DS.c.borderLight}` }}>
                  <div style={{ fontWeight: 600, color: DS.c.navy, marginBottom: 4 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: DS.c.textMuted, marginBottom: 10 }}>{s.department}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>In</span><strong>{s.clockIn}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}><span>Out</span><strong>{s.clockOut}</strong></div>
                </div>
              ))}
            </div>
          </div>

          <div className="ga-card" style={{ padding: '20px' }}>
            <h3 style={{ fontFamily: DS.f.serif, fontSize: 18, marginBottom: 14 }}>Payroll Notes</h3>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: DS.c.textMid }}>
              Weekly payment is calculated from each staff member&apos;s recorded weekly hours and hourly pay rate. The hiring date helps admin track employment history and staff records.
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// ─── ENQUIRY PAGE (Admin) ─────────────────────────────────────────────────────
const EnquiryManagement = ({ setPage }) => {
  const enquiries = [
    { id: 'ENQ-001', name: 'Sarah Mitchell', subject: 'Wedding Package Enquiry', date: '19 Apr 2026', status: 'pending', type: 'event' },
    { id: 'ENQ-002', name: 'Robert Kim', subject: 'Corporate Rate Request', date: '18 Apr 2026', status: 'confirmed', type: 'corporate' },
    { id: 'ENQ-003', name: 'Fraser Hamilton', subject: 'Presidential Suite Availability', date: '17 Apr 2026', status: 'pending', type: 'booking' },
    { id: 'ENQ-004', name: 'Meera Patel', subject: 'Spa Package Information', date: '16 Apr 2026', status: 'checkedout', type: 'general' },
  ];
  return (
    <AdminLayout page="enquiry" setPage={setPage} title="Enquiry Management" subtitle="Customer messages and support requests">
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Enquiries" value="47" sub="This month" icon="enquiry" />
          <StatCard label="Pending Response" value="14" sub="Awaiting reply" icon="bell" color={DS.c.warning} />
          <StatCard label="Resolved" value="33" sub="This month" icon="check" color={DS.c.success} trend={8} />
        </div>
        <div className="ga-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${DS.c.border}` }}>
            <h3 style={{ fontFamily: DS.f.serif, fontSize: 18 }}>All Enquiries</h3>
          </div>
          <table className="ga-table">
            <thead><tr><th>ID</th><th>From</th><th>Subject</th><th>Type</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {enquiries.map(e => (
                <tr key={e.id}>
                  <td style={{ fontFamily: DS.f.serif, fontWeight: 600, color: DS.c.gold, fontSize: 12 }}>{e.id}</td>
                  <td style={{ fontWeight: 500 }}>{e.name}</td>
                  <td>{e.subject}</td>
                  <td><span style={{ fontSize: 11, background: DS.c.beigeLight, color: DS.c.textMid, padding: '2px 8px', borderRadius: DS.r.full, textTransform: 'capitalize' }}>{e.type}</span></td>
                  <td style={{ fontSize: 13, color: DS.c.textMuted }}>{e.date}</td>
                  <td><Badge status={e.status === 'confirmed' ? 'confirmed' : 'pending'} text={e.status === 'confirmed' ? 'Resolved' : 'Pending'} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button variant="primary" size="xs">Reply</Button>
                      <Button variant="ghost" size="xs" icon="check">Resolve</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

// Export dashboard pages
Object.assign(window, {
  CustomerDashboard, AdminDashboard, BookingManagement, RoomManagement, StaffManagement,
  CheckInOut, UserManagement, PaymentPage, EnquiryManagement, AdminLayout,
});
