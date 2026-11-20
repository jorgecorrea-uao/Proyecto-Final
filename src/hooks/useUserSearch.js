import { useMemo } from "react";
import { Trie } from "../helpers/structures/Trie";
import { normalizeText } from "../helpers/utils";

export function useUserSearch(users) {
  const trie = useMemo(() => {
    const t = new Trie();
    users.forEach((user) => {
      normalizeText(user.name)
        .split(/\s+/)
        .forEach((word) => t.insert(word, user));
    });
    return t;
  }, [users]);

  const search = (text) => {
    const words = normalizeText(text).split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const matchesPerWord = words.map((word) => new Map(trie.startsWith(word).map((user) => [user.id, user])));
    const [first, ...rest] = matchesPerWord;

    return [...first.values()]
      .filter((user) => rest.every((matches) => matches.has(user.id)))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return search;
}