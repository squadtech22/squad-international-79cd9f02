import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore/lite";
import { firebaseConfig } from "@/lib/firebase";
import { posts as staticPosts } from "@/lib/site-data";
import { parseRichContent, type RichNode } from "@/lib/rich-content";

/**
 * A blog post from either source: the articles kept in site-data, or the ones
 * written and published in the admin portal (Firestore `posts`). Portal posts
 * carry `content`; site-data posts carry `body` paragraphs.
 */
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  body?: string[];
  content?: RichNode[];
  author?: string;
  coverImage?: string;
};

// Firestore Lite is fetch-based, so it runs in the Worker during SSR as well as
// in the browser, and needs no long-lived connection for a one-off read.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const liteDb = getFirestore(app);

/** A `posts` document as the admin portal writes it. */
type PortalPostDoc = {
  slug?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  createdAt?: string;
  readingTime?: string;
  category?: string;
  content?: string;
  author?: string;
  coverImage?: string;
  status?: string;
  body?: string[];
};

const today = () => new Date().toISOString().slice(0, 10);

async function getPortalPosts(): Promise<{ posts: BlogPost[]; fromFirestore: boolean }> {
  try {
    const snap = await getDocs(collection(liteDb, "posts"));
    if (snap.empty) {
      return { posts: [], fromFirestore: false };
    }
    const list = snap.docs
      .map((d) => d.data() as PortalPostDoc)
      // Posts dated in the future are scheduled: they appear from that date.
      .filter((p) => p.slug && p.title && (p.status === "published" || !p.status) && (!p.date || p.date <= today()))
      .map((p) => ({
        slug: String(p.slug),
        title: String(p.title),
        excerpt: p.excerpt ?? "",
        date: String(p.date ?? p.createdAt ?? today()).slice(0, 10),
        readingTime: p.readingTime ?? "",
        category: p.category ?? "Insights",
        content: parseRichContent(p.content, p.body || p.excerpt),
        ...(p.body ? { body: p.body } : {}),
        ...(p.author ? { author: p.author } : {}),
        ...(p.coverImage ? { coverImage: p.coverImage } : {}),
      }));
    return { posts: list, fromFirestore: true };
  } catch (err) {
    // The blog still renders the site-data posts if Firestore is unreachable.
    console.warn("Blog posts from Firestore unavailable:", err);
    return { posts: [], fromFirestore: false };
  }
}

/** Every published post, newest first. If Firestore is active, it is the single source of truth. */
export async function getAllPosts(): Promise<BlogPost[]> {
  const portal = await getPortalPosts();
  if (portal.fromFirestore) {
    return portal.posts.sort((a, b) => b.date.localeCompare(a.date));
  }
  return [...staticPosts].sort((a, b) => b.date.localeCompare(a.date));
}

