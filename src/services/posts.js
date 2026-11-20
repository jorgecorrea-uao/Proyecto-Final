import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
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

export function toggleLike(post, userId) {
  const liked = post.likes.includes(userId);
  return updateDoc(doc(db, "posts", post.id), {
    likes: liked ? arrayRemove(userId) : arrayUnion(userId),
    likesCount: increment(liked ? -1 : 1),
  });
}