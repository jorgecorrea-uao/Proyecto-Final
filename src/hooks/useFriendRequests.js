import { useEffect, useMemo, useState } from "react";
import { onSnapshot, query, where } from "firebase/firestore";
import { requestsCollection } from "../services/friends";
import { Queue } from "../helpers/structures/Queue";

const toRequests = (snapshot) =>
  snapshot.docs.map((d) => {
    const data = d.data({ serverTimestamps: "estimate" });
    return { id: d.id, ...data, createdAt: data.createdAt?.toDate() ?? new Date() };
  });

export function useFriendRequests(userId) {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const unsubscribeIncoming = onSnapshot(query(requestsCollection, where("to", "==", userId)), (snapshot) => {
      setIncoming(toRequests(snapshot));
      setLoading(false);
    });

    const unsubscribeOutgoing = onSnapshot(query(requestsCollection, where("from", "==", userId)), (snapshot) => {
      setOutgoing(toRequests(snapshot));
    });

    return () => {
      unsubscribeIncoming();
      unsubscribeOutgoing();
    };
  }, [userId]);

  const queue = useMemo(() => {
    const q = new Queue();
    [...incoming].sort((a, b) => a.createdAt - b.createdAt).forEach((request) => q.enqueue(request));
    return q;
  }, [incoming]);

  return { queue, incoming, outgoing, loading };
}