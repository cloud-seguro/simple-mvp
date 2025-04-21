export enum BlogPostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  tags: string[];
  status: BlogPostStatus;
  featuredImage?: string;
  description?: string;
}
