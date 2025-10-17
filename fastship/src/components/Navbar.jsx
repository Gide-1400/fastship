// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">🚀 FastShip</h1>
      <ul className="flex gap-4">
        <li><Link to="/">الرئيسية</Link></li>
        <li><Link to="/send">أرسل شحنة</Link></li>
        <li><Link to="/offer">أعلن عن رحلة</Link></li>
      </ul>
    </nav>
  );
}
