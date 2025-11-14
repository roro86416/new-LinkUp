import { Post } from "./post";

export interface Author {
  id: string;
  name: string;
  bio: string;
  posts: Post[];
}
