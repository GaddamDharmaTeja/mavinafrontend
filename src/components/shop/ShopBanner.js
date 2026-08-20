import { FiArrowDownRight, FiCheck, FiMapPin } from "react-icons/fi";
import "./ShopBanner.css";

function ShopBanner({ banner }) {
  const image = banner?.src || banner;

  return <section className="shop-collection-hero">
    <div className="shop-collection-copy">
      <p className="shop-collection-kicker"><span />Seasonal collection</p>
      <h1>Pick a box<br /><em>worth waiting for.</em></h1>
      <p className="shop-collection-intro">Browse orchard-picked mangoes, compare varieties, and choose the harvest that suits your table.</p>
      <a className="shop-collection-cta" href="#mangoes">Browse the harvest <FiArrowDownRight /></a>
      <ul className="shop-collection-notes">
        <li><FiCheck /> Harvested to order</li>
        <li><FiMapPin /> Shipped from Karnataka</li>
      </ul>
    </div>
    <div className="shop-collection-art">
      <div className="shop-collection-frame"><img src={image} alt="Mangoes ready for harvest" /></div>
      <div className="shop-collection-stamp"><b>100%</b><span>naturally<br />ripened</span></div>
      <p className="shop-collection-caption">This week’s<br /><strong>orchard selection</strong></p>
    </div>
  </section>;
}

export default ShopBanner;
