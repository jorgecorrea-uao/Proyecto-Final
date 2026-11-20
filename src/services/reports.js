import { collection, doc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

export const reportsCollection = collection(db, "reports");

export function reportPost(post, reporter, reason) {
  return setDoc(doc(db, "reports", `${post.id}_${reporter.id}`), {
    postId: post.id,
    postText: post.text,
    postAuthorId: post.authorId,
    postAuthorName: post.authorName,
    reporterId: reporter.id,
    reporterName: reporter.name,
    reason: reason.trim(),
    createdAt: serverTimestamp(),
  });
}

export function dismissReports(reports) {
  const batch = writeBatch(db);
  reports.forEach((report) => batch.delete(doc(db, "reports", report.id)));
  return batch.commit();
}

export function deleteReportedPost(postId, reports) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "posts", postId));
  reports.forEach((report) => batch.delete(doc(db, "reports", report.id)));
  return batch.commit();
}