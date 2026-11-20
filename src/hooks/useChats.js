import { useEffect, useState } from "react";
import { onSnapshot, query, where } from "firebase/firestore";
import { chatsCollection } from "../services/chat";

export function useChats(userId) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(chatsCollection, where("participants", "array-contains", userId));

    return onSnapshot(q, (snapshot) => {
      setChats(
        snapshot.docs
          .map((d) => {
            const data = d.data({ serverTimestamps: "estimate" });
            return {
              id: d.id,
              ...data,
              friendId: data.participants.find((p) => p !== userId),
              updatedAt: data.updatedAt?.toDate() ?? new Date(),
            };
          })
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );
    });
  }, [userId]);

  return chats;
}