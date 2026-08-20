import {useEffect,useState} from "react";
import {FaPaperPlane} from "react-icons/fa";
import {getContent} from "../../services/productService";
import "./Newsletter.css";
function Newsletter(){const [email,setEmail]=useState("");const [message,setMessage]=useState("");const [data,setData]=useState(null);useEffect(()=>{getContent("newsletter").then(item=>setData(item.value)).catch(()=>setData(null));},[]);if(!data)return null;function submit(event){event.preventDefault();setMessage(data.successMessage||"Thank you for subscribing.");setEmail("");}return <section className="newsletter"><div className="newsletter-container"><div className="newsletter-content"><h2>{data.title}</h2><p>{data.description}</p></div><form className="newsletter-form" onSubmit={submit}><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={data.placeholder||"Your email address"} required/><button type="submit"><FaPaperPlane/> {data.buttonLabel||"Subscribe"}</button>{message&&<span className="newsletter-message">{message}</span>}</form></div></section>}
export default Newsletter;
