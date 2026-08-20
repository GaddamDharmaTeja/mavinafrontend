import {useEffect,useState} from "react";
import {getContent} from "../../services/productService";
import "./WhyChoose.css";
function WhyChoose(){const [data,setData]=useState(null);useEffect(()=>{getContent("why").then(item=>setData(item.value)).catch(()=>setData(null));},[]);if(!data?.items?.length)return null;return <section className="whyChoose"><div className="why-container"><div className="why-title"><h2>{data.title}</h2><div className="divider"/></div><div className="why-row">{data.items.map((item,index)=><div className="why-item" key={`${item.title}-${index}`}><div className="why-icon">{item.icon}</div><div><h4>{item.title}</h4><p>{item.subtitle}</p></div></div>)}</div></div></section>}
export default WhyChoose;
