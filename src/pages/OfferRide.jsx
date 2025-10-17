// src/pages/OfferRide.jsx
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OfferRide() {
  const [form, setForm] = useState({
    driver: "",
    vehicle: "",
    space: "",
    from: "",
    to: "",
    date: "",
    price: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "rides"), form);
    setSent(true);
    setForm({
      driver: "",
      vehicle: "",
      space: "",
      from: "",
      to: "",
      date: "",
      price: "",
    });
  };

  return (
    <>
      <Navbar />
      <section className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">أعلن عن رحلة</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="driver" placeholder="اسم السائق" value={form.driver} onChange={handleChange} required className="p-2 border" />
          <input name="vehicle" placeholder="نوع المركبة" value={form.vehicle} onChange={handleChange} required className="p-2 border" />
          <input name="space" placeholder="المساحة المتاحة" value={form.space} onChange={handleChange} required className="p-2 border" />
          <input name="from" placeholder="من مدينة" value={form.from} onChange={handleChange} required className="p-2 border" />
          <input name="to" placeholder="إلى مدينة" value={form.to} onChange={handleChange} required className="p-2 border" />
          <input name="date" type="date" value={form.date} onChange={handleChange} required className="p-2 border" />
          <input name="price" placeholder="السعر المقترح" value={form.price} onChange={handleChange} required className="p-2 border" />
          <button type="submit" className="bg-blue-700 text-white py-2">إرسال</button>
          {sent && <p className="text-green-600">✅ تم تسجيل الرحلة بنجاح</p>}
        </form>
      </section>
      <Footer />
    </>
  );
}
