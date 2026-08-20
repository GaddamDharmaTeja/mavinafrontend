import "./MangoVarieties.css";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

const DEFAULT_VARIETIES = [
  {
    name: "Alphonso",
    tag: "The king of mangoes",
    price: "₹899",
    unit: "/ dozen",
    description:
      "Sun-ripened on the branch, hand-sorted, and packed within 24 hours of harvest for maximum sweetness and aroma.",
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=700&q=80",
  },
  {
    name: "Kesar",
    tag: "Saffron-sweet & fragrant",
    price: "₹649",
    unit: "/ dozen",
    description:
      "Grown in the foothills of the Girnar range, prized for its deep saffron colour and honeyed aroma.",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=700&q=80",
  },
  {
    name: "Banganapalli",
    tag: "Large, mild & juicy",
    price: "₹549",
    unit: "/ dozen",
    description:
      "A gentle, mild sweetness with a fibre-free bite, best enjoyed sliced fresh or blended into juice.",
    image: "https://images.unsplash.com/photo-1605027990121-3b176ba1a1e6?w=700&q=80",
  },
  {
    name: "Dasheri",
    tag: "Fibre-free, honey sweet",
    price: "₹599",
    unit: "/ dozen",
    description:
      "A north Indian classic with a thin skin and buttery, fibre-free flesh that eats like dessert.",
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=701&q=80",
  },
  {
    name: "Totapuri",
    tag: "Tangy, firm & vibrant",
    price: "₹449",
    unit: "/ dozen",
    description:
      "Firm and tangy with a signature curved beak, perfect for pickles, salads, and chutneys.",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=701&q=80",
  },
];

const AUTOPLAY_MS = 3500;

function MangoVarieties({ varieties = DEFAULT_VARIETIES, onAdd }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % varieties.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, varieties.length]);

  const goTo = (i) => setActive(((i % varieties.length) + varieties.length) % varieties.length);

  return (
    <section
      className="mango-varieties"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mango-varieties-inner">
        <span className="mango-varieties-eyebrow">Straight from the orchard</span>
        <h2 className="mango-varieties-title">Our mango varieties</h2>
        <p className="mango-varieties-subtitle">
          Five handpicked cultivars, ripened naturally and delivered farm-fresh to your door.
        </p>

        <div className="mango-varieties-stage">
          <div className="mango-varieties-track-wrap">
            <div
              className="mango-varieties-track"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {varieties.map((v) => (
                <div className="mango-slide" key={v.name}>
                  <div className="mango-slide-image">
                    <img src={v.image} alt={v.name} draggable="false" />
                  </div>
                  <div className="mango-slide-body">
                    <span className="mango-slide-tag">{v.tag}</span>
                    <h3>{v.name}</h3>
                    <p>{v.description}</p>
                    <div className="mango-slide-price">
                      <b>{v.price}</b>
                      <span>{v.unit}</span>
                    </div>
                    <button className="mango-slide-cta" onClick={() => onAdd && onAdd(v)}>
                      Add to cart <FiArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="mango-arrow mango-arrow-left"
            aria-label="Previous variety"
            onClick={() => goTo(active - 1)}
          >
            <FiChevronLeft />
          </button>
          <button
            className="mango-arrow mango-arrow-right"
            aria-label="Next variety"
            onClick={() => goTo(active + 1)}
          >
            <FiChevronRight />
          </button>
        </div>

        <div className="mango-dots">
          {varieties.map((v, i) => (
            <button
              key={v.name}
              className={`mango-dot ${active === i ? "active" : ""}`}
              aria-label={`Go to ${v.name}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MangoVarieties;
