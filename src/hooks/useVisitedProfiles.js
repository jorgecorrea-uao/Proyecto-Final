import { useCallback, useState } from "react";
import { Stack } from "../helpers/structures/Stack";

const KEY = "visitedProfiles";
const MAX = 10;

const load = () => {
  const stack = new Stack();
  try {
    JSON.parse(localStorage.getItem(KEY) ?? "[]").forEach((id) => stack.push(id));
  } catch {
    return stack;
  }
  return stack;
};

const save = (stack) => {
  try {
    localStorage.setItem(KEY, JSON.stringify([...stack]));
  } catch {
    return;
  }
};

export function useVisitedProfiles() {
  const [stack, setStack] = useState(load);

  const visit = useCallback((id) => {
    setStack((current) => {
      if (current.peek() === id) return current;
      const next = new Stack();
      current.filter((item) => item !== id).forEach((item) => next.push(item));
      next.push(id);
      while (next.size() > MAX) next.shift();
      save(next);
      return next;
    });
  }, []);

  const back = () => {
    const next = new Stack();
    stack.forEach((item) => next.push(item));
    next.pop();
    save(next);
    setStack(next);
    return next.peek() ?? null;
  };

  return { stack, visit, back };
}