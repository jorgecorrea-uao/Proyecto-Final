import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

export const chatsCollection = collection(db, "chats");

export const chatIdFor = (userA, userB) => [userA, userB].sort().join("_");

export const messagesCollection = (chatId) => collection(db, "chats", chatId, "messages");

export function sendMessage(fromId, toId, text) {
  const chatId = chatIdFor(fromId, toId);
  const batch = writeBatch(db);

  batch.set(doc(messagesCollection(chatId)), {
    senderId: fromId,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });

  batch.set(
    doc(db, "chats", chatId),
    {
      participants: [fromId, toId].sort(),
      lastMessage: text.trim(),
      lastSenderId: fromId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return batch.commit();
}