import { useEffect, useState } from "react";

export default function AdminContentModule({ title, open, save }) {
  const key = `admin_${title.toLowerCase().replace(/\s+/g, "_")}`;
  const [text, setText] = useState("{}");
  const [message, setMessage] = useState("");
  useEffect(() => { open(key).then(item => setText(JSON.stringify(item?.value || {}, null, 2))).catch(() => setText("{}")); }, [key, open]);
  async function submit(event) { event.preventDefault(); try { await save(key, JSON.parse(text)); setMessage("Saved successfully."); } catch { setMessage("Enter valid JSON before saving."); } }
  return <section className="admin-content-module"><header><h2>{title}</h2><p>Manage the data used by this application section.</p></header><form onSubmit={submit}><label>Section data (JSON)<textarea value={text} onChange={event => setText(event.target.value)} spellCheck="false" /></label><button className="green">Save {title}</button>{message && <p>{message}</p>}</form></section>;
}
