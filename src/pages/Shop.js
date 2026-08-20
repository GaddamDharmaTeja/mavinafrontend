import { useEffect, useMemo, useState } from "react";
import { FiBox, FiGift, FiFeather, FiTruck, FiPackage, FiAward, FiArrowRight } from "react-icons/fi";
import "./Shop.css";
import ShopBanner from "../components/shop/ShopBanner";
import ShopSidebar from "../components/sidebar/ShopSidebar";
import ProductCard from "../components/product/ProductCard";
import Newsletter from "../components/newsletter/Newsletter";
import PageLayout from "../components/layout/PageLayout";
import { useShop } from "../context/ShopContext";
import { getCategories, getProducts } from "../services/productService";
import banner from "../assets/backgroundimages/mainhero.png";

const benefits = [[FiFeather,"Farm Fresh","From trusted orchards"],[FiFeather,"Naturally Ripened","No artificial ripening"],[FiPackage,"Safe Packaging","Handled with care"],[FiTruck,"On-time Delivery","Right to your doorstep"],[FiAward,"Best Quality","Handpicked mangoes"]];

function Shop(){
  const [selected,setSelected]=useState("All Mangoes"); const [maxPrice,setMaxPrice]=useState(Infinity); const [sort,setSort]=useState("Popularity"); const [catalog,setCatalog]=useState([]); const [categories,setCategories]=useState([]);
  const {addToCart,wishlist,toggleWishlist}=useShop();
  useEffect(()=>{let active=true; Promise.all([getProducts(),getCategories()]).then(([items,groups])=>{if(active){setCatalog(items);setCategories(groups);}}).catch(()=>{if(active){setCatalog([]);setCategories([]);}}); return()=>{active=false;};},[]);
  const visible=useMemo(()=>catalog.filter(product=>(selected==="All Mangoes"||product.variety===selected)&&product.price<=maxPrice).sort((a,b)=>sort==="Price: Low to High"?a.price-b.price:sort==="Price: High to Low"?b.price-a.price:0),[catalog,selected,maxPrice,sort]);
  return <PageLayout><div className="shop-page">
    <ShopBanner banner={banner}/>
    <section className="shop-benefits">{benefits.map(([Icon,title,text])=><article key={title}><Icon/><span><b>{title}</b><small>{text}</small></span></article>)}</section>
    <main className="shop-content">
      <ShopSidebar categories={categories} selected={selected} onSelect={setSelected} maxPrice={maxPrice} setMaxPrice={setMaxPrice} onClear={()=>{setSelected("All Mangoes");setMaxPrice(Infinity);}}/>
      <section className="products-section" id="mangoes">
        <div className="shop-toolbar"><span>Showing {visible.length?`1-${visible.length}`:0} of {catalog.length} results</span><label>Sort by: <select value={sort} onChange={event=>setSort(event.target.value)}><option>Popularity</option><option>Price: Low to High</option><option>Price: High to Low</option></select></label></div>
        <div className="products-grid">{visible.map(product=><ProductCard key={product.id} product={product} onAdd={addToCart} isSaved={wishlist.some(item=>item.id===product.id)} onToggleWishlist={toggleWishlist}/>)}</div>
        {!visible.length&&<p className="empty-products">No products match these filters.</p>}
        <section className="shop-promotions">
          <article className="custom-box"><div><span>BUILD YOUR OWN</span><h2>Create your<br/>perfect <em>mango box</em></h2><p>Mix your favourite mango varieties and get them delivered in a custom box.</p><button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Build Your Box <FiArrowRight/></button></div><FiBox className="promo-icon"/></article>
          <article className="gift-box"><div><span>GIFT HEALTH &amp; HAPPINESS</span><h2>Mango Gift Boxes<br/><em>For Every Occasion</em></h2><p>Perfect for festivals, corporate gifts, and special moments.</p><button>Explore Gift Boxes <FiArrowRight/></button></div><FiGift className="promo-icon"/></article>
        </section>
      </section>
    </main>
    <Newsletter/>
  </div></PageLayout>;
}
export default Shop;
