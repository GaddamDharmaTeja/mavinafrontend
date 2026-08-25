import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

export default function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();
  return <button type="button" className="back-button" onClick={() => window.history.length > 1 ? navigate(-1) : navigate(fallback)}><FiArrowLeft /> Back</button>;
}
