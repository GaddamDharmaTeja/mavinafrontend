import "./Home.css";
import heroImage from "../../assets/backgroundimages/mainhero.png";
import Header from "../header/Header";
import Footer from "../footer/FooterDynamic";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiHeart,
  FiFeather,
  FiShield,
  FiShoppingCart,
} from "react-icons/fi";
import { getProducts } from "../../services/productService";
import { useShop } from "../../context/ShopContext";

const promises = [
  [
    FiFeather,
    "Farm Direct",
    "Straight from our orchards to you",
  ],
  [
    FiShield,
    "100% Natural",
    "No chemicals. No preservatives.",
  ],
  [
    FiFeather,
    "Freshly Harvested",
    "Picked at the peak of perfection",
  ],
  [
    FiHeart,
    "Handpicked With Care",
    "Selected with love and care",
  ],
];

function Home() {
  const navigate = useNavigate();

  const {
    cart,
    wishlist,
    addToCart,
    toggleWishlist,
  } = useShop();

  const [catalog, setCatalog] = useState([]);

  /*
   * Load products
   */
  useEffect(() => {
    getProducts()
      .then(setCatalog)
      .catch(() => setCatalog([]));
  }, []);

  /*
   * Get unique mango varieties
   */
  const varieties = useMemo(() => {
    return Object.values(
      catalog.reduce((out, item) => {
        const key = item.variety || item.name;

        return out[key]
          ? out
          : {
              ...out,
              [key]: item,
            };
      }, {})
    ).slice(0, 5);
  }, [catalog]);

  /*
   * Selected products
   */
  const selected = catalog.slice(0, 4);

  /*
   * Cart count
   */
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      {/* =========================================
          HEADER
      ========================================= */}

      <Header cartCount={cartCount} />


      {/* =========================================
          HERO SECTION
      ========================================= */}

      <section
        className="home-hero"
        style={{
          backgroundImage: `url(${heroImage.src || heroImage})`,
        }}
      >
        <div className="home-hero-shade" />

        <div className="home-hero-inner">

          {/* Hero Content */}

          <div className="home-copy">

            <h1>
              Pure. Natural.
              <br />
              <em>Mangoes.</em>
            </h1>

            <p>
              Handpicked from our orchards,
              <br />
              delivered to your doorstep.
            </p>

            <div className="home-actions">

              <button
                onClick={() => navigate("/shop")}
              >
                Shop Now
                <FiArrowRight />
              </button>

              <button
                onClick={() => navigate("/mangoes")}
              >
                Explore Orchards
                <span>◉</span>
              </button>

            </div>

          </div>


          {/* Hero Promise Cards */}

          <div className="home-promises">

            {promises.map(
              ([Icon, title, text]) => (
                <article key={title}>

                  <Icon />

                  <h3>{title}</h3>

                  <p>{text}</p>

                  <i />

                </article>
              )
            )}

          </div>

        </div>
      </section>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="home-main">


        {/* =========================================
            MANGO VARIANTS
        ========================================= */}

        <section className="home-section">

          <p className="section-kicker">
            — ◇ —
          </p>

          <h2>
            Our Mango Variants
          </h2>

          <p className="section-subtitle">
            Experience the rich taste of nature’s
            finest mangoes.
          </p>


          {/* Glassmorphism Mango Cards */}

          <div className="home-variant-grid">

            {varieties.map((product) => (

              <article
                key={product.id}
                className="home-variant"
              >

                {/* Mango Image */}

                <img
                  src={product.image}
                  alt={product.name}
                />


                {/* Glass Content */}

                <div className="home-variant-content">

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description ||
                      "Fresh, sweet and naturally ripened."}
                  </p>

                  <Link
                    to={`/products/${product.id}`}
                  >
                    View Details
                    <FiArrowRight />
                  </Link>

                </div>

              </article>

            ))}

          </div>


          {/* Empty State */}

          {!varieties.length && (
            <p className="empty-products">
              No mango varieties are available
              right now.
            </p>
          )}

        </section>


        {/* =========================================
            SELECTED PRODUCTS
        ========================================= */}

        <section className="home-section selected">

          <p className="section-kicker">
            — ◇ —
          </p>

          <h2>
            Selected Products
          </h2>

          <p className="section-subtitle">
            Handpicked mangoes, packed with care.
          </p>


          <div className="home-product-grid">

            {selected.map((product) => {

              const saved = wishlist.some(
                (item) =>
                  item.id === product.id
              );

              return (

                <article
                  className="home-product"
                  key={product.id}
                >

                  {/* Wishlist */}

                  <button
                    onClick={() =>
                      toggleWishlist(product)
                    }
                    aria-label="Save product"
                  >
                    {saved ? "♥" : "♡"}
                  </button>


                  {/* Product Image */}

                  <Link
                    to={`/products/${product.id}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </Link>


                  {/* Product Name */}

                  <h3>
                    {product.name}
                  </h3>


                  {/* Weight */}

                  <p>
                    {product.weight ||
                      "Fresh harvest"}
                  </p>


                  {/* Price */}

                  <strong>
                    ₹{product.price}
                  </strong>


                  {/* Add To Cart */}

                  <button
                    className="home-add"
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    <FiShoppingCart />
                    Add to Cart
                  </button>

                </article>

              );
            })}

          </div>


          {/* Empty State */}

          {!selected.length && (
            <p className="empty-products">
              Products are loaded from the API.
            </p>
          )}

        </section>


        {/* =========================================
            DELIVERY BANNER
        ========================================= */}

        <section className="delivery-banner">

          <img
            src={heroImage.src || heroImage}
            alt="Fresh mangoes"
          />


          {/* Delivery Content */}

          <div>

            <h2>
              Taste Nature’s Best
              <br />
              Delivered{" "}
              <em>Fresh to You!</em>
            </h2>

            <p>
              From our orchards to your home.
            </p>

          </div>


          {/* Shop Button */}

          <button
            onClick={() => navigate("/shop")}
          >
            Shop Now
            <FiArrowRight />
          </button>


          {/* Delivery Features */}

          <div className="delivery-points">

            <span>
              ♢
              <small>
                Secure
                <br />
                Packaging
              </small>
            </span>

            <span>
              ♧
              <small>
                On-time
                <br />
                Delivery
              </small>
            </span>

            <span>
              ⚙
              <small>
                Satisfaction
                <br />
                Guaranteed
              </small>
            </span>

          </div>

        </section>

      </main>


      {/* =========================================
          FOOTER
      ========================================= */}

      <Footer />
    </>
  );
}

export default Home;