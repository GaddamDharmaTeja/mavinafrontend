import {useEffect,useState} from "react";
import {getContent} from "../../services/productService";
import "./Reviews.css";
function Reviews(){const [reviews,setReviews]=useState([]);useEffect(()=>{getContent("reviews").then(item=>setReviews(Array.isArray(item.value?.items)?item.value.items:[])).catch(()=>setReviews([]));},[]);if(!reviews.length)return null;return <section className="reviews"><div className="reviews-container"><div className="reviews-title"><h2>What Our Customers Say</h2></div><div className="review-grid">{reviews.map((item,index)=><div className="review-card" key={`${item.name}-${index}`}><div className="quote">“</div><p>{item.review}</p><div className="stars">★★★★★</div><div className="customer"><div className="avatar">{item.name?.charAt(0)}</div><div><h4>{item.name}</h4><span>{item.city}</span></div></div></div>)}</div></div></section>}
export default Reviews;
