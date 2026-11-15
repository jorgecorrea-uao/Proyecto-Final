import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const postsCollection = collection(db, "posts");

export function createPost(profile, text) {
  return addDoc(postsCollection, {
    authorId: profile.id,
    authorName: profile.name,
    authorCareer: profile.career,
    text: text.trim(),
    likes: [],
    likesCount: 0,
    createdAt: serverTimestamp(),
  });
}

export function deletePost(postId) {
  return deleteDoc(doc(db, "posts", postId));
}