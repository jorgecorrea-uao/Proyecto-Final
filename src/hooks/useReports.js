import { useEffect, useMemo, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { reportsCollection } from "../services/reports";
import { Queue } from "../helpers/structures/Queue";

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onSnapshot(reportsCollection, (snapshot) => {
      setReports(
        snapshot.docs.map((d) => {
          const data = d.data({ serverTimestamps: "estimate" });
          return { id: d.id, ...data, createdAt: data.createdAt?.toDate() ?? new Date() };
        })
      );
      setLoading(false);
    });
  }, []);

  const queue = useMemo(() => {
    const groups = new Map();

    reports.forEach((report) => {
      if (!groups.has(report.postId)) {
        groups.set(report.postId, {
          postId: report.postId,
          postText: report.postText,
          postAuthorId: report.postAuthorId,
          postAuthorName: report.postAuthorName,
          firstReportAt: report.createdAt,
          reports: [],
        });
      }
      const group = groups.get(report.postId);
      group.reports.push(report);
      if (report.createdAt < group.firstReportAt) group.firstReportAt = report.createdAt;
    });

    const q = new Queue();
    [...groups.values()].sort((a, b) => a.firstReportAt - b.firstReportAt).forEach((group) => q.enqueue(group));
    return q;
  }, [reports]);

  return { queue, total: reports.length, loading };
}