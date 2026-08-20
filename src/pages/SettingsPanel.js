import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiSettings,
  FiTrash2,
  FiUploadCloud,
} from "react-icons/fi";
import { assetUrl } from "../services/productService";

const groups = {
  settings: {
    label: "Store details",
    help: "Your brand and core store information.",
    fields: [
      ["name", "Store name"],
      ["tagline", "Tagline"],
      ["supportEmail", "Support email"],
      ["supportPhone", "Support phone"],
    ],
  },
  home: {
    label: "Homepage",
    help: "The editorial message customers first see.",
    fields: [
      ["eyebrow", "Eyebrow"],
      ["title", "Hero title"],
      ["description", "Hero description"],
      ["primaryCta", "Primary button text"],
      ["secondaryCta", "Secondary button text"],
    ],
  },
  footer: {
    label: "Footer & social",
    help: "Edit every part of the public footer.",
    fields: [],
  },
  contact: {
    label: "Contact page",
    help: "Customer-facing contact information.",
    fields: [
      ["title", "Page title"],
      ["description", "Intro text"],
      ["email", "Email"],
      ["phone", "Phone"],
      ["address", "Address"],
    ],
  },
  shipping: {
    label: "Shipping",
    help: "General delivery promise shown to customers.",
    fields: [
      ["title", "Shipping title"],
      ["description", "Shipping description"],
      ["cutoff", "Order cut-off time"],
      ["returns", "Return/cancellation note"],
    ],
  },
  seo: {
    label: "Search appearance",
    help: "Default metadata used when a page has no custom content.",
    fields: [
      ["title", "Default title"],
      ["description", "Default description"],
      ["keywords", "Keywords"],
    ],
  },
};

const longFields = new Set(["description", "address", "returns"]);

const emptyFooter = {
  name: "Maviina Mane",
  description: "",
  phone: "",
  email: "",
  location: "",
  facebook: "",
  instagram: "",
  whatsapp: "",
  features: ["Farm fresh", "Secure payments", "Fast delivery"],
  sections: [
    { title: "Explore", links: [{ label: "Shop", url: "/shop" }] },
    { title: "Customer care", links: [{ label: "Track order", url: "/track-order" }] },
  ],
  legalText: "All rights reserved.",
  theme: "forest",
};

const resolveValue = (key, item) =>
  key === "footer"
    ? {
        ...emptyFooter,
        ...(item?.value || {}),
        features: item?.value?.features || emptyFooter.features,
        sections: item?.value?.sections || emptyFooter.sections,
      }
    : item?.value || {};

export default function SettingsPanel({ open, save, upload }) {
  const [key, setKey] = useState("settings");
  const [value, setValue] = useState({});
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setLoading(true);
    open(key)
      .then((item) => setValue(resolveValue(key, item)))
      .finally(() => setLoading(false));
  }, [key, open]);

  const group = groups[key];
  const change = (field, next) => setValue({ ...value, [field]: next });

  return (
    <div className="settings-workspace">
      <aside className="settings-menu">
        <div>
          <FiSettings />
          <span>
            <b>Store settings</b>
            <small>Customer-facing content</small>
          </span>
        </div>

        {Object.entries(groups).map(([id, item]) => (
          <button
            type="button"
            key={id}
            className={key === id ? "selected" : ""}
            onClick={() => {
              setKey(id);
              setNotice("");
            }}
          >
            {item.label}
          </button>
        ))}
      </aside>

      <section className="settings-card structured-settings">
        <header>
          <p>SETTINGS / {group.label.toUpperCase()}</p>
          <h2>{group.label}</h2>
          <span>{group.help}</span>
        </header>

        {loading ? (
          <p>Loading settings…</p>
        ) : (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await save(key, value);
              setNotice("Changes saved.");
            }}
          >
            {key === "footer" ? (
              <FooterEditor value={value} setValue={setValue} upload={upload} />
            ) : (
              <div className="field-grid">
                {group.fields.map(([field, label]) => (
                  <label className={longFields.has(field) ? "wide" : ""} key={field}>
                    {label}
                    {longFields.has(field) ? (
                      <textarea
                        value={value[field] || ""}
                        onChange={(event) => change(field, event.target.value)}
                      />
                    ) : (
                      <input
                        value={value[field] || ""}
                        onChange={(event) => change(field, event.target.value)}
                      />
                    )}
                  </label>
                ))}
              </div>
            )}

            {notice && (
              <p className="settings-notice">
                <FiCheckCircle /> {notice}
              </p>
            )}

            <footer>
              <button type="button" onClick={() => open(key).then((item) => setValue(resolveValue(key, item)))}>
                Reset
              </button>
              <button className="green">Save {group.label}</button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}

