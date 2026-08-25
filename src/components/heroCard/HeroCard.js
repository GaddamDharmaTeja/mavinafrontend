import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import "./HeroCard.css";

function HeroCard() {
  const [mangoes, setMangoes] = useState([]);

  useEffect(() => {
    getProducts()
      .then((items) =>
        setMangoes(
          items
            .filter((item) => item.featured)
            .slice(0, 4)
        )
      )
      .catch(() => setMangoes([]));
  }, []);

  if (!mangoes.length) {
    return null;
  }

  return (
    <section className="mango-section">

      {/* Section Header */}
      <div className="section-header">
        <div>
          <p className="mango-kicker">— ◇ —</p>

          <h2>Our Top Varieties</h2>

          <p className="mango-subtitle">
            Experience the rich taste of nature&apos;s finest mangoes.
          </p>
        </div>

        <Link
          to="/mangoes"
          className="view-all"
        >
          View All
          <span>→</span>
        </Link>
      </div>


      {/* Mango Cards */}
      <div className="mango-grid">

        {mangoes.map((mango) => (
          <article
            className="mango-card"
            key={mango.id}
          >

            {/* Image */}
            {mango.image && (
              <img
                src={mango.image}
                alt={mango.name}
              />
            )}


            {/* Glass Content */}
            <div className="card-content">

              <h3>
                {mango.name}
              </h3>

              <p>
                {mango.description ||
                  "Fresh, sweet and naturally ripened."}
              </p>

              <Link
                to={`/products/${mango.id}`}
                className="card-link"
              >
                View Details
                <span>→</span>
              </Link>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}

export default HeroCard;
