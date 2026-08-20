import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, ChevronRight, Clock3, Heart, Instagram, MapPin, Menu, Minus, Plus, ShoppingBag, Star, X } from 'lucide-react';
import './styles.css';

const menu = [
  { id: 1, name: 'Mango Millet Bowl', desc: 'Foxtail millet, ripe mango, coconut, toasted seeds', price: 295, tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85' },
  { id: 2, name: 'Bisi Bele Bath', desc: 'Heirloom rice, lentils, vegetables & our masala', price: 245, tag: 'House special', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85' },
  { id: 3, name: 'Mavina Rasam Rice', desc: 'Tangy raw mango rasam with steamed rice', price: 225, tag: 'Seasonal', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=85' },
  { id: 4, name: 'Filter Kaapi Tiramisu', desc: 'Coffee-soaked cake, jaggery cream & cocoa', price: 195, tag: 'Sweet finish', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=85' }
];

function App() {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const add = (item) => setCart((current) => {
    const found = current.find((x) => x.id === item.id);
    return found ? current.map((x) => x.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...current, { ...item, qty: 1 }];
  });
  const adjust = (id, change) => setCart((current) => current.flatMap((x) => x.id === id ? (x.qty + change > 0 ? [{ ...x, qty: x.qty + change }] : []) : [x]));
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return <>
    <header className="nav">
      <button className="brand" onClick={() => scroll('home')} aria-label="Mavina Mane home"><span className="brand-mark">m</span><span>Mavina<br/><em>Mane</em></span></button>
      <nav><button onClick={() => scroll('menu')}>Menu</button><button onClick={() => scroll('story')}>Our story</button><button onClick={() => scroll('visit')}>Visit us</button></nav>
      <button className="cart-button" onClick={() => setOpen(true)}><ShoppingBag size={18}/><span>Bag</span>{count > 0 && <b>{count}</b>}</button>
    </header>

    <main id="home">
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">Bengaluru · Est. 2024</p><h1>Food that feels<br/><i>like home.</i></h1><p className="lede">A fresh, joyful take on Karnataka’s beloved flavours — made from ingredients we know and love.</p><div className="hero-actions"><button className="primary" onClick={() => scroll('menu')}>Explore our menu <ArrowRight size={18}/></button><button className="text-link" onClick={() => scroll('story')}>Meet Mavina Mane <ChevronRight size={18}/></button></div></div>
        <div className="hero-image"><div className="sun"></div><img src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=90" alt="A colourful Indian meal served at Mavina Mane"/><span className="image-note">Made with a lot of<br/><b>love & a little ghee</b></span></div>
        <span className="mango mango-one">✦</span><span className="mango mango-two">✦</span>
      </section>

      <section className="marquee"><span>Wholesome ingredients</span><i>✦</i><span>Unhurried cooking</span><i>✦</i><span>Big home energy</span><i>✦</i><span>Wholesome ingredients</span></section>

      <section className="intro" id="story"><p className="eyebrow">Rooted in nostalgia</p><h2>From our <i>amma’s</i> kitchen<br/>to your favourite table.</h2><div className="intro-grid"><p>We grew up around lunch tables that always had room for one more. Mavina Mane brings that feeling to the city — seasonal, soul-filling plates made the way they ought to be.</p><a href="#story">Our little story <ArrowRight size={17}/></a></div></section>

      <section className="featured" id="menu"><div className="section-head"><div><p className="eyebrow">The good stuff</p><h2>Today’s <i>favourites</i></h2></div><button className="outline" onClick={() => scroll('full-menu')}>See full menu <ArrowRight size={17}/></button></div><div className="menu-grid">{menu.map((item) => <article className="dish" key={item.id}><div className="dish-image"><img src={item.image} alt={item.name}/><span>{item.tag}</span><button aria-label={`Add ${item.name} to bag`} onClick={() => add(item)}><Plus size={19}/></button></div><div className="dish-info"><h3>{item.name}</h3><p>{item.desc}</p><strong>₹{item.price}</strong></div></article>)}</div></section>

      <section className="experience"><div className="experience-image"><img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1100&q=85" alt="Warm Mavina Mane dining room"/></div><div className="experience-copy"><p className="eyebrow">Come as you are</p><h2>Your neighbourhood<br/><i>happy place.</i></h2><p>Drop in for a long lunch, pick up dinner for the gang, or linger over another kaapi. There’s always something warm waiting for you.</p><button className="primary light" onClick={() => scroll('visit')}>Find a table <ArrowRight size={18}/></button><div className="rating"><span>4.8 <Star size={16} fill="currentColor"/></span><p>loved by 1,200+ hungry humans</p></div></div></section>

      <section className="full-menu" id="full-menu"><p className="eyebrow">A table for every mood</p><h2>Good food, no <i>fuss.</i></h2><div className="category-row"><span>Breakfast</span><span>Lunch plates</span><span>Small bites</span><span>Sweet things</span><span>Kaapi & coolers</span></div></section>

      <section className="visit" id="visit"><div><p className="eyebrow">Drop by</p><h2>We saved you<br/><i>a seat.</i></h2></div><div className="location"><MapPin size={24}/><p><b>12, 5th Cross, Indiranagar</b><br/>Bengaluru, Karnataka 560038</p><p><Clock3 size={16}/> Tue–Sun · 8am–10:30pm</p><button className="outline">Get directions <ArrowRight size={17}/></button></div></section>
    </main>
    <footer><div className="footer-brand"><span className="brand-mark">m</span><h2>Mavina <i>Mane</i></h2></div><p>Good food. Good people. Good days.</p><div><a href="#instagram" aria-label="Instagram"><Instagram size={19}/></a><a href="#love" aria-label="Love"><Heart size={19}/></a></div><small>© 2026 Mavina Mane · Made with love in Bengaluru</small></footer>

    {open && <div className="cart-overlay" onClick={() => setOpen(false)}><aside className="cart" onClick={(e) => e.stopPropagation()}><div className="cart-top"><h2>Your <i>bag</i></h2><button onClick={() => setOpen(false)} aria-label="Close bag"><X/></button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt=""/><div><h3>{item.name}</h3><p>₹{item.price}</p><div className="qty"><button onClick={() => adjust(item.id, -1)}><Minus size={14}/></button><span>{item.qty}</span><button onClick={() => adjust(item.id, 1)}><Plus size={14}/></button></div></div><b>₹{item.price * item.qty}</b></div>)}</div><div className="checkout"><div><span>Subtotal</span><b>₹{total}</b></div><button className="primary">Continue to checkout <ArrowRight size={18}/></button></div></> : <div className="empty"><ShoppingBag size={34}/><h3>Your bag is feeling light.</h3><p>Add something lovely from our menu.</p><button className="outline" onClick={() => {setOpen(false);scroll('menu')}}>Browse menu</button></div>}</aside></div>}
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
