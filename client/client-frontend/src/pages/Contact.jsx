// ✅ src/pages/Contact.jsx
import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

// 🔹 FIXED — use public/assets instead of src/assets
const MumbaiImg = "/assets/Mumbai.png";
const DelhiImg = "/assets/Delhi.jpg";
const BangaloreImg = "/assets/Banglore.png";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      await addDoc(collection(db, "contacts"), {
        ...form,
        timestamp: Timestamp.now(),
      });

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setStatus("✅ Message sent successfully!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to send message. Try again.");
    }
  };

  return (
    <div className="bg-white">
      {/* 🔹 Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 py-12 text-center text-white">
        <h2 className="text-4xl font-bold">Contact Us</h2>
        <p className="mt-2 text-lg">We'd love to hear from you</p>
      </div>

      {/* 🔹 Form & Info */}
      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Send us a Message</h3>
          {status && <p className="text-green-600 text-sm mb-4">{status}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select a subject</option>
              <option value="Order Inquiry">Order Inquiry</option>
              <option value="Support">Support</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              name="message"
              placeholder="Message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            ></textarea>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition w-full"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right: Info Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
          <ul className="space-y-6 text-gray-700">
            <li>
              <strong>📍 Address</strong>
              <p>
                123 Fashion Street, Bandra West
                <br />
                Mumbai, Maharashtra 400050
              </p>
            </li>

            <li>
              <strong>📞 Phone</strong>
              <p>
                +91 98765 43210
                <br />
                +91 98765 43211
              </p>
            </li>

            <li>
              <strong>✉️ Email</strong>
              <p>
                info@clothify.com
                <br />
                support@clothify.com
              </p>
            </li>

            <li>
              <strong>⏰ Business Hours</strong>
              <p>
                Mon - Sat: 10:00 AM - 9:00 PM
                <br />
                Sunday: 11:00 AM - 7:00 PM
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* 🔹 Store Locations */}
      <div className="bg-gray-50 py-12">
        <h3 className="text-center text-2xl font-bold mb-8">
          Our Store Locations
        </h3>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <img
              src={MumbaiImg}
              alt="Mumbai Store"
              className="rounded mb-4 w-full h-40 object-cover"
            />
            <h4 className="font-semibold">Mumbai Flagship</h4>
            <p>
              123 Fashion Street, Bandra West
              <br />
              Mumbai, Maharashtra 400050
            </p>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>

          <div className="bg-white p-6 rounded shadow text-center">
            <img
              src={DelhiImg}
              alt="Delhi Store"
              className="rounded mb-4 w-full h-40 object-cover"
            />
            <h4 className="font-semibold">Delhi Store</h4>
            <p>
              456 Connaught Place
              <br />
              New Delhi, Delhi 110001
            </p>
            <p className="text-gray-600">+91 98765 43211</p>
          </div>

          <div className="bg-white p-6 rounded shadow text-center">
            <img
              src={BangaloreImg}
              alt="Bangalore Store"
              className="rounded mb-4 w-full h-40 object-cover"
            />
            <h4 className="font-semibold">Bangalore Store</h4>
            <p>
              789 Brigade Road
              <br />
              Bangalore, Karnataka 560025
            </p>
            <p className="text-gray-600">+91 98765 43212</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
