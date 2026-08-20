import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaPlus } from "react-icons/fa";
import "./ProductCard.css";

function ProductCard({ product, onAdd, isSaved, onToggleWishlist }) {
  const available = product.stock !== 0 && product.inStock !== false;
  return <article className="product-card">
    <button className="wishlist" onClick={()=>onToggleWishlist(product)} aria-label={`${isSaved ? "Remove" : "Save"} ${product.name}`}>{isSaved?<FaHeart/>:<FaRegHeart/>}</button>
    <Link to={`/products/${product.id}`}><img className="product-image" src={product.image} alt={product.name}/></Link>
    <div className="product-content"><h3><Link to={`/products/${product.id}`}>{product.name} Mangoes</Link></h3><p className="product-origin">{product.origin || product.location || "Farm fresh"}</p><p className="price"><strong>₹{product.price}</strong> <span>/ {product.weight || "kg"}</span></p><small className={available ? "stock in-stock" : "stock"}>● {available ? "In Stock" : "Out of Stock"}</small><button className="cart-btn" onClick={()=>onAdd(product)} aria-label={`Add ${product.name} to cart`}><FaPlus/></button></div>
  </article>;
}
export default ProductCard;
