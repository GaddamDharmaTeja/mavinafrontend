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
  [FiFeather, "Farm Direct", "Straight from our orchards to you"],
  [FiShield, "100% Natural", "No chemicals. No preservatives."],
  [FiFeather, "Freshly Harvested", "Picked at the peak of perfection"],
  [FiHeart, "Handpicked With Care", "Selected with love and care"],
];

const REVEAL_DELAYS = [
  "reveal-delay-1",
  "reveal-delay-2",
  "reveal-delay-3",
  "reveal-delay-4",
  "reveal-delay-5",
];

function getRevealDelayClass(index) {
  return REVEAL_DELAYS[index] ?? REVEAL_DELAYS[REVEAL_DELAYS.length - 1];
}

function Home() {
  const navigate = useNavigate();

  const { cart, wishlist, addToCart, toggleWishlist } = useShop();

  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setCatalog)
      .catch((error) => {
        setCatalog([]);
        setApiError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

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

  const selected = catalog.slice(0, 4);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleImageError = (event) => {
    event.currentTarget.src = heroImage.src || heroImage;
  };

  return (
    <>
      <Header cartCount={cartCount} />

      {/* Hero shell stays visible; children use scroll-reveal */}
      <section
        className="home-hero"
        style={{
          backgroundImage: `url(${heroImage.src || heroImage})`,
        }}
      >
        <div className="home-hero-shade" />

        <div className="home-hero-inner">
          <div className="home-copy">
            <h1 className="reveal-left reveal-delay-1">
              Pure. Natural.
              <br />
              <em>Mangoes.</em>
            </h1>

            <p className="reveal-left reveal-delay-2">
              Handpicked from our orchards,
              <br />
              delivered to your doorstep.
            </p>

            <div className="home-actions reveal-left reveal-delay-3">
              <button onClick={() => navigate("/shop")}>
                Shop Now
                <FiArrowRight />
              </button>

              <button onClick={() => navigate("/mangoes")}>
                Explore Orchards
                <span>◉</span>
              </button>
            </div>
          </div>

          <div className="home-promises">
            {promises.map(([Icon, title, text], index) => (
              <article
                key={title}
                className={`reveal-right ${getRevealDelayClass(index)}`}
              >
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
                <i />
              </article>
            ))}
          </div>
        </div>
      </section>

      <main className="home-main">
        <section className="home-promos" aria-label="Seasonal offers">
          <article className="reveal-left reveal-delay-1">
            <span>JUICY10</span>
            <h3>10% off your first mango box</h3>
            <p>Fresh harvests, packed with care.</p>
            <Link to="/shop">
              Shop the harvest <FiArrowRight />
            </Link>
          </article>

          <article className="reveal-center reveal-delay-2">
            <span>FREE DELIVERY</span>
            <h3>Farm fresh, straight to your door</h3>
            <p>Free delivery on orders above ₹999.</p>
            <Link to="/shop">
              Explore products <FiArrowRight />
            </Link>
          </article>

          <article className="reveal-right pickle-promo reveal-delay-3">
            <span>NEW THIS SEASON</span>
            <h3>Lovingly made mango pickles</h3>
            <p>Traditional recipes with orchard-fresh fruit.</p>
            <Link to="/shop?category=pickles">
              Discover pickles <FiArrowRight />
            </Link>
          </article>
        </section>

        <section className="home-section">
          <div className="reveal-center">
            <p className="section-kicker">— ◇ —</p>
            <h2>Our Mango Variants</h2>
            <p className="section-subtitle">
              Experience the rich taste of nature’s finest mangoes.
            </p>
          </div>

          {loading && (
            <div className="home-skeleton-grid">
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="home-skeleton" key={item} />
              ))}
            </div>
          )}

          {apiError && !loading && (
            <div className="home-api-error">
              <b>We’re refreshing the orchard catalogue.</b>
              <span>{apiError}</span>
              <button onClick={() => window.location.reload()}>Try again</button>
            </div>
          )}

          <div className="home-variant-grid">
            {varieties.map((product, index) => (
              console.log("Rendering product:", product),
              <article
                key={product.id}
                className={`home-variant ${
                  index % 2 === 0 ? "reveal-left" : "reveal-right"
                } ${getRevealDelayClass(index)}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  onError={handleImageError}
                />

                <div className="home-variant-content">
                  <h3>{product.name}</h3>
                  <p>
                    {product.description ||
                      "Fresh, sweet and naturally ripened."}
                  </p>
                  <Link to={`/products/${product.id}`}>
                    View Details
                    <FiArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {!varieties.length && (
            <p className="empty-products">
              No mango varieties are available right now.
            </p>
          )}
        </section>

        {/* <section className="home-section selected">
          <div className="reveal-center">
            <p className="section-kicker">— ◇ —</p>
            <h2>Selected Products</h2>
            <p className="section-subtitle">
              Handpicked mangoes, packed with care.
            </p>
          </div>

          <div className="home-product-grid">
            {selected.map((product, index) => {
              const saved = wishlist.some((item) => item.id === product.id);

              return (
                <article
                  className={`home-product ${
                    index % 2 === 0 ? "reveal-left" : "reveal-right"
                  } ${getRevealDelayClass(index)}`}
                  key={product.id}
                >
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    aria-label="Save product"
                    className={saved ? "is-saved" : undefined}
                  >
                    {saved ? "♥" : "♡"}
                  </button>

                  <Link
                    to={`/products/${product.id}`}
                    className="home-product-media"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={handleImageError}
                    />
                  </Link>

                  <div className="home-product-content">
                    <h3>{product.name}</h3>
                    <p>{product.weight || "Fresh harvest"}</p>

                    <div className="home-product-meta">
                      <strong>₹{product.price}</strong>

                      <button
                        type="button"
                        className="home-add"
                        onClick={() => addToCart(product)}
                      >
                        <FiShoppingCart />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!selected.length && (
            <p className="empty-products">Products are loaded from the API.</p>
          )}
        </section> */}

        <section className="delivery-banner">
          <img
            className="reveal-left"
            src={heroImage.src || heroImage}
            alt="Fresh mangoes"
          />

          <div className="reveal-center">
            <h2>
              Taste Nature’s Best
              <br />
              Delivered <em>Fresh to You!</em>
            </h2>
            <p>From our orchards to your home.</p>
          </div>

          <div className="delivery-cta reveal-right">
            <button onClick={() => navigate("/shop")}>
              Shop Now
              <FiArrowRight />
            </button>

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
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
