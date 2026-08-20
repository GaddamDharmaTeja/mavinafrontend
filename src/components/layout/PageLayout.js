import Header from "../header/Header";
import Footer from "../footer/FooterDynamic";
import { useShop } from "../../context/ShopContext";
function PageLayout(
    { 
        children 
    }
)
 { 
    const { cart } = useShop();
     return <>
     <Header cartCount={cart.reduce((total, item) => total + item.quantity, 0)} />
    
    {children}
    <Footer /></>; 
}
export default PageLayout;
