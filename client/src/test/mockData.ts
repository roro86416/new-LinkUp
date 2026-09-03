// src/data/mockData.ts
export type Author = {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: string;
  tags: string[]; // tag slugs
  coverImage: string;
  authorId: string;
  publishedAt: string;
};

export type Category = {
  slug: string;
  title: string;
  breadcrumb: { name: string; href: string }[];
  description?: string;
};

export type Tag = {
  slug: string;
  name: string;
};

const authors: Author[] = [
  { id: "a1", name: "Sophie Lee", avatarUrl: "https://i.pravatar.cc/80?img=12", bio: "Event strategist" },
  { id: "a2", name: "Daniel Wu", avatarUrl: "https://i.pravatar.cc/80?img=47", bio: "Community manager" },
];

const tags: Tag[] = [
  { slug: "event-marketing", name: "Event Marketing" },
  { slug: "event-ideas", name: "Event Ideas" },
  { slug: "event-planning", name: "Event Planning" },
  { slug: "email-marketing", name: "Email Marketing" },
  { slug: "christmas", name: "Christmas" },
];

const categories: Category[] = [
  {
    slug: "checklist",
    title: "CHECKLIST",
    breadcrumb: [
      { name: "Eventbrite", href: "/" },
      { name: "Organizer", href: "/organizer" },
      { name: "Home", href: "/" },
      { name: "Checklist", href: "/categories/checklist" },
    ],
    description: "Practical checklists and step-by-step guides for events.",
  },
  {
    slug: "event-ideas",
    title: "EVENT IDEAS",
    breadcrumb: [
      { name: "Eventbrite", href: "/" },
      { name: "Blog", href: "/blog" },
      { name: "Event Ideas", href: "/categories/event-ideas" },
    ],
  },
];

const posts: Post[] = [
  {
    id: "p1",
    title: "Advanced Email Marketing Strategies for Music and Performing Arts Events",
    slug: "advanced-email-marketing-music",
    excerpt: "How to grow ticket sales with targeted email flows and segmentation.",
    categorySlug: "checklist",
    tags: ["event-marketing", "email-marketing"],
    coverImage: "https://picsum.photos/id/1011/900/520",
    authorId: "a1",
    publishedAt: "2024-11-01",
  },
  {
    id: "p2",
    title: "New Year’s Eve Event Ideas: Your Ultimate Guide & Checklist",
    slug: "new-years-eve-event-ideas",
    excerpt: "A step-by-step planning checklist for NYE parties and ticketing tips.",
    categorySlug: "checklist",
    tags: ["event-ideas", "event-planning"],
    coverImage: "https://picsum.photos/id/1025/900/520",
    authorId: "a2",
    publishedAt: "2024-12-10",
  },
  {
    id: "p3",
    title: "How to Plan a Christmas Party: The Eventbrite Checklist",
    slug: "plan-christmas-party-checklist",
    excerpt: "Budgeting, timelines, and promotion ideas for seasonal events.",
    categorySlug: "checklist",
    tags: ["christmas", "event-planning"],
    coverImage: "https://picsum.photos/id/1062/900/520",
    authorId: "a1",
    publishedAt: "2024-11-20",
  },
  {
    id: "p4",
    title: "Creative Networking Event Formats That Actually Work",
    slug: "creative-networking-formats",
    excerpt: "Interactive formats, icebreakers and time-boxed networking tips.",
    categorySlug: "event-ideas",
    tags: ["event-ideas"],
    coverImage: "https://picsum.photos/id/1035/900/520",
    authorId: "a2",
    publishedAt: "2025-01-05",
  },
];

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug) || null;
}

export function getPostsByCategory(categorySlug: string) {
  return posts.filter((p) => p.categorySlug === categorySlug);
}

export function getAllCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug) || null;
}

export function getAllTags() {
  return tags;
}

export function getPopularTags(limit = 6) {
  // mock: return first N tags — 可改成依文章數量排序
  return tags.slice(0, limit);
}

export function getAuthorById(id: string) {
  return authors.find((a) => a.id === id) || null;
}
