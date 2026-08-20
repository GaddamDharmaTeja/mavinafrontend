import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaShieldAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { assetUrl, getContent } from "../../services/productService";
import "./Footer.css";

const defaultSections = [
  {
    title: "Explore",
    links: [
      { label: "Shop", url: "/shop" },
      { label: "Mango varieties", url: "/mangoes" },
      { label: "Our farms", url: "/farms" },
      { label: "Our story", url: "/about" },
    ],
  },
  {
    title: "Customer care",
    links: [
      { label: "Track order", url: "/track-order" },
      { label: "My account", url: "/profile" },
      { label: "Orders", url: "/orders" },
      { label: "Contact us", url: "/contact" },
    ],
  },
];

const fallback = {
  name: "Maviina Mane",
  description: "Naturally ripened mangoes, carefully delivered from our farm to your home.",
  phone: "+91 98765 43210",
  email: "support@maviinamane.com",
  location: "Andhra Pradesh, India",
  features: ["Farm fresh", "Secure payments", "Fast delivery"],
  sections: defaultSections,
  legalText: "All rights reserved.",
  theme: "forest",
};

const external = (url) => /^https?:\/\//i.test(url || "");

function SmartLink({ url, children }) {
  return external(url) ? (
    <a href={url} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link to={url || "/"}>{children}</Link>
  );
}

export default function FooterDynamic() {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    getContent("footer")
      .then((item) =>
        setData({
          ...fallback,
          ...(item.value || {}),
          features:
            Array.isArray(item.value?.features) && item.value.features.length
              ? item.value.features
              : fallback.features,
          sections:
            Array.isArray(item.value?.sections) && item.value.sections.length
              ? item.value.sections
              : fallback.sections,
        })
      )
      .catch(() => {});
  }, []);

  const social = [
    ["Facebook", data.facebook, FaFacebookF],
    ["Instagram", data.instagram, FaInstagram],
    ["WhatsApp", data.whatsapp, FaWhatsapp],
  ].filter(([, url]) => url);

  return (
    <footer className={`footer footer-${data.theme || "forest"}`}>
      <section className="footer-features">
        {data.features.filter(Boolean).map((feature) => (
          <span key={feature}>
            <FaShieldAlt /> {feature}
          </span>
        ))}
      </section>

      <div className="footer-main">
        <div className="footer-grid">
          <section className="footer-brand">
            {data.brandImage && (
              <img
                src={assetUrl(data.brandImage)}
                alt={data.name}
              />
            )}
            <h2>{data.name}</h2>
            <p>{data.description}</p>
            {social.length > 0 && (
              <div className="social-icons">
                {social.map(([label, url, Icon]) => (
                  <a href={url} aria-label={label} target="_blank" rel="noreferrer" key={label}>
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </section>

          {data.sections
            .filter((section) => section?.title)
            .map((section) => (
              <section key={section.title}>
                <h3>{section.title}</h3>
                {(section.links || [])
                  .filter((link) => link?.label)
                  .map((link, index) => (
                    <SmartLink url={link.url} key={`${link.label}-${index}`}>
                      {link.label}
                    </SmartLink>
                  ))}
              </section>
            ))}

          <section>
            <h3>Contact</h3>
            {data.phone && (
              <p>
                <FaPhoneAlt /> {data.phone}
              </p>
            )}
            {data.email && (
              <p>
                <FaEnvelope /> {data.email}
              </p>
            )}
            {data.location && <p>{data.location}</p>}
          </section>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {data.year || new Date().getFullYear()} {data.name}. {data.legalText || "All rights reserved."}
        </span>
      </div>
    </footer>
  );
}
