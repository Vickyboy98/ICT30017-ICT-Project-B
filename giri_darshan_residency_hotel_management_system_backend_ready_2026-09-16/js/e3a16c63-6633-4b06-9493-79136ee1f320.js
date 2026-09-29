
// ─── PUBLIC PAGES: Home, Rooms, RoomDetail, Booking, Contact, Auth ────────────

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const ROOMS = [
  { id: 1, type: 'Deluxe Room', price: 380, size: '38 sqm', capacity: 2, floor: 5, ac: true, view: 'City View', amenities: ['WiFi', 'Mini Bar', 'Smart TV', 'Rainfall Shower'], status: 'available', rating: 4.8, reviews: 124, beds: 'King Bed' },
  { id: 2, type: 'Superior Suite', price: 680, size: '62 sqm', capacity: 3, floor: 8, ac: true, view: 'Pool View', amenities: ['WiFi', 'Jacuzzi', 'Kitchenette', 'Butler Service', 'Smart TV'], status: 'available', rating: 4.9, reviews: 87, beds: 'King Bed + Sofa' },
  { id: 3, type: 'Presidential Suite', price: 1850, size: '148 sqm', capacity: 4, floor: 18, ac: true, view: 'Panoramic', amenities: ['WiFi', 'Private Pool', 'Kitchen', 'Butler', 'Dining Room', 'Office'], status: 'occupied', rating: 5.0, reviews: 32, beds: '2 King Beds' },
  { id: 4, type: 'Garden View', price: 320, size: '32 sqm', capacity: 2, floor: 2, ac: true, view: 'Garden', amenities: ['WiFi', 'Smart TV', 'Balcony'], status: 'available', rating: 4.6, reviews: 201, beds: 'Queen Bed' },
  { id: 5, type: 'Sea View', price: 850, size: '75 sqm', capacity: 3, floor: 12, ac: true, view: 'Sea View', amenities: ['WiFi', 'Jacuzzi', 'Private Balcony', 'Smart TV', 'Mini Bar'], status: 'available', rating: 4.9, reviews: 56, beds: 'King Bed' },
  { id: 6, type: 'Standard Room', price: 250, size: '28 sqm', capacity: 2, floor: 3, ac: true, view: 'Internal', amenities: ['WiFi', 'Smart TV'], status: 'maintenance', rating: 4.4, reviews: 318, beds: 'Twin Beds' },
];

