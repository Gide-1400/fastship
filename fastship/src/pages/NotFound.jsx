// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">404 - الصفحة غير موجودة</h1>
      <Link to="/" className="text-blue-600 underline">العودة للرئيسية</Link>
    </div>
  );
}
