import { useEffect, useRef, useState } from "react";
import { getMapsConfig } from "../services/productService";

let mapsPromise;
function loadGoogleMaps(key) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
    script.async = true; script.onload = () => resolve(window.google.maps); script.onerror = reject;
    document.head.appendChild(script);
  });
  return mapsPromise;
}

export default function LocationPicker({ value, onChange }) {
  const mapNode = useRef(null); const searchNode = useRef(null);
  const [enabled, setEnabled] = useState(false); const [status, setStatus] = useState("Manual coordinates are available.");
  const update = (field, next) => onChange({ ...value, [field]: next });
  useEffect(() => {
    let active = true;
    getMapsConfig().then(config => {
      if (!config.enabled || !active) return;
      setEnabled(true); setStatus("Search or click the map to set the exact location.");
      return loadGoogleMaps(config.browserKey).then(maps => {
        if (!active || !mapNode.current) return;
        const initial = { lat: Number(value.latitude) || 16.5062, lng: Number(value.longitude) || 80.6480 };
        const map = new maps.Map(mapNode.current, { center: initial, zoom: value.latitude ? 14 : 6, disableDefaultUI: true, zoomControl: true });
        const marker = new maps.Marker({ map, position: initial, draggable: true });
        const setPoint = position => {
          const latitude = Number(position.lat()).toFixed(6); const longitude = Number(position.lng()).toFixed(6);
          marker.setPosition(position); update("latitude", latitude); update("longitude", longitude);
          new maps.Geocoder().geocode({ location: position }).then(result => {
            const place = result.results?.[0]; if (place) onChange({ ...value, latitude, longitude, address: place.formatted_address || value.address, placeId: place.place_id || value.placeId });
          }).catch(() => {});
        };
        map.addListener("click", event => setPoint(event.latLng)); marker.addListener("dragend", event => setPoint(event.latLng));
        const autocomplete = new maps.places.Autocomplete(searchNode.current, { fields: ["geometry", "formatted_address", "place_id"] });
        autocomplete.addListener("place_changed", () => { const place = autocomplete.getPlace(); if (!place.geometry) return; map.setCenter(place.geometry.location); map.setZoom(15); marker.setPosition(place.geometry.location); onChange({ ...value, latitude: place.geometry.location.lat().toFixed(6), longitude: place.geometry.location.lng().toFixed(6), address: place.formatted_address || value.address, placeId: place.place_id || "" }); });
      });
    }).catch(() => setStatus("Map is unavailable; enter the location manually."));
    return () => { active = false; };
  }, []);
  return <section className="location-picker"><div className="location-title"><b>Farm location</b><small>{status}</small></div>{enabled && <input ref={searchNode} placeholder="Search address or landmark" />}{enabled && <div className="map-canvas" ref={mapNode} />}<div className="field-grid"><label>Latitude<input value={value.latitude || ""} onChange={e => update("latitude", e.target.value)} placeholder="16.5062" /></label><label>Longitude<input value={value.longitude || ""} onChange={e => update("longitude", e.target.value)} placeholder="80.6480" /></label><label className="wide">Formatted address<textarea value={value.address || ""} onChange={e => update("address", e.target.value)} /></label><label className="wide">Google Place ID <small>(optional)</small><input value={value.placeId || ""} onChange={e => update("placeId", e.target.value)} /></label></div></section>;
}