function FooterEditor({ value, setValue, upload }) {
  const features = value.features || [];
  const sections = value.sections || [];
  const update = (next) => setValue(next);

  const setFeature = (index, next) =>
    update({
      ...value,
      features: features.map((feature, i) => (i === index ? next : feature)),
    });

  const removeFeature = (index) =>
    update({ ...value, features: features.filter((_, i) => i !== index) });

  const updateSection = (sectionIndex, next) =>
    update({
      ...value,
      sections: sections.map((section, i) => (i === sectionIndex ? next : section)),
    });

  const move = (sectionIndex, linkIndex, direction) => {
    const links = [...(sections[sectionIndex]?.links || [])];
    const target = linkIndex + direction;
    if (target < 0 || target >= links.length) return;
    [links[linkIndex], links[target]] = [links[target], links[linkIndex]];
    updateSection(sectionIndex, { ...sections[sectionIndex], links });
  };

  async function choose(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    update({ ...value, brandImage: result.url });
  }

  return (
    <div className="footer-editor">
      <div className="field-grid">
        {[
          ["name", "Business name"],
          ["phone", "Phone"],
          ["email", "Email"],
          ["location", "Location"],
          ["facebook", "Facebook URL"],
          ["instagram", "Instagram URL"],
          ["whatsapp", "WhatsApp URL"],
          ["legalText", "Legal text"],
        ].map(([field, label]) => (
          <label key={field}>
            {label}
            <input
              value={value[field] || ""}
              onChange={(event) => update({ ...value, [field]: event.target.value })}
            />
          </label>
        ))}

        <label>
          Theme
          <select
            value={value.theme || "forest"}
            onChange={(event) => update({ ...value, theme: event.target.value })}
          >
            <option value="forest">Forest green</option>
            <option value="orchard">Orchard cream</option>
            <option value="night">Night green</option>
          </select>
        </label>

        <label className="wide">
          Brand description
          <textarea
            value={value.description || ""}
            onChange={(event) => update({ ...value, description: event.target.value })}
          />
        </label>
      </div>

      <section className="brand-upload">
        {value.brandImage && <img src={assetUrl(value.brandImage)} alt="Brand" />}
        <label>
          <FiUploadCloud /> {value.brandImage ? "Replace brand image" : "Upload brand image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif"
            onChange={choose}
          />
        </label>
        {value.brandImage && (
          <button type="button" onClick={() => update({ ...value, brandImage: "" })}>
            Remove
          </button>
        )}
      </section>

      <section className="repeater">
        <header>
          <b>Trust features</b>
          <button type="button" onClick={() => update({ ...value, features: [...features, ""] })}>
            <FiPlus /> Add feature
          </button>
        </header>

        {features.map((feature, index) => (
          <div className="repeat-row" key={index}>
            <input
              value={feature}
              onChange={(event) => setFeature(index, event.target.value)}
              placeholder="e.g. Farm fresh"
            />
            <button type="button" onClick={() => removeFeature(index)} aria-label="Remove feature">
              <FiTrash2 />
            </button>
          </div>
        ))}
      </section>

      <section className="repeater">
        <header>
          <b>Footer navigation</b>
          <button
            type="button"
            onClick={() =>
              update({ ...value, sections: [...sections, { title: "New section", links: [] }] })
            }
          >
            <FiPlus /> Add section
          </button>
        </header>

        {sections.map((section, sectionIndex) => (
          <div className="footer-section-editor" key={sectionIndex}>
            <div className="repeat-row">
              <input
                value={section.title}
                onChange={(event) => updateSection(sectionIndex, { ...section, title: event.target.value })}
                placeholder="Section title"
              />
              <button
                type="button"
                onClick={() =>
                  update({ ...value, sections: sections.filter((_, i) => i !== sectionIndex) })
                }
              >
                <FiTrash2 />
              </button>
            </div>

            {(section.links || []).map((link, linkIndex) => (
              <div className="link-row" key={linkIndex}>
                <input
                  value={link.label || ""}
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      ...section,
                      links: (section.links || []).map((item, i) =>
                        i === linkIndex ? { ...item, label: event.target.value } : item
                      ),
                    })
                  }
                  placeholder="Link label"
                />
                <input
                  value={link.url || ""}
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      ...section,
                      links: (section.links || []).map((item, i) =>
                        i === linkIndex ? { ...item, url: event.target.value } : item
                      ),
                    })
                  }
                  placeholder="/path or https://"
                />
                <button type="button" onClick={() => move(sectionIndex, linkIndex, -1)} aria-label="Move up">
                  <FiChevronUp />
                </button>
                <button type="button" onClick={() => move(sectionIndex, linkIndex, 1)} aria-label="Move down">
                  <FiChevronDown />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateSection(sectionIndex, {
                      ...section,
                      links: (section.links || []).filter((_, i) => i !== linkIndex),
                    })
                  }
                  aria-label="Remove link"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-link"
              onClick={() =>
                updateSection(sectionIndex, { ...section, links: [...(section.links || []), { label: "", url: "" }] })
              }
            >
              <FiPlus /> Add link
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
