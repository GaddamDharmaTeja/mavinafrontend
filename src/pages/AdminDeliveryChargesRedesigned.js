import { useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiCheck, FiEdit2, FiPlus, FiRefreshCw, FiTrash2, FiX } from "react-icons/fi";
import { deleteDeliveryCharge, getDeliveryCharges, saveDeliveryCharge } from "../services/productService";
import "./AdminDeliveryCharges.css";
import "./AdminDeliveryChargesResponsive.css";

const emptySlab = type => ({ type, minValue: "", maxValue: "", charge: "", active: true });

function money(value) { return `₹${Number(value || 0).toLocaleString("en-IN")}`; }

function SlabCard({ type, rows, loading, setEditing, remove }) {
  const isDistance = type === "DISTANCE";
  return <section className="delivery-slab-card"><header className="delivery-card-header"><div><span className="delivery-card-icon">{isDistance ? "KM" : "KG"}</span><div><p className="delivery-card-kicker">{isDistance ? "DISTANCE BASED" : "WEIGHT BASED"}</p><h2>{isDistance ? "Distance charges" : "Weight charges"}</h2></div></div><button className="delivery-add-button" type="button" onClick={() => setEditing(emptySlab(type))}><FiPlus /> Add slab</button></header>{loading ? <div className="delivery-loading"><i /><i /><i /></div> : rows.length === 0 ? <div className="delivery-empty"><span><FiAlertCircle /></span><div><b>No {isDistance ? "distance" : "weight"} slabs yet</b><p>Add your first slab to start calculating delivery charges.</p></div></div> : <div className="delivery-table-wrap"><table className="delivery-table"><thead><tr><th>Minimum</th><th>Maximum</th><th>Charge</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td>{row.minValue} {isDistance ? "km" : "kg"}</td><td>{row.maxValue == null ? "∞" : `${row.maxValue} ${isDistance ? "km" : "kg"}`}</td><td className="delivery-charge-value">{money(row.charge)}</td><td><span className={`delivery-status ${row.active ? "active" : "inactive"}`}><FiCheck /> {row.active ? "Active" : "Disabled"}</span></td><td className="delivery-actions"><button type="button" title="Edit slab" onClick={() => setEditing(row)}><FiEdit2 /></button><button type="button" title="Delete slab" className="danger" onClick={() => remove(row.id)}><FiTrash2 /></button></td></tr>)}</tbody></table></div>}</section>;
}

export default function AdminDeliveryCharges({ onNotice }) {
  const [slabs, setSlabs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { setSlabs(await getDeliveryCharges()); }
    catch (requestError) { setError(requestError.message || "Delivery charge configuration could not be loaded."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const distanceSlabs = useMemo(() => slabs.filter(item => item.type === "DISTANCE"), [slabs]);
  const weightSlabs = useMemo(() => slabs.filter(item => item.type === "WEIGHT"), [slabs]);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const min = Number(form.get("minValue"));
    const maxValue = form.get("maxValue");
    const max = maxValue === "" ? null : Number(maxValue);
    const charge = Number(form.get("charge"));
    if (Number.isNaN(min) || min < 0) return setError("Minimum value must be zero or greater.");
    if (max !== null && (Number.isNaN(max) || max <= min)) return setError("Maximum value must be greater than minimum.");
    if (Number.isNaN(charge) || charge < 0) return setError("Charge must be zero or greater.");
    setSaving(true); setError("");
    try {
      await saveDeliveryCharge({ ...editing, minValue: min, maxValue: max, charge, active: form.get("active") === "on" });
      setEditing(null); await load(); onNotice?.("Delivery charge slab saved successfully.");
    } catch (requestError) { setError(requestError.message || "The slab could not be saved."); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this delivery charge slab?")) return;
    try { await deleteDeliveryCharge(id); await load(); onNotice?.("Delivery charge slab deleted."); }
    catch (requestError) { setError(requestError.message || "The slab could not be deleted."); }
  }

  return <section className="delivery-config-page"><header className="delivery-page-intro"><div><p className="delivery-eyebrow">CHECKOUT CONFIGURATION</p><h1>Delivery charges</h1><p>Set the rules your store uses to calculate delivery from distance and total order weight.</p></div><button type="button" className="delivery-refresh-button" onClick={load} disabled={loading}><FiRefreshCw className={loading ? "spin" : ""} /> Refresh</button></header>{error && <div className="delivery-error"><FiAlertCircle /><div><b>We couldn’t load the delivery configuration</b><span>{error}</span><button type="button" onClick={load}>Try again</button></div><button type="button" aria-label="Dismiss error" onClick={() => setError("")}><FiX /></button></div>}<div className="delivery-info-strip"><span>How it works</span><p>Delivery charge = distance slab + additional weight slab. Only active slabs are used at checkout.</p></div><div className="delivery-slab-grid"><SlabCard type="DISTANCE" rows={distanceSlabs} loading={loading} setEditing={setEditing} remove={remove} /><SlabCard type="WEIGHT" rows={weightSlabs} loading={loading} setEditing={setEditing} remove={remove} /></div>{editing && <div className="delivery-modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && setEditing(null)}><form className="delivery-modal" onSubmit={submit}><header><div><p>{editing.id ? "EDIT SLAB" : "NEW SLAB"}</p><h2>{editing.type === "DISTANCE" ? "Distance charge slab" : "Weight charge slab"}</h2></div><button type="button" aria-label="Close" onClick={() => setEditing(null)}><FiX /></button></header><div className="delivery-form-grid"><label>Minimum value<input name="minValue" type="number" min="0" step="0.01" required defaultValue={editing.minValue} autoFocus /><small>Starting {editing.type === "DISTANCE" ? "kilometers" : "kilograms"}</small></label><label>Maximum value<input name="maxValue" type="number" min="0" step="0.01" defaultValue={editing.maxValue ?? ""} placeholder="No maximum" /><small>Leave blank for unlimited</small></label><label className="charge-field">Charge<input name="charge" type="number" min="0" step="0.01" required defaultValue={editing.charge} /><small>Amount in Indian rupees</small></label></div><label className="delivery-active-toggle"><input name="active" type="checkbox" defaultChecked={editing.active} /><span><b>Use this slab at checkout</b><small>Disabled slabs are kept but ignored in calculations.</small></span></label><footer><button type="button" className="delivery-cancel-button" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="delivery-save-button" disabled={saving}>{saving ? "Saving…" : "Save slab"}</button></footer></form></div>}</section>;
}
