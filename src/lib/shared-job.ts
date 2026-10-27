import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore/lite";
import { firebaseConfig } from "@/lib/firebase";

/** The fields a shared job link needs for its preview card. */
export type SharedJob = {
  slug: string;
  title: string;
  type: string;
  location: string;
  summary: string;
};

// Firestore Lite, as in blog-posts.ts: a one-off fetch that also runs during SSR.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const liteDb = getFirestore(app);

/**
 * The job's slug, used for its link (/careers?job=customer-support-agent). The
 * admin portal builds the same slug for its "Copy link" button, so keep the two
 * in step.
 */
export function jobSlug(role: { id?: string | undefined; title?: string | undefined }) {
  const slug = (role.title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || role.id || "job";
}

/** Finds an active job by its slug, or null if there is none or Firestore is unreachable. */
export async function getSharedJob(slug: string): Promise<SharedJob | null> {
  try {
    const snap = await getDocs(collection(liteDb, "jobs"));
    for (const d of snap.docs) {
      const job = d.data() as Partial<SharedJob> & { active?: boolean };
      if (job.active === false || jobSlug({ id: d.id, title: job.title }) !== slug) continue;
      return {
        slug,
        title: String(job.title ?? ""),
        type: job.type ?? "",
        location: job.location ?? "",
        summary: job.summary ?? "",
      };
    }
  } catch (err) {
    console.warn("Shared job from Firestore unavailable:", err);
  }
  return null;
}
