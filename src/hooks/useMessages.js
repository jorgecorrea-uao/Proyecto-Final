import { useEffect, useState } from "react";
import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { messagesCollection } from "../services/chat";

export function useMessages(chatId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;

    const q = query(messagesCollection(chatId), orderBy("createdAt", "asc"), limit(200));

    return onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((d) => {
          const data = d.data({ serverTimestamps: "estimate" });
          return { id: d.id, ...data, createdAt: data.createdAt?.toDate() ?? new Date() };
        })
      );
      setLoading(false);
    });
  }, [chatId]);

  return { messages, loading };
}