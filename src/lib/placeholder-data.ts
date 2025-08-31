
export type User = {
  id: string;
  name: string;
  handle: string;
  headline: string;
  bio: string;
  avatar: string;
  coverImage: string;
  skills: string[];
  portfolio: string[];
  category: "design" | "writing" | "development";
  jobTitle?: string;
  company?: string;
  verified?: boolean;
};

export const placeholderUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    handle: "alicej",
    headline: "UX/UI Designer | Creating Intuitive Digital Experiences",
    bio: "Passionate about crafting user-centric designs that are both beautiful and functional. 10+ years of experience in the tech industry.",
    avatar: "https://picsum.photos/id/1027/100/100",
    coverImage: "https://picsum.photos/seed/1/1000/300",
    skills: ["UI/UX Design", "Figma", "Prototyping", "User Research", "Webflow"],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/p1-${i}/400/300`),
    category: "design",
    jobTitle: "Principal Designer",
    company: "Creative Co.",
    verified: true,
  },
  {
    id: "2",
    name: "Bob Williams",
    handle: "bobw",
    headline: "Senior Frontend Developer | React & Next.js Expert",
    bio: "Building performant and scalable web applications. I love TypeScript and clean code. Always eager to learn new technologies.",
    avatar: "https://picsum.photos/id/1005/100/100",
    coverImage: "https://picsum.photos/seed/2/1000/300",
    skills: ["React", "Next.js", "TypeScript", "GraphQL", "Tailwind CSS"],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/p2-${i}/400/300`),
    category: "development",
    jobTitle: "Senior Frontend Developer",
    company: "Innovate Inc.",
    verified: true,
  },
  {
    id: "3",
    name: "Charlie Brown",
    handle: "charlieb",
    headline: "Content Strategist & SEO Writer",
    bio: "Helping brands tell their story and rank higher on search engines. I specialize in long-form content for B2B SaaS companies.",
    avatar: "https://picsum.photos/id/1011/100/100",
    coverImage: "https://picsum.photos/seed/3/1000/300",
    skills: ["Content Strategy", "SEO", "Copywriting", "Blogging", "Ahrefs"],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/p3-${i}/400/300`),
    category: "writing",
    jobTitle: "Head of Content",
    company: "StoryWeavers",
    verified: true,
  },
  {
    id: "4",
    name: "Diana Prince",
    handle: "dianap",
    headline: "Full-Stack Developer | Node.js, Python, & Cloud",
    bio: "Architecting and building robust backend systems. Experienced with AWS and serverless architectures. Believer in DevOps culture.",
    avatar: "https://picsum.photos/id/1012/100/100",
    coverImage: "https://picsum.photos/seed/4/1000/300",
    skills: ["Node.js", "Python", "AWS", "Serverless", "PostgreSQL"],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/p4-${i}/400/300`),
    category: "development",
  },
  {
    id: "5",
    name: "Ethan Hunt",
    handle: "ethanh",
    headline: "Brand & Visual Designer",
    bio: "Creating memorable brand identities and visual systems. My work is driven by strategy and a passion for detail.",
    avatar: "https://picsum.photos/id/1013/100/100",
    coverImage: "https://picsum.photos/seed/5/1000/300",
    skills: ["Branding", "Illustration", "Adobe Creative Suite", "Typography"],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/p5-${i}/400/300`),
    category: "design",
  },
  {
    id: "6",
    name: "Fiona Glenanne",
    handle: "fionag",
    headline: "Technical Writer & Documentation Specialist",
    bio: "Making complex topics easy to understand. I write clear, concise, and comprehensive documentation for developers and end-users.",
    avatar: "https://picsum.photos/id/1014/100/100",
    coverImage: "https://picsum.photos/seed/6/1000/300",
    skills: ["Technical Writing", "Docs-as-Code", "API Documentation", "Markdown"],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/p6-${i}/400/300`),
    category: "writing",
    jobTitle: "Senior Technical Writer",
    company: "Clearly Documented",
    verified: true,
  },
];

export const placeholderPosts = [
  {
    id: 1,
    author: placeholderUsers[0],
    timestamp: "2h",
    content: `Just wrapped up a major redesign for a client's e-commerce platform. Focused on streamlining the checkout process and improving mobile navigation. The early feedback has been amazing! #UIDesign #UX`,
    image: "https://picsum.photos/seed/post1/600/400",
    likes: 102,
    comments: 15,
    retweets: 23,
    views: "10.2k",
  },
  {
    id: 2,
    author: placeholderUsers[1],
    timestamp: "5h",
    content: `Excited to share that I'll be speaking at React Conf next month! I'll be diving deep into server components and the future of web development. Who else is going? #React #NextJS`,
    image: null,
    likes: 256,
    comments: 45,
    retweets: 88,
    views: "25.1k",
  },
  {
    id: 3,
    author: placeholderUsers[2],
    timestamp: "1d",
    content: `Published a new blog post on "The Ultimate Guide to SEO in 2024". It covers everything from keyword research to link building strategies. Hope you find it useful! Link in bio. #SEO #ContentMarketing`,
    image: "https://picsum.photos/seed/post3/600/400",
    likes: 89,
    comments: 22,
    retweets: 41,
    views: "15.7k",
  },
];

