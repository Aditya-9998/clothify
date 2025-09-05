import React, { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function CheckOrders() {
  useEffect(() => {
    async function checkCollections() {
      const upper = await getDocs(collection(db, "Orders"));   // Uppercase
      const lower = await getDocs(collection(db, "orders"));   // Lowercase

      console.log("Uppercase Orders count:", upper.size);
      console.log("Lowercase orders count:", lower.size);

      if (upper.size > 0) {
        console.warn("⚠️ Warning: Uppercase 'Orders' collection still has documents.");
      } else {
        console.log("✅ Safe: Only lowercase 'orders' collection is in use.");
      }
    }

    checkCollections();
  }, []);

  return <h1>Check Orders Result → Console me dekho 🔍</h1>;
}