const BOOKINGS_SAMPLE = [
  { id: 'GA-2026-0841', guest: 'Rafiqul Islam', room: 'Superior Suite', checkIn: '22 Apr 2026', checkOut: '25 Apr 2026', nights: 3, total: 45000, status: 'confirmed', paid: true },
  { id: 'GA-2026-0842', guest: 'Priya Sharma', room: 'Deluxe Room', checkIn: '23 Apr 2026', checkOut: '26 Apr 2026', nights: 3, total: 25500, status: 'checkedin', paid: true },
  { id: 'GA-2026-0843', guest: 'Mohammed Al-Rashid', room: 'Presidential Suite', checkIn: '24 Apr 2026', checkOut: '28 Apr 2026', nights: 4, total: 168000, status: 'confirmed', paid: false },
  { id: 'GA-2026-0844', guest: 'Anjali Roy', room: 'Garden View', checkIn: '20 Apr 2026', checkOut: '22 Apr 2026', nights: 2, total: 14400, status: 'checkedout', paid: true },
  { id: 'GA-2026-0845', guest: 'Tanvir Hossain', room: 'Sea View', checkIn: '25 Apr 2026', checkOut: '27 Apr 2026', nights: 2, total: 37000, status: 'pending', paid: false },
  { id: 'GA-2026-0846', guest: 'Deepa Nair', room: 'Deluxe Room', checkIn: '19 Apr 2026', checkOut: '21 Apr 2026', nights: 2, total: 17000, status: 'cancelled', paid: false },
];

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = ({ setPage }) => {
  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');
  const [guests, setGuests] = React.useState('2');

  const amenities = [
    { icon: 'pool', label: 'Infinity Pool', desc: 'Rooftop pool with city panorama' },
    { icon: 'spa', label: 'Azure Spa', desc: 'Full-service wellness retreat' },
    { icon: 'restaurant', label: 'Fine Dining', desc: 'Award-winning cuisine' },
    { icon: 'gym', label: 'Fitness Centre', desc: 'State-of-the-art equipment' },
    { icon: 'concierge', label: 'Concierge', desc: '24-hour personal service' },
    { icon: 'wifi', label: 'Premium WiFi', desc: 'Fibre-speed connectivity' },
  ];

  const testimonials = [
    { name: 'Sophie Williams', role: 'CEO, Sydney Ventures', text: 'Impeccable service and stunning interiors. Grand Azure truly redefines luxury in Sydney. Every detail was thoughtfully curated.', rating: 5 },
    { name: 'James Hartford', role: 'Travel Writer, London', text: 'I have stayed in five-star hotels across Asia, and Grand Azure stands proudly among the best. The Presidential Suite is simply breathtaking.', rating: 5 },
    { name: 'Sadia Rahman', role: 'Wedding Planner', text: 'Hosted our most prestigious clients here for a week-long event. The team went above and beyond at every moment.', rating: 5 },
  ];

  return (
    <div style={{ background: DS.c.ivory }}>
      {/* HERO */}
      <div style={{ position: 'relative', height: '100vh', minHeight: 600, background: `linear-gradient(160deg, #040D1A 0%, #0B1628 35%, #162238 65%, #1A2B44 100%)`, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse 80% 60% at 70% 40%, rgba(201,169,110,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(201,169,110,0.05) 0%, transparent 50%)` }} />
        {/* Hero image panel */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '52%', height: '100%', clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)', overflow: 'hidden' }}>
          <img
            src={(window.__resources && window.__resources.imgHero) || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=900&fit=crop&q=85&auto=format"}
            alt="Grand Azure Hotel"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0B1628 0%, transparent 30%), linear-gradient(to top, #0B1628 0%, transparent 40%)' }} />
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '0 40px', paddingTop: 80 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ height: 1, width: 32, background: DS.c.gold }} />
              <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: DS.c.gold }}>Sydney's Premier Luxury Hotel</span>
            </div>
            <h1 style={{ fontFamily: DS.f.serif, fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 300, color: DS.c.white, lineHeight: 1.1, marginBottom: 24 }}>
              Where Luxury<br /><span style={{ fontWeight: 600, color: DS.c.gold }}>Meets Comfort</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
              An extraordinary hotel experience with impeccable service, world-class amenities, and a commitment to creating unforgettable moments.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Button variant="primary" size="lg" onClick={() => setPage('booking')}>Reserve Your Stay</Button>
              <Button variant="outlineGold" size="lg" onClick={() => setPage('rooms')}>Explore Rooms</Button>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[['18', 'Floors'], ['148', 'Luxury Rooms'], ['★ 5.0', 'Rating']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: DS.f.serif, fontSize: 26, fontWeight: 600, color: DS.c.gold }}>{v}</div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)', animation: 'pulse 2s infinite' }} />
        </div>
      </div>

      {/* AVAILABILITY SEARCH */}
      <div style={{ background: DS.c.white, boxShadow: DS.s.lg, borderRadius: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <Input label="Check-In" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
            <Input label="Check-Out" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
            <Select label="Guests" options={[{value:'1',label:'1 Guest'},{value:'2',label:'2 Guests'},{value:'3',label:'3 Guests'},{value:'4',label:'4 Guests'}]} value={guests} onChange={e => setGuests(e.target.value)} />
            <Select label="Room Type" options={[{value:'any',label:'Any Type'},{value:'deluxe',label:'Deluxe Room'},{value:'suite',label:'Suite'},{value:'presidential',label:'Presidential'}]} />
            <Button variant="primary" size="lg" icon="search" onClick={() => setPage('rooms')} style={{ paddingLeft: 24, paddingRight: 24 }}>Search</Button>
          </div>
        </div>
      </div>

      {/* FEATURED ROOMS */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>
        <SectionHeading eyebrow="Our Accommodations" title="Carefully Curated Rooms" subtitle="From intimate Deluxe Rooms to the spectacular Presidential Suite, every space is designed to exceed expectations." center />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {ROOMS.filter(r => r.status !== 'maintenance').slice(0, 3).map(room => (
            <div key={room.id} className="ga-card ga-card-hover" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setPage('roomdetail')}>
              <RoomImgPlaceholder type={room.type} height={200} />
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: DS.f.serif, fontSize: 20, fontWeight: 600, color: DS.c.text }}>{room.type}</div>
                    <div style={{ fontSize: 12, color: DS.c.textMuted, marginTop: 2 }}>{room.size} · {room.view} · Floor {room.floor}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: DS.f.serif, fontSize: 22, fontWeight: 600, color: DS.c.gold }}>A${room.price.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: DS.c.textMuted }}>per night</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {room.amenities.slice(0, 3).map(a => (
                    <span key={a} style={{ fontSize: 11, background: DS.c.beigeLight, color: DS.c.textMid, padding: '3px 8px', borderRadius: DS.r.full }}>{a}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: DS.c.gold, fontSize: 12 }}>★</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: DS.c.text }}>{room.rating}</span>
                    <span style={{ fontSize: 12, color: DS.c.textMuted }}>({room.reviews})</span>
                  </div>
                  <Badge status={room.status} text={room.status === 'available' ? 'Available' : 'Booked'} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Button variant="outline" size="lg" onClick={() => setPage('rooms')}>View All Rooms</Button>
        </div>
      </div>

      {/* AMENITIES */}
      <div style={{ background: DS.c.navy, padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeading eyebrow="Hotel Amenities" title="World-Class Facilities" subtitle="Every amenity designed to elevate your stay into an extraordinary experience." center light />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {amenities.map((a, i) => (
              <div key={a.label} style={{ padding: '36px', borderTop: i >= 3 ? `1px solid rgba(255,255,255,0.08)` : 'none', borderRight: (i + 1) % 3 !== 0 ? `1px solid rgba(255,255,255,0.08)` : 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,169,110,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 52, height: 52, borderRadius: DS.r.md, border: `1px solid rgba(201,169,110,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon name={a.icon} size={22} color={DS.c.gold} />
                </div>
                <div style={{ fontFamily: DS.f.serif, fontSize: 20, fontWeight: 500, color: DS.c.white, marginBottom: 6 }}>{a.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: '80px 40px', background: DS.c.beigeLight }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeading eyebrow="Guest Stories" title="What Our Guests Say" center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="ga-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array(t.rating).fill(0).map((_, j) => <span key={j} style={{ color: DS.c.gold, fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14.5, color: DS.c.textMid, lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${DS.c.gold}40, ${DS.c.goldDark}30)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: DS.c.goldDark, fontSize: 15 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: DS.c.text }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: DS.c.textMuted }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div style={{ padding: '80px 40px', background: DS.c.white }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <SectionHeading eyebrow="Our Story" title="An Icon of Australian Hospitality" subtitle="Established in 2018, Grand Azure has redefined luxury hospitality in Sydney. Standing 18 floors above Circular Quay, we offer 148 meticulously designed rooms with world-class amenities and the legendary warmth of Australian service." />
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[['2018', 'Established'], ['148', 'Rooms & Suites'], ['450+', 'Team Members']].map(([v, l]) => (
                <div key={l} style={{ flex: 1, padding: '16px 20px', background: DS.c.beigeLight, borderRadius: DS.r.md, borderLeft: `3px solid ${DS.c.gold}` }}>
                  <div style={{ fontFamily: DS.f.serif, fontSize: 28, fontWeight: 600, color: DS.c.navy }}>{v}</div>
                  <div style={{ fontSize: 12, color: DS.c.textMuted, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ height: 380, borderRadius: DS.r.xl, overflow: 'hidden', border: `1px solid ${DS.c.border}` }}>
              <img src={(window.__resources && window.__resources.imgAbout) || "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&q=85&auto=format"} alt="Grand Azure Hotel exterior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,22,40,0.3) 0%, transparent 60%)', borderRadius: DS.r.xl }} />
            </div>
            <div style={{ position: 'absolute', bottom: -20, right: -20, background: DS.c.white, borderRadius: DS.r.lg, padding: '18px 22px', boxShadow: DS.s.md, border: `1px solid ${DS.c.borderLight}` }}>
              <div style={{ fontFamily: DS.f.serif, fontSize: 28, fontWeight: 600, color: DS.c.gold }}>★ 5.0</div>
              <div style={{ fontSize: 12, color: DS.c.textMuted }}>TripAdvisor Rating</div>
            </div>
          </div>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
};

// ─── ROOMS PAGE ───────────────────────────────────────────────────────────────
const RoomsPage = ({ setPage }) => {
  const [priceMax, setPriceMax] = React.useState(2500);
  const [types, setTypes] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState('price_asc');

  const filtered = ROOMS.filter(r => {
    if (r.price > priceMax) return false;
    if (types.length > 0 && !types.some(t => r.type.toLowerCase().includes(t))) return false;
    if (search && !r.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  const toggleType = t => setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  return (
    <div style={{ paddingTop: 68, background: DS.c.ivory, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: DS.c.navy, padding: '48px 40px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: DS.c.gold, marginBottom: 10 }}>Accommodations</div>
          <h1 style={{ fontFamily: DS.f.serif, fontSize: 44, fontWeight: 600, color: DS.c.white, marginBottom: 8 }}>Our Rooms & Suites</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)' }}>Discover our carefully designed spaces — from intimate city-view rooms to expansive penthouse suites.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, alignItems: 'start' }}>
        {/* Filters sidebar */}
        <div className="ga-card" style={{ padding: '24px', position: 'sticky', top: 88 }}>
          <div style={{ fontFamily: DS.f.serif, fontSize: 18, fontWeight: 600, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${DS.c.border}` }}>Filters</div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: DS.c.textMuted, marginBottom: 12 }}>Room Type</div>
            {[['standard', 'Standard'], ['deluxe', 'Deluxe'], ['suite', 'Suite'], ['presidential', 'Presidential'], ['sea view', 'Sea View'], ['garden', 'Garden View']].map(([v, l]) => (
              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 14, color: DS.c.textMid }}>
                <input type="checkbox" checked={types.includes(v)} onChange={() => toggleType(v)} style={{ accentColor: DS.c.gold, width: 15, height: 15 }} />{l}
              </label>
            ))}
          </div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: DS.c.textMuted, marginBottom: 12 }}>Max Price / Night</div>
            <input type="range" min="150" max="2500" step="50" value={priceMax} onChange={e => setPriceMax(+e.target.value)} style={{ width: '100%', accentColor: DS.c.gold }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: DS.c.textMuted, marginTop: 6 }}>
              <span>A$150</span><span style={{ fontWeight: 600, color: DS.c.gold }}>A${priceMax.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: DS.c.textMuted, marginBottom: 12 }}>Status</div>
            {['Available', 'Occupied', 'All'].map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 14, color: DS.c.textMid }}>
                <input type="radio" name="status" defaultChecked={s === 'All'} style={{ accentColor: DS.c.gold }} />{s}
              </label>
            ))}
          </div>
          <button onClick={() => { setTypes([]); setPriceMax(50000); setSearch(''); }} style={{ marginTop: 16, width: '100%', padding: '8px', background: DS.c.beigeLight, border: 'none', borderRadius: DS.r.md, fontSize: 13, color: DS.c.textMid, cursor: 'pointer' }}>Reset Filters</button>
        </div>

        {/* Rooms grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 14, color: DS.c.textMuted }}><strong style={{ color: DS.c.text }}>{filtered.length}</strong> rooms found</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input className="ga-input" placeholder="Search rooms…" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 14px 8px 32px', width: 180, fontSize: 13 }} />
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: DS.c.textMuted }}><Icon name="search" size={13} /></span>
              </div>
              <select className="ga-input" value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 32px 8px 12px', fontSize: 13, width: 160, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238B95A1' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', appearance: 'none' }}>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 22 }}>
            {filtered.map(room => (
              <div key={room.id} className="ga-card ga-card-hover" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setPage('roomdetail')}>
                <div style={{ position: 'relative' }}>
                  <RoomImgPlaceholder type={room.type} height={190} />
                  <div style={{ position: 'absolute', top: 12, right: 12 }}><Badge status={room.status} text={room.status === 'available' ? 'Available' : room.status === 'occupied' ? 'Occupied' : 'Maintenance'} /></div>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontFamily: DS.f.serif, fontSize: 18, fontWeight: 600 }}>{room.type}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: DS.f.serif, fontSize: 20, fontWeight: 600, color: DS.c.gold }}>A${room.price.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: DS.c.textMuted }}>/ night</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: DS.c.textMuted, marginBottom: 10 }}>{room.beds} · {room.size} · {room.view} · Floor {room.floor} · Up to {room.capacity} guests</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {room.amenities.slice(0, 4).map(a => <span key={a} style={{ fontSize: 10, background: DS.c.beigeLight, color: DS.c.textMid, padding: '2px 8px', borderRadius: DS.r.full }}>{a}</span>)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12 }}><span style={{ color: DS.c.gold }}>★</span> <strong>{room.rating}</strong> <span style={{ color: DS.c.textMuted }}>({room.reviews} reviews)</span></div>
                    <Button variant="primary" size="xs" onClick={e => { e.stopPropagation(); setPage('booking'); }}>Book</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: DS.c.textMuted }}>No rooms match your filters. Try adjusting your search.</div>}
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

// ─── ROOM DETAIL PAGE ─────────────────────────────────────────────────────────
const RoomDetailPage = ({ setPage }) => {
  const room = ROOMS[1]; // Superior Suite
  const [activeImg, setActiveImg] = React.useState(0);
  const [checkIn, setCheckIn] = React.useState('2026-04-25');
  const [checkOut, setCheckOut] = React.useState('2026-04-28');
  const nights = 3;

  const relatedRooms = ROOMS.filter(r => r.id !== room.id).slice(0, 3);
  const reviews = [
    { name: 'Karim Hassan', date: 'March 2026', rating: 5, text: 'Absolutely stunning suite. The pool view is spectacular and the butler service was exceptional.' },
    { name: 'Priya Mehta', date: 'Feb 2026', rating: 5, text: 'Perfect for a special anniversary. Romantic, elegant, and the staff went out of their way for us.' },
    { name: 'Thomas Berg', date: 'Jan 2026', rating: 4, text: 'Magnificent room with top-notch amenities. Would have been perfect with faster in-room dining.' },
  ];

  return (
    <div style={{ paddingTop: 68, background: DS.c.ivory, minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: DS.c.white, padding: '14px 40px', borderBottom: `1px solid ${DS.c.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: DS.c.textMuted }}>
          <span style={{ cursor: 'pointer', color: DS.c.gold }} onClick={() => setPage('rooms')}>Rooms</span>
          <Icon name="chevronRight" size={12} />
          <span style={{ color: DS.c.text }}>{room.type}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 40px' }}>
        {/* Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 8, marginBottom: 40, borderRadius: DS.r.xl, overflow: 'hidden', height: 400 }}>
          <div style={{ overflow: 'hidden' }}>
            <img src={ROOM_IMAGES[room.type]} alt={room.type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 8 }}>
            {[
              (window.__resources && window.__resources.imgBathroom) || 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=300&fit=crop&q=80&auto=format',
              (window.__resources && window.__resources.imgGallery2) || 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=300&fit=crop&q=80&auto=format'
            ].map((src, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <img src={src} alt={`Room view ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 48, alignItems: 'start' }}>
          {/* Left: details */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h1 style={{ fontFamily: DS.f.serif, fontSize: 36, fontWeight: 600, color: DS.c.text, marginBottom: 6 }}>{room.type}</h1>
                <div style={{ fontSize: 13, color: DS.c.textMuted }}>{room.beds} · {room.size} · Floor {room.floor} · {room.view} · Up to {room.capacity} Guests</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 20, color: DS.c.gold }}>★</span>
                <span style={{ fontFamily: DS.f.serif, fontSize: 22, fontWeight: 600 }}>{room.rating}</span>
                <span style={{ fontSize: 13, color: DS.c.textMuted }}>({room.reviews} reviews)</span>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${DS.c.border}`, paddingTop: 24, marginBottom: 24 }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 20, marginBottom: 12 }}>About This Room</h3>
              <p style={{ fontSize: 14.5, color: DS.c.textMid, lineHeight: 1.8 }}>
                The {room.type} is a sanctuary of refined luxury spanning {room.size}. Featuring {room.beds.toLowerCase()} and a breathtaking {room.view.toLowerCase()}, this room embodies the finest in contemporary design. Floor-to-ceiling windows flood the space with natural light, while premium materials and bespoke furnishings create an atmosphere of exclusive comfort.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 20, marginBottom: 14 }}>Room Features</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {room.amenities.concat(['Air Conditioning', 'In-Room Safe', 'Blackout Curtains', 'Premium Toiletries']).map(a => (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: DS.c.textMid }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${DS.c.gold}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="check" size={10} color={DS.c.gold} />
                    </div>{a}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div style={{ borderTop: `1px solid ${DS.c.border}`, paddingTop: 24 }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 20, marginBottom: 18 }}>Guest Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {reviews.map((r, i) => (
                  <div key={i} style={{ padding: '18px', background: DS.c.white, borderRadius: DS.r.lg, border: `1px solid ${DS.c.borderLight}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${DS.c.gold}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: DS.c.goldDark }}>{r.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.name}</div>
                          <div style={{ fontSize: 11, color: DS.c.textMuted }}>{r.date}</div>
                        </div>
                      </div>
                      <div style={{ color: DS.c.gold, fontSize: 12 }}>{'★'.repeat(r.rating)}</div>
                    </div>
                    <p style={{ fontSize: 13.5, color: DS.c.textMid, lineHeight: 1.65 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: booking panel */}
          <div className="ga-card" style={{ padding: '24px', position: 'sticky', top: 88 }}>
            <div style={{ fontFamily: DS.f.serif, fontSize: 26, fontWeight: 600, color: DS.c.gold, marginBottom: 4 }}>A${room.price.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: DS.c.textMuted, marginBottom: 20 }}>per night · all taxes included</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
              <Input label="Check-In" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
              <Input label="Check-Out" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
              <Select label="Guests" options={[{value:'1',label:'1 Guest'},{value:'2',label:'2 Guests'},{value:'3',label:'3 Guests'}]} />
            </div>
            <div style={{ background: DS.c.beigeLight, borderRadius: DS.r.md, padding: '14px', marginBottom: 18 }}>
              {[['Room Rate', `A${room.price.toLocaleString()} × ${nights} nights`, room.price * nights], ['Service Charge (10%)', '', Math.round(room.price * nights * 0.10)], ['VAT (5%)', '', Math.round(room.price * nights * 0.05)]].map(([l, sub, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: DS.c.textMid }}>{l} {sub && <span style={{ color: DS.c.textMuted, fontSize: 11 }}>{sub}</span>}</span>
                  <span style={{ fontWeight: 500 }}>A${v.toLocaleString()}</span>
                </div>
              ))}
              <div className="ga-divider" style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14 }}>
                <span>Total</span>
                <span style={{ color: DS.c.gold, fontFamily: DS.f.serif, fontSize: 18 }}>A${Math.round(room.price * nights * 1.15).toLocaleString()}</span>
              </div>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={() => setPage('booking')}>Reserve Now</Button>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: DS.c.textMuted }}>Free cancellation until 48 hrs before check-in</div>
          </div>
        </div>

        {/* Related rooms */}
        <div style={{ marginTop: 64, paddingTop: 40, borderTop: `1px solid ${DS.c.border}` }}>
          <SectionHeading eyebrow="You May Also Like" title="Similar Accommodations" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {relatedRooms.map(r => (
              <div key={r.id} className="ga-card ga-card-hover" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setPage('roomdetail')}>
                <RoomImgPlaceholder type={r.type} height={150} />
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontFamily: DS.f.serif, fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{r.type}</div>
                  <div style={{ fontSize: 12, color: DS.c.textMuted, marginBottom: 8 }}>{r.size} · {r.view}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: DS.f.serif, fontSize: 17, color: DS.c.gold, fontWeight: 600 }}>A${r.price.toLocaleString()}</span>
                    <Badge status={r.status} text={r.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────
const BookingPage = ({ setPage }) => {
  const [step, setStep] = React.useState(1);
  const [payment, setPayment] = React.useState('card');
  const [form, setForm] = React.useState({ firstName: '', lastName: '', email: '', phone: '', special: '' });

  const steps = ['Guest Details', 'Payment', 'Confirmation'];

  const Summary = () => (
    <div className="ga-card" style={{ padding: '22px' }}>
      <div style={{ fontFamily: DS.f.serif, fontSize: 18, fontWeight: 600, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${DS.c.border}` }}>Booking Summary</div>
      <div style={{ borderRadius: DS.r.md, overflow: 'hidden', height: 120 }}>
        <img src={ROOM_IMAGES['Superior Suite']} alt="Superior Suite" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ marginTop: 14, marginBottom: 14 }}>
        <div style={{ fontFamily: DS.f.serif, fontSize: 17, fontWeight: 600 }}>Superior Suite</div>
        <div style={{ fontSize: 12, color: DS.c.textMuted, marginTop: 2 }}>King Bed · 62 sqm · Pool View</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14, fontSize: 13 }}>
        {[['Check-In', '25 Apr 2026'], ['Check-Out', '28 Apr 2026'], ['Duration', '3 Nights'], ['Guests', '2 Adults']].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DS.c.textMuted }}>{l}</span>
            <span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ background: DS.c.beigeLight, borderRadius: DS.r.md, padding: '12px 14px' }}>
        {[['Room Rate', 'A$2,040'], ['Service (10%)', 'A$204'], ['VAT (5%)', 'A$102']].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
            <span style={{ color: DS.c.textMid }}>{l}</span><span>{v}</span>
          </div>
        ))}
        <div className="ga-divider" style={{ margin: '8px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: DS.c.gold, fontFamily: DS.f.serif, fontSize: 17 }}>A$2,346</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 68, background: DS.c.ivory, minHeight: '100vh' }}>
      <div style={{ background: DS.c.navy, padding: '40px 40px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: DS.c.gold, marginBottom: 8 }}>Reservations</div>
          <h1 style={{ fontFamily: DS.f.serif, fontSize: 36, fontWeight: 600, color: DS.c.white, marginBottom: 20 }}>Complete Your Booking</h1>
          {/* Progress */}
          <div style={{ display: 'flex', gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i + 1 ? DS.c.success : step === i + 1 ? DS.c.gold : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step > i + 1 || step === i + 1 ? DS.c.navy : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? DS.c.white : 'rgba(255,255,255,0.5)' }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? DS.c.gold : 'rgba(255,255,255,0.15)', margin: '0 16px' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
        <div>
          {step === 1 && (
            <div className="ga-card fade-in" style={{ padding: '28px' }}>
              <h2 style={{ fontFamily: DS.f.serif, fontSize: 24, marginBottom: 24 }}>Guest Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Input label="First Name" placeholder="Rafiqul" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
                <Input label="Last Name" placeholder="Islam" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Input label="Email Address" type="email" placeholder="name@example.com.au" required />
                <Input label="Phone Number" placeholder="+61 4XX XXX XXX" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Input label="Nationality" placeholder="Australiai" />
                <Input label="NID / Passport No." placeholder="AU1234567" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: DS.c.textMid, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Special Requests</label>
                <textarea className="ga-input" placeholder="Any special requirements, dietary restrictions, or preferences…" style={{ padding: '10px 14px', minHeight: 80, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, padding: '12px 14px', background: DS.c.beigeLight, borderRadius: DS.r.md }}>
                <input type="checkbox" id="terms" style={{ accentColor: DS.c.gold }} />
                <label htmlFor="terms" style={{ fontSize: 13, color: DS.c.textMid }}>I agree to the <span style={{ color: DS.c.gold }}>Terms & Conditions</span> and <span style={{ color: DS.c.gold }}>Cancellation Policy</span></label>
              </div>
              <Button variant="primary" size="lg" onClick={() => setStep(2)}>Continue to Payment →</Button>
            </div>
          )}

          {step === 2 && (
            <div className="ga-card fade-in" style={{ padding: '28px' }}>
              <h2 style={{ fontFamily: DS.f.serif, fontSize: 24, marginBottom: 24 }}>Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {[['card', '💳', 'Credit / Debit Card', 'Visa, Mastercard, Amex'], ['bkash', '📱', 'bKash', 'Mobile banking'], ['nagad', '📱', 'Nagad', 'Mobile banking'], ['bank', '🏦', 'Bank Transfer', 'BSB / Account']].map(([v, emoji, l, sub]) => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: DS.r.md, border: `1.5px solid ${payment === v ? DS.c.gold : DS.c.border}`, background: payment === v ? `${DS.c.gold}08` : DS.c.white, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input type="radio" name="payment" value={v} checked={payment === v} onChange={() => setPayment(v)} style={{ accentColor: DS.c.gold }} />
                    <span style={{ fontSize: 20 }}>{emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{l}</div>
                      <div style={{ fontSize: 11, color: DS.c.textMuted }}>{sub}</div>
                    </div>
                  </label>
                ))}
              </div>
              {payment === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24, padding: '18px', background: DS.c.beigeLight, borderRadius: DS.r.md }}>
                  <Input label="Card Number" placeholder="4242 4242 4242 4242" icon="payment" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Input label="Expiry Date" placeholder="MM / YY" />
                    <Input label="CVV" placeholder="•••" type="password" />
                  </div>
                  <Input label="Cardholder Name" placeholder="RAFIQUL ISLAM" />
                </div>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>← Back</Button>
                <Button variant="primary" size="lg" onClick={() => setStep(3)}>Confirm & Pay A$2,346</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="ga-card fade-in" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: DS.c.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: `2px solid ${DS.c.success}` }}>
                <Icon name="check" size={32} color={DS.c.success} />
              </div>
              <h2 style={{ fontFamily: DS.f.serif, fontSize: 30, fontWeight: 600, marginBottom: 8 }}>Booking Confirmed!</h2>
              <p style={{ fontSize: 15, color: DS.c.textMid, marginBottom: 24 }}>Your reservation at Grand Azure Hotel has been confirmed. A confirmation email has been sent to your address.</p>
              <div style={{ background: DS.c.beigeLight, borderRadius: DS.r.lg, padding: '20px', marginBottom: 28, display: 'inline-block', textAlign: 'left', width: '100%', maxWidth: 380 }}>
                {[['Booking ID', 'GA-2026-0847'], ['Room', 'Superior Suite'], ['Check-In', '25 Apr 2026'], ['Check-Out', '28 Apr 2026'], ['Total Paid', 'A$2,346']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13.5 }}>
                    <span style={{ color: DS.c.textMuted }}>{l}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Button variant="primary" size="md" onClick={() => setPage('customerdash')}>View My Bookings</Button>
                <Button variant="outline" size="md" onClick={() => setPage('home')}>Return Home</Button>
              </div>
            </div>
          )}
        </div>
        <Summary />
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

// ─── CONTACT / ENQUIRY PAGE ───────────────────────────────────────────────────
const ContactPage = ({ setPage }) => {
  const [faqOpen, setFaqOpen] = React.useState(null);
  const faqs = [
    { q: 'What is your check-in and check-out time?', a: 'Check-in begins at 2:00 PM and check-out is by 12:00 PM noon. Early check-in and late check-out are subject to availability and may incur additional charges.' },
    { q: 'Do you offer airport transfers?', a: 'Yes, we provide luxury airport transfers from Sydney Kingsford Smith Airport. Please contact our concierge team at least 24 hours before arrival.' },
    { q: 'Is breakfast included in room rates?', a: 'Breakfast is not automatically included but can be added to your booking. We offer a full international buffet breakfast at Azure Restaurant.' },
    { q: 'What is your cancellation policy?', a: 'Cancellations made 48 hours before check-in are fully refunded. Cancellations within 48 hours forfeit the first night\'s charge.' },
    { q: 'Do you have a fitness centre and spa?', a: 'Yes, our Azure Spa and Fitness Centre is open daily from 6 AM to 11 PM. Spa treatments can be booked through the concierge.' },
  ];

  return (
    <div style={{ paddingTop: 68, background: DS.c.ivory, minHeight: '100vh' }}>
      <div style={{ background: DS.c.navy, padding: '48px 40px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: DS.c.gold, marginBottom: 10 }}>Get In Touch</div>
          <h1 style={{ fontFamily: DS.f.serif, fontSize: 44, fontWeight: 600, color: DS.c.white }}>Contact & Enquiries</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64 }}>
          {/* Enquiry form */}
          <div className="ga-card" style={{ padding: '32px' }}>
            <h2 style={{ fontFamily: DS.f.serif, fontSize: 24, marginBottom: 22 }}>Send an Enquiry</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="Full Name" placeholder="Your name" required />
                <Input label="Email" type="email" placeholder="you@email.com.au" required />
              </div>
              <Input label="Phone" placeholder="+61 4XX XXX XXX" />
              <Select label="Enquiry Type" options={[{value:'general',label:'General Enquiry'},{value:'booking',label:'Room Booking'},{value:'event',label:'Events & Banquets'},{value:'complaint',label:'Feedback / Complaint'},{value:'corporate',label:'Corporate Rates'}]} />
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: DS.c.textMid, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Message <span style={{ color: DS.c.gold }}>*</span></label>
                <textarea className="ga-input" placeholder="Please describe your enquiry in detail…" style={{ padding: '10px 14px', minHeight: 120, resize: 'vertical' }} />
              </div>
              <Button variant="primary" size="lg" fullWidth icon="mail">Send Enquiry</Button>
            </div>
          </div>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div className="ga-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: DS.f.serif, fontSize: 20, marginBottom: 16 }}>Hotel Information</h3>
              {[
                { icon: 'map', label: 'Address', value: '1 Circular Quay, Sydney NSW 2000\nAustralia' },
                { icon: 'phone', label: 'Reservations', value: '+61 2 9250 7654' },
                { icon: 'phone', label: 'Front Desk', value: '+61 2 9250 7600' },
                { icon: 'mail', label: 'Email', value: 'reservations@grandazure.com.au' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: DS.r.md, background: `${DS.c.gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={c.icon} size={16} color={DS.c.gold} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: DS.c.textMuted, marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 14, color: DS.c.text, whiteSpace: 'pre-line' }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ga-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <img src={(window.__resources && window.__resources.imgMap) || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=400&fit=crop&q=80&auto=format"} alt="Sydney city view" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,22,40,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: DS.c.gold, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(201,169,110,0.5)' }}>
                    <Icon name="map" size={18} color={DS.c.navy} />
                  </div>
                </div>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: DS.c.textMid }}>1 Circular Quay, Sydney NSW 2000</span>
                <Button variant="outlineGold" size="xs">Get Directions</Button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <SectionHeading eyebrow="Support" title="Frequently Asked Questions" center />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((f, i) => (
              <div key={i} className="ga-card" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer' }} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span style={{ fontWeight: 500, fontSize: 14.5, color: DS.c.text }}>{f.q}</span>
                  <Icon name={faqOpen === i ? 'chevronDown' : 'chevronRight'} size={16} color={DS.c.textMuted} />
                </div>
                {faqOpen === i && <div style={{ padding: '0 20px 16px', fontSize: 14, color: DS.c.textMid, lineHeight: 1.75, borderTop: `1px solid ${DS.c.borderLight}`, paddingTop: 14 }}>{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
const AuthPage = ({ setPage }) => {
  const [mode, setMode] = React.useState('login');
  const [role, setRole] = React.useState('customer');

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left: Decorative */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden', background: '#0B1628' }}>
        <img src={(window.__resources && window.__resources.imgAuth) || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&h=1200&fit=crop&q=85&auto=format"} alt="Luxury hotel room" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(4,13,26,0.92) 0%, rgba(11,22,40,0.85) 50%, rgba(22,34,56,0.88) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div onClick={() => setPage('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 60 }}>
            <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${DS.c.gold}, ${DS.c.goldDark})`, borderRadius: DS.r.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: DS.f.serif, fontWeight: 700, fontSize: 16, color: DS.c.navy }}>GA</span>
            </div>
            <div>
              <div style={{ fontFamily: DS.f.serif, color: DS.c.white, fontSize: 18, fontWeight: 600 }}>Grand Azure</div>
              <div style={{ fontSize: 9, color: DS.c.gold, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Hotel & Resort</div>
            </div>
          </div>
          <h2 style={{ fontFamily: DS.f.serif, fontSize: 44, fontWeight: 300, color: DS.c.white, lineHeight: 1.15, marginBottom: 16 }}>Your Stay<br /><span style={{ fontWeight: 600, color: DS.c.gold }}>Awaits You</span></h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 40, maxWidth: 360 }}>Access your bookings, manage reservations, and enjoy a seamless hotel experience.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['booking', 'Manage Bookings'], ['payment', 'View Invoices'], ['user', 'Profile & History']].map(([ic, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${DS.c.gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={13} color={DS.c.gold} /></div>
                {l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 40, width: 180, height: 180, borderRadius: '50%', border: `1px solid rgba(201,169,110,0.1)` }} />
        <div style={{ position: 'absolute', bottom: 20, right: 20, width: 240, height: 240, borderRadius: '50%', border: `1px solid rgba(201,169,110,0.06)` }} />
      </div>

      {/* Right: Form */}
      <div style={{ background: DS.c.white, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 64px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ display: 'flex', gap: 4, background: DS.c.beigeLight, borderRadius: DS.r.full, padding: 4, marginBottom: 32 }}>
            {['login', 'register'].map(m => (
              <button key={m} className={`ga-tab ${mode === m ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }} onClick={() => setMode(m)}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {mode === 'login' ? (
            <div>
              <h2 style={{ fontFamily: DS.f.serif, fontSize: 28, fontWeight: 600, marginBottom: 6 }}>Welcome Back</h2>
              <p style={{ fontSize: 14, color: DS.c.textMuted, marginBottom: 28 }}>Sign in to your Grand Azure account</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input label="Email Address" type="email" placeholder="you@example.com.au" icon="mail" required />
                <Input label="Password" type="password" placeholder="••••••••" icon="lock" required />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                  <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', color: DS.c.textMid }}>
                    <input type="checkbox" style={{ accentColor: DS.c.gold }} /> Remember me
                  </label>
                  <span style={{ color: DS.c.gold, cursor: 'pointer' }}>Forgot password?</span>
                </div>
                <Button variant="primary" size="lg" fullWidth onClick={() => setPage('customerdash')}>Sign In</Button>
              </div>
              <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: DS.c.border }} />
                <span style={{ fontSize: 12, color: DS.c.textMuted }}>OR</span>
                <div style={{ flex: 1, height: 1, background: DS.c.border }} />
              </div>
              <Button variant="outline" size="lg" fullWidth onClick={() => setPage('admin')}>
                Sign In as Staff / Admin
              </Button>
            </div>
          ) : (
            <div>
              <h2 style={{ fontFamily: DS.f.serif, fontSize: 28, fontWeight: 600, marginBottom: 6 }}>Create Account</h2>
              <p style={{ fontSize: 14, color: DS.c.textMuted, marginBottom: 22 }}>Join Grand Azure for exclusive member benefits</p>
              <div style={{ display: 'flex', gap: 6, background: DS.c.beigeLight, borderRadius: DS.r.full, padding: 4, marginBottom: 18 }}>
                {['customer', 'staff'].map(r => (
                  <button key={r} className={`ga-tab ${role === r ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center', fontSize: 12 }} onClick={() => setRole(r)}>
                    {r === 'customer' ? '🏨 Guest' : '👔 Staff'}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label="First Name" placeholder="Rafiqul" required />
                  <Input label="Last Name" placeholder="Islam" required />
                </div>
                <Input label="Email" type="email" placeholder="you@example.com.au" required />
                <Input label="Phone" placeholder="+61 4XX XXX XXX" />
                <Input label="Password" type="password" placeholder="Min. 8 characters" required />
                {role === 'staff' && <Input label="Staff Code" placeholder="Enter your staff access code" icon="lock" />}
                <Button variant="primary" size="lg" fullWidth onClick={() => setPage('customerdash')}>Create Account</Button>
              </div>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: DS.c.textMuted }}>
            Protected by 256-bit SSL encryption · Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

// Export public pages
Object.assign(window, { ROOMS, BOOKINGS_SAMPLE, HomePage, RoomsPage, RoomDetailPage, BookingPage, ContactPage, AuthPage });
