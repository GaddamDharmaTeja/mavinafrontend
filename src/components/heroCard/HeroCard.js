import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import "./HeroCard.css";
function HeroCard(){const [mangoes,setMangoes]=useState([]);useEffect(()=>{getProducts().then(items=>setMangoes(items.filter(item=>item.featured).slice(0,4))).catch(()=>setMangoes([]));},[]);if(!mangoes.length)return null;return <section className="mango-section"><div className="section-header"><h2>Our Top Varieties</h2><Link to="/mangoes" className="view-all">View All →</Link></div><div className="mango-grid">{mangoes.map(mango=><article className="mango-card" key={mango.id}>{mango.image&&<img src={mango.image} alt={mango.name}/>}<div className="card-content"><h3>{mango.name}</h3><p>{mango.description}</p><Link to={`/products/${mango.id}`}>→</Link></div></article>)}</div></section>}
export default HeroCard;
