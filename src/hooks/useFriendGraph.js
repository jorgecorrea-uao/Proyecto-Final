import { useMemo } from "react";
import { Graph } from "../helpers/structures/Graph";

export function useFriendGraph(users) {
  return useMemo(() => {
    const graph = new Graph();
    users.forEach((user) => graph.addNode(user.id));
    users.forEach((user) => (user.friends ?? []).forEach((friendId) => graph.addEdge(user.id, friendId)));
    return graph;
  }, [users]);
}