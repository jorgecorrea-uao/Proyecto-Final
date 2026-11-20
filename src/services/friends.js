import { arrayRemove, arrayUnion, collection, deleteDoc, doc, runTransaction, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

export const requestsCollection = collection(db, "friendRequests");

export const requestId = (fromId, toId) => `${fromId}_${toId}`;

export function sendFriendRequest(fromProfile, toUser) {
  return setDoc(doc(db, "friendRequests", requestId(fromProfile.id, toUser.id)), {
    from: fromProfile.id,
    fromName: fromProfile.name,
    fromCareer: fromProfile.career,
    to: toUser.id,
    createdAt: serverTimestamp(),
  });
}

export function deleteFriendRequest(id) {
  return deleteDoc(doc(db, "friendRequests", id));
}

export function acceptFriendRequest(request) {
  return runTransaction(db, async (transaction) => {
    const requestRef = doc(db, "friendRequests", request.id);
    const snapshot = await transaction.get(requestRef);
    if (!snapshot.exists()) throw new Error("La solicitud ya no existe");

    transaction.update(doc(db, "users", request.from), { friends: arrayUnion(request.to) });
    transaction.update(doc(db, "users", request.to), { friends: arrayUnion(request.from) });
    transaction.delete(requestRef);
  });
}

export function removeFriend(userId, friendId) {
  const batch = writeBatch(db);
  batch.update(doc(db, "users", userId), { friends: arrayRemove(friendId) });
  batch.update(doc(db, "users", friendId), { friends: arrayRemove(userId) });
  return batch.commit();
}