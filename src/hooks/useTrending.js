import { useMemo, useState } from "react";
import { MinHeap } from "../helpers/structures/MinHeap";

const WEEK = 7 * 24 * 60 * 60 * 1000;

export function useTrending(posts, k = 5) {
  const [now] = useState(() => Date.now());

  return useMemo(() => {
    const since = now - WEEK;
    const heap = new MinHeap([], (post) => post.likesCount);

    posts
      .filter((post) => post.likesCount > 0 && post.createdAt.getTime() >= since)
      .forEach((post) => {
        heap.push(post);
        if (heap.size() > k) heap.pop();
      });

    const result = [];
    while (heap.size() > 0) {
      result.unshift(heap.pop());
    }
    return result;
  }, [posts, k, now]);
}