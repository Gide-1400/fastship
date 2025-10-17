// src/pages/SendPackage.jsx
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SendPackage() {
  const [form, setForm] = useState({
    sender: "",
    size: "",
    weight: "",
    from: "",
    to: "",
    budget: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "packages"), form);
    setSent(true);
    setForm({
      sender: "",
      size: "",
      weight: "",
      from: "",
      to: "",
      budget: "",
    });
  };

  return (
    <>
      <Navbar />
      <section className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">أرسل شحنة</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="sender" placeholder="اسم المرسل" value={form.sender} onChange={handleChange} required className="p-2 border" />
          <input name="size" placeholder="الحجم (صغير/متوسط/كبير)" value={form.size} onChange={handleChange} required className="p-2 border" />
          <input name="weight" placeholder="الوزن بالكيلو" value={form.weight} onChange={handleChange} required className="p-2 border" />
          <input name="from" placeholder="من مدينة" value={form.from} onChange={handleChange} required className="p-2 border" />
          <input name="to" placeholder="إلى مدينة" value={form.to} onChange={handleChange} required className="p-2 border" />
          <input name="budget" placeholder="الميزانية (ريال)" value={form.budget} onChange={handleChange} required className="p-2 border" />
          <button type="submit" className="bg-blue-700 text-white py-2">إرسال</button>
          {sent && <p className="text-green-600">✅ تم إرسال الشحنة بنجاح</p>}
        </form>
      </section>
      <Footer />
    </>
  );
}
