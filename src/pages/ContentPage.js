import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import "./ContentPage.css";
function ContentPage({ title, description }) { return <PageLayout><main className="content-page"><p className="eyebrow">Maviina Mane</p><h1>{title}</h1><p>{description}</p><Link to="/shop" className="primary-link">Shop fresh mangoes</Link></main></PageLayout>; }
export default ContentPage;
