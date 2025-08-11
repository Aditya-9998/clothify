// ✅ src/pages/AdminContacts.jsx
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const snapshot = await getDocs(collection(db, "Contacts"));
      const contactsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(contactsData);
    };

    fetchContacts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">User Messages</h2>
      {messages.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="border p-4 rounded bg-white shadow">
              <p><strong>Name:</strong> {msg.name}</p>
              <p><strong>Email:</strong> {msg.email}</p>
              <p><strong>Message:</strong> {msg.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminContacts;
