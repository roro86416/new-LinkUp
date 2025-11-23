export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  coverImageUrl: string | null;

  author: {
    id: string; // ✅ 改成 string
    name: string;
  };

  category: {
    id: number;
    name: string;
  };

  tags: { name: string }[];

  eventLink?: string;
}
