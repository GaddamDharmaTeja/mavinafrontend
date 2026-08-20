import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ShopProvider } from "./context/ShopContext";
import Home from "./components/home/Home";
import Shop from "./pages/Shop";
import Mangoes from "./components/mangoes/Mangoes";
import Cart from "./pages/Cart";
import ContentPage from "./pages/ContentPage";
import AdminRegister from "./pages/AdminRegister";
import { Blog, Contact, Faq, Shipping, Wishlist } from "./pages/CommercePages";
import CustomerOrders from "./pages/CustomerOrders";
import { DynamicAbout, DynamicTrackOrder } from "./pages/DynamicPages";
import ProfilePage from "./pages/ProfilePage";
import PaymentCheckout from "./pages/ModernCheckout";
import { AdminDashboard, AdminLogin } from "./pages/Admin";
import UserAuth from "./pages/UserAuth";
import SellerApply from "./pages/SellerApply";
import Farms from "./pages/Farms";
import "./App.css";
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
function App() { 
    return <ShopProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<main className="app-loading">Loading fresh mangoes...</main>}>
        <Routes><Route path="/" element={<Home/>}/>
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/mangoes" element={<Mangoes/>}/>
        <Route path="/products/:productId" element={<ProductDetails/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<PaymentCheckout/>}/>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/login" element={<UserAuth/>}/>
        <Route path="/sell-with-us" element={<SellerApply/>}/>
        <Route path="/farms" element={<Farms/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/orders" element={<CustomerOrders/>}/>
        <Route path="/wishlist" element={<Wishlist/>}/>
        <Route path="/track-order" element={<DynamicTrackOrder/>}/>
        <Route path="/about" element={<DynamicAbout/>}/>
        <Route path="/gallery" element={<DynamicAbout/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/faqs" element={<Faq/>}/>
        <Route path="/shipping" element={<Shipping/>}/>
        <Route path="/admin/register" element={<AdminRegister />} />

        <Route path="*" element={<ContentPage title="Page not found" description="The page you requested has moved or does not exist."/>}/>
        </Routes>
        </Suspense>
        </BrowserRouter>
        </ShopProvider>
        ; 
    }
export default App;