export const placeholderMessages = [
  {
    id: "msg1",
    userId: "2",
    messages: [
      { from: "2", text: "Hey Alice, saw your profile on Sentry. Your design work is incredible!", time: "10:30 AM" },
      { from: "me", text: "Thanks, Bob! I appreciate that. Your frontend projects look really solid.", time: "10:31 AM" },
      { from: "2", text: "I'm looking for a designer for a new side project. It's a mobile app for local event discovery. Would you be interested in hearing more?", time: "10:32 AM" },
    ],
  },
   {
    id: "msg2",
    userId: "3",
    messages: [
      { from: "3", text: "Hi there! I'm looking for a developer to help build out a new blog. Your experience with Next.js seems like a perfect fit.", time: "Yesterday" },
      { from: "me", text: "Hi Charlie. Happy to chat. What kind of features are you looking for?", time: "Yesterday" },
    ],
  },
];

export const placeholderNews = [
    {
        id: "1",
        category: "AI & Machine Learning",
        title: "AI Startup 'Innovate' Raises $50M Series B to Revolutionize Code Generation",
        author: "Alex Chen",
        date: "2 hours ago",
        excerpt: "Innovate, a company building AI-powered tools for developers, announced today it has closed a $50 million Series B funding round led by Future Ventures.",
        imageUrl: "https://picsum.photos/seed/news1/600/400",
    },
    {
        id: "2",
        category: "Tech",
        title: "Connective Unveils 'Sentry', a New Platform for Creative Professionals to Network and Collaborate",
        author: "Maria Rodriguez",
        date: "1 day ago",
        excerpt: "The professional networking space gets a new contender today with the launch of Sentry, a platform designed specifically for freelancers and creatives.",
        imageUrl: "https://picsum.photos/seed/news2/600/400",
    },
    {
        id: "3",
        category: "Freelance",
        title: "The Rise of 'Micro-Teams': How Freelancers are Shaping the Future of Work",
        author: "David Smith",
        date: "3 days ago",
        excerpt: "Forget the traditional 9-to-5. A new trend is emerging where elite freelancers form small, agile teams to tackle complex projects for major corporations.",
        imageUrl: "https://picsum.photos/seed/news3/600/400",
    },
     {
        id: "4",
        category: "UI/UX",
        title: "Is Neobrutalism the Future of UI Design? A Deep Dive.",
        author: "Emily White",
        date: "4 days ago",
        excerpt: "Characterized by raw elements, bold typography, and a stark honesty, neobrutalism is taking the design world by storm. We explore its origins and impact.",
        imageUrl: "https://picsum.photos/seed/news4/600/400",
    },
    {
        id: "5",
        category: "Freelance",
        title: "How to Price Your Services as a Creative Freelancer",
        author: "John Doe",
        date: "5 days ago",
        excerpt: "Struggling to figure out your rates? This guide breaks down the different pricing models and helps you find the one that works for you.",
        imageUrl: "https://picsum.photos/seed/news5/600/400",
    },
    {
        id: "6",
        category: "Writing",
        title: "The Art of Storytelling in Brand Marketing",
        author: "Jane Austen",
        date: "6 days ago",
        excerpt: "Discover how to craft compelling narratives that resonate with your audience and build lasting brand loyalty. It's not just about what you sell, but the story you tell.",
        imageUrl: "https://picsum.photos/seed/news6/600/400",
    },
    {
        id: "7",
        category: "Development",
        title: "A Guide to State Management in Modern React Applications",
        author: "Ada Lovelace",
        date: "1 week ago",
        excerpt: "From Zustand to Jotai, we explore the landscape of state management libraries in the React ecosystem beyond Redux.",
        imageUrl: "https://picsum.photos/seed/news7/600/400",
    },
    {
        id: "8",
        category: "Cybersecurity",
        title: "Protecting Your Digital Assets: A Guide for Freelancers",
        author: "Alan Turing",
        date: "1 week ago",
        excerpt: "As a freelancer, you're a target. Learn how to secure your devices, data, and client information from cyber threats.",
        imageUrl: "https://picsum.photos/seed/news8/600/400",
    },
    {
        id: "9",
        category: "Data Science",
        title: "The Impact of Big Data on Creative Industries",
        author: "Grace Hopper",
        date: "2 weeks ago",
        excerpt: "Data is not just for tech companies. See how creatives are using data to inform their work, from film production to music composition.",
        imageUrl: "https://picsum.photos/seed/news9/600/400",
    },
    {
        id: "10",
        category: "Cloud Computing",
        title: "Serverless for Startups: A Cost-Effective Approach to Scaling",
        author: "Vint Cerf",
        date: "2 weeks ago",
        excerpt: "Learn how serverless architectures can help your startup scale without breaking the bank on infrastructure costs.",
        imageUrl: "https://picsum.photos/seed/news10/600/400",
    }
];
