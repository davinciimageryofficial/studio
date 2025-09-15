
export type PortfolioItem = {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
};

export type Experience = {
    id?: number;
    user_id?: string;
    title: string;
    company: string;
    duration: string;
    description?: string;
    start_date?: string;
    end_date?: string | null;
};

export type User = {
  id: string;
  name: string;
  handle?: string;
  headline: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  skills: string[];
  portfolio: PortfolioItem[];
  category: "design" | "writing" | "development";
  jobTitle?: string;
  company?: string;
  verified?: boolean;
  reliabilityScore: number;
  communityStanding: string;
  disputes: number;
  communityFlags?: {
      reason: string;
      severity: 'low' | 'medium' | 'high';
  }[];
  currentSession?: {
    workspaceName: string;
    with: string[]; // Array of user IDs
  };
};

export type Post = {
  id: number;
  author: User;
  author_id: string;
  created_at: string;
  content: string;
  image: string | null;
  likes_count: number;
  replies_count: number;
  reposts_count: number;
  views_count: number;
  type: 'post' | 'job';
  jobDetails?: {
    title: string;
    budget: string;
    keywords: string[];
  };
  replies?: Post[];
};


export type Course = {
    id: string;
    title: string;
    author: string;
    price: number;
    category: string;
    description: string;
    image_url: string;
    level: string;
}
