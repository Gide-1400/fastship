// src/components/ContactForm.jsx
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "messages"), form);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="p-6 bg-gray-100 text-center">
      <h3 className="text-2xl font-bold mb-4">تواصل معنا</h3>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="الاسم" required className="p-2 border" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="البريد الإلكتروني" required className="p-2 border" />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="رسالتك" required className="p-2 border" />
        <button type="submit" className="bg-blue-700 text-white py-2">إرسال</button>
        {sent && <p className="text-green-600 mt-2">✅ تم الإرسال بنجاح</p>}
      </form>
    </section>
  );
}
