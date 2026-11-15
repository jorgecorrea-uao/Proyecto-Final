import { useEffect, useState } from "react";
import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { postsCollection } from "../services/posts";

export function usePosts(max = 100) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(postsCollection, orderBy("createdAt", "desc"), limit(max));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPosts(
          snapshot.docs.map((d) => {
            const data = d.data({ serverTimestamps: "estimate" });
            return { id: d.id, ...data, createdAt: data.createdAt?.toDate() ?? new Date() };
          })
        );
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [max]);

  return { posts, loading, error };
}