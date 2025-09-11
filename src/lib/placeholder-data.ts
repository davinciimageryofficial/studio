
import { Briefcase, DollarSign, Award, Users, TrendingUp, Workflow } from "lucide-react";
import React from "react";

export type PortfolioItem = {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
};


export type User = {
  id: string;
  name: string;
  handle: string;
  headline: string;
  bio: string;
  avatar: string;
  coverImage: string;
  skills: string[];
  portfolio: PortfolioItem[];
  category: "design" | "writing" | "development";
  jobTitle?: string;
  company?: string;
  verified?: boolean;
  reliabilityScore: number;
  communityStanding: string;
  communityFlags?: {
      reason: string;
      severity: 'low' | 'medium' | 'high';
  }[];
  currentSession?: {
    workspaceName: string;
    with: string[]; // Array of user IDs
  };
};

const designPortfolio: PortfolioItem[] = [
    { title: "E-commerce Platform Redesign", description: "A complete overhaul of a client's online store, focusing on a seamless user experience and modern UI.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["UI/UX", "Figma", "Webflow"] },
    { title: "Mobile Banking App Concept", description: "A concept for a neo-banking application with a focus on simplicity and intuitive financial management.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["Mobile App", "Prototyping"] },
    { title: "Brand Identity for 'Innovate'", description: "Developed a comprehensive brand guide, including logo, color palette, and typography for a tech startup.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["Branding", "Illustration"] },
    { title: "Interactive Data Visualization", description: "Designed an interactive dashboard for a data analytics company to visualize complex datasets.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["Data Viz", "UI Design"] },
];

const devPortfolio: PortfolioItem[] = [
    { title: "Real-time Collaborative Editor", description: "Built a web-based text editor allowing multiple users to collaborate simultaneously, using WebSockets and CRDTs.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["React", "Node.js", "WebSockets"] },
    { title: "Serverless E-commerce Backend", description: "Architected and deployed a scalable, serverless backend on AWS for an e-commerce platform.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["AWS", "Serverless", "TypeScript"] },
    { title: "Next.js Static Site Generator", description: "A custom static site generator built with Next.js for a documentation website, improving performance by over 200%.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["Next.js", "Performance"] },
    { title: "GraphQL API for Mobile App", description: "Developed a flexible and efficient GraphQL API to serve data to both iOS and Android applications.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["GraphQL", "API", "PostgreSQL"] },
];

const writingPortfolio: PortfolioItem[] = [
    { title: "The Ultimate Guide to B2B SaaS Content", description: "A 5,000-word cornerstone article that became the top-ranking piece for a major client in the SaaS industry.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["SEO", "Long-form", "B2B"] },
    { title: "Website Copy for 'Fintech Innovations'", description: "Wrote all website and landing page copy for a new fintech startup, resulting in a 25% increase in conversions.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["Copywriting", "Conversion"] },
    { title: "API Documentation for DevTools Co.", description: "Created comprehensive and easy-to-understand API documentation for a suite of developer tools.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["Technical Writing", "API Docs"] },
    { title: "Monthly Newsletter Campaign", description: "Managed and wrote a monthly newsletter for a design agency, achieving a 45% open rate.", imageUrl: "https://placehold.co/800x600/000000/000000", tags: ["Email Marketing", "Content Strategy"] },
];

export const placeholderUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    handle: "alicej",
    headline: "UX/UI Designer | Creating Intuitive Digital Experiences",
    bio: "Passionate about crafting user-centric designs that are both beautiful and functional. 10+ years of experience in the tech industry.",
    avatar: "https://placehold.co/200x200/000000/000000",
    coverImage: "https://placehold.co/1200x800/000000/000000",
    skills: ["UI/UX Design", "Figma", "Prototyping", "User Research", "Webflow"],
    portfolio: designPortfolio,
    category: "design",
    jobTitle: "Principal Designer",
    company: "Creative Co.",
    verified: true,
    reliabilityScore: 95,
    communityStanding: "Highly-rated member with a history of successful collaborations.",
  },
  {
    id: "2",
    name: "Christian Peta",
    handle: "chrisp",
    headline: "Senior Frontend Developer | React & Next.js Expert",
    bio: "Building performant and scalable web applications. I love TypeScript and clean code. Always eager to learn new technologies.",
    avatar: "https://placehold.co/200x200/000000/000000",
    coverImage: "https://placehold.co/1200x800/000000/000000",
    skills: ["React", "Next.js", "TypeScript", "GraphQL", "Tailwind CSS"],
    portfolio: devPortfolio,
    category: "development",
    jobTitle: "Senior Frontend Developer",
    company: "Innovate Inc.",
    verified: true,
    reliabilityScore: 98,
    communityStanding: "Established member with a strong record of positive feedback.",
  },
  {
    id: "3",
    name: "Charlie Brown",
    handle: "charlieb",
    headline: "Content Strategist & SEO Writer",
    bio: "Helping brands tell their story and rank higher on search engines. I specialize in long-form content for B2B SaaS companies.",
    avatar: "https://placehold.co/200x200/000000/000000",
    coverImage: "https://placehold.co/1200x800/000000/000000",
    skills: ["Content Strategy", "SEO", "Copywriting", "Blogging", "Ahrefs"],
    portfolio: writingPortfolio,
    category: "writing",
    jobTitle: "Head of Content",
    company: "StoryWeavers",
    verified: true,
    reliabilityScore: 45,
    communityStanding: "This member has multiple unresolved payment disputes.",
    communityFlags: [
        { reason: "Fraudulent activity detected", severity: "high" },
        { reason: "Unresolved payment dispute", severity: "medium" },
    ]
  },
  {
    id: "4",
    name: "Diana Prince",
    handle: "dianap",
    headline: "Full-Stack Developer | Node.js, Python, & Cloud",
    bio: "Architecting and building robust backend systems. Experienced with AWS and serverless architectures. Believer in DevOps culture.",
    avatar: "https://placehold.co/200x200/000000/000000",
    coverImage: "https://placehold.co/1200x800/000000/000000",
    skills: ["Node.js", "Python", "AWS", "Serverless", "PostgreSQL"],
    portfolio: devPortfolio.slice(0,2),
    category: "development",
    reliabilityScore: 88,
    communityStanding: "Reliable member with positive transaction history.",
    currentSession: {
        workspaceName: "Project Phoenix",
        with: ["1"], // With Alice Johnson
    }
  },
  {
    id: "5",
    name: "Ethan Hunt",
    handle: "ethanh",
    headline: "Brand & Visual Designer",
    bio: "Creating memorable brand identities and visual systems. My work is driven by strategy and a passion for detail.",
    avatar: "https://placehold.co/200x200/000000/000000",
    coverImage: "https://placehold.co/1200x800/000000/000000",
    skills: ["Branding", "Illustration", "Adobe Creative Suite", "Typography"],
    portfolio: designPortfolio.slice(1,3),
    category: "design",
    reliabilityScore: 75,
    communityStanding: "Newer member, proceed with standard caution.",
    communityFlags: [
        { reason: "Unresponsive to applicants", severity: "low" },
    ]
  },
  {
    id: "6",
    name: "Fiona Glenanne",
    handle: "fionag",
    headline: "Technical Writer & Documentation Specialist",
    bio: "Making complex topics easy to understand. I write clear, concise, and comprehensive documentation for developers and end-users.",
    avatar: "https://placehold.co/200x200/000000/000000",
    coverImage: "https://placehold.co/1200x800/000000/000000",
    skills: ["Technical Writing", "Docs-as-Code", "API Documentation", "Markdown"],
    portfolio: writingPortfolio.slice(0,2),
    category: "writing",
    jobTitle: "Senior Technical Writer",
    company: "Clearly Documented",
    verified: true,
    reliabilityScore: 92,
    communityStanding: "Consistent and professional member.",
  },
  {
    id: "7",
    name: "Future Labs",
    handle: "futurelabs",
    headline: "Innovation & Tech Consulting",
    bio: "We partner with startups and enterprises to build cutting-edge technology.",
    avatar: "https://placehold.co/200x200/000000/000000",
    coverImage: "https://placehold.co/1200x800/000000/000000",
    skills: ["AI/ML", "Web3", "Product Strategy"],
    portfolio: [],
    category: "development",
    reliabilityScore: 85,
    communityStanding: "Agency profile with a positive project history.",
  },
];

export type Post = {
  id: number;
  author: User;
  timestamp: string;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  retweets: number;
  views: string;
  type: 'post' | 'job';
  jobDetails?: {
    title: string;
    budget: string;
    keywords: string[];
  };
  replies?: Post[];
};


export const placeholderPosts: Post[] = [
  {
    id: 1,
    author: placeholderUsers[0],
    timestamp: "2h",
    content: `Just wrapped up a major redesign for a client's e-commerce platform. Focused on streamlining the checkout process and improving mobile navigation. The early feedback has been amazing! #UIDesign #UX`,
    image: null,
    likes: 102,
    comments: 15,
    retweets: 23,
    views: "10.2k",
    type: 'post',
    replies: [
        {
            id: 101,
            author: placeholderUsers[1],
            timestamp: "1h",
            content: "Looks fantastic, Alice! The new checkout flow is so smooth. Great work.",
            image: null,
            likes: 15,
            comments: 0,
            retweets: 2,
            views: "1.1k",
            type: 'post',
        },
        {
            id: 102,
            author: placeholderUsers[4],
            timestamp: "45m",
            content: "Love the clean aesthetic. Did you use a specific design system for this?",
            image: null,
            likes: 8,
            comments: 0,
            retweets: 1,
            views: "980",
            type: 'post',
            replies: [
                 {
                    id: 103,
                    author: placeholderUsers[0],
                    timestamp: "30m",
                    content: "Thanks, Ethan! We built a custom system for this client, but it was heavily inspired by Material Design.",
                    image: null,
                    likes: 10,
                    comments: 0,
                    retweets: 0,
                    views: "500",
                    type: 'post',
                },
            ]
        }
    ]
  },
  {
    id: 17,
    author: placeholderUsers[6],
    timestamp: "8h",
    content: `We're looking for a freelance Next.js developer for a 3-month contract to help us build a new marketing analytics dashboard. The ideal candidate has experience with data visualization libraries like D3.js or Recharts.`,
    image: null,
    likes: 45,
    comments: 12,
    retweets: 18,
    views: "12.1k",
    type: 'job',
    jobDetails: {
      title: "Freelance Next.js Developer",
      budget: "$8,000 - $12,000",
      keywords: ["Next.js", "Data Viz", "Contract"],
    }
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
    type: 'post',
  },
  {
    id: 3,
    author: placeholderUsers[2],
    timestamp: "1d",
    content: `Published a new blog post on "The Ultimate Guide to SEO in 2024". It covers everything from keyword research to link building strategies. Hope you find it useful! Link in bio. #SEO #ContentMarketing`,
    image: null,
    likes: 89,
    comments: 22,
    retweets: 41,
    views: "15.7k",
    type: 'post',
  },
   {
    id: 18,
    author: placeholderUsers[0],
    timestamp: "1d",
    content: `Hiring a UX writer to help us refine the copy for our new mobile application. This is a short-term project focused on onboarding flows and in-app notifications. Strong portfolio is a must!`,
    image: null,
    likes: 77,
    comments: 19,
    retweets: 25,
    views: "9.8k",
    type: 'job',
    jobDetails: {
      title: "Freelance UX Writer",
      budget: "$3,000",
      keywords: ["UX Writing", "Mobile", "Copywriting"],
    }
  },
  {
    id: 4,
    author: placeholderUsers[3],
    timestamp: "2d",
    content: `Just deployed a new microservice using serverless architecture on AWS. The performance gains are impressive, and the cost savings are even better. #serverless #aws #backend`,
    image: null,
    likes: 150,
    comments: 31,
    retweets: 50,
    views: "18.3k",
    type: 'post',
  },
  {
    id: 5,
    author: placeholderUsers[4],
    timestamp: "2d",
    content: `Experimenting with some new branding concepts for a client in the fintech space. Trying to balance a feeling of security with a modern, approachable vibe. It's a fun challenge! #branding #design #fintech`,
    image: null,
    likes: 95,
    comments: 12,
    retweets: 18,
    views: "8.9k",
    type: 'post',
  },
  {
    id: 6,
    author: placeholderUsers[5],
    timestamp: "3d",
    content: `My latest article on 'The Importance of Clear API Documentation' is now live. Good docs are a feature, not a chore. Check it out and let me know your thoughts! #techwriting #documentation #api`,
    image: null,
    likes: 72,
    comments: 18,
    retweets: 33,
    views: "7.1k",
    type: 'post',
  },
  {
    id: 7,
    author: placeholderUsers[1],
    timestamp: "3d",
    content: `What's your favorite utility for state management in React? I've been using Zustand a lot lately and loving its simplicity. #reactdev #javascript #statemanagement`,
    image: null,
    likes: 188,
    comments: 68,
    retweets: 45,
    views: "22.5k",
    type: 'post',
  },
  {
    id: 8,
    author: placeholderUsers[0],
    timestamp: "4d",
    content: `Thinking about accessibility from the start of a project is crucial. It's not an add-on, it's a core part of creating inclusive and effective products. What are your go-to a11y resources? #accessibility #a11y #uxdesign`,
    image: null,
    likes: 121,
    comments: 24,
    retweets: 30,
    views: "11.4k",
    type: 'post',
  },
  {
    id: 9,
    author: placeholderUsers[2],
    timestamp: "5d",
    content: `The key to great B2B content is understanding the customer's pain points inside and out. Don't just sell features, sell solutions to their problems. #b2bmarketing #contentstrategy`,
    image: null,
    likes: 65,
    comments: 9,
    retweets: 21,
    views: "6.8k",
    type: 'post',
  },
  {
    id: 10,
    author: placeholderUsers[3],
    timestamp: "5d",
    content: `Refactoring a legacy codebase can be daunting, but so rewarding. Finding those small wins and performance improvements is the best feeling. #coding #softwaredevelopment #python`,
    image: null,
    likes: 133,
    comments: 29,
    retweets: 35,
    views: "14.9k",
    type: 'post',
  },
  {
    id: 11,
    author: placeholderUsers[4],
    timestamp: "6d",
    content: `A powerful logo is more than just a pretty picture; it's the cornerstone of a brand's identity. It should be simple, memorable, and timeless. #logodesign #branding`,
    image: null,
    likes: 210,
    comments: 35,
    retweets: 60,
    views: "20.1k",
    type: 'post',
  },
  {
    id: 12,
    author: placeholderUsers[5],
    timestamp: "1w",
    content: `Great documentation empowers users and reduces support tickets. It's an investment that pays for itself over and over. #technicalwriting #userguides`,
    image: null,
    likes: 55,
    comments: 11,
    retweets: 25,
    views: "5.2k",
    type: 'post',
  },
  {
    id: 13,
    author: placeholderUsers[0],
    timestamp: "1w",
    content: `Just finished a user research sprint for a new mobile app. The insights we gathered are going to be a game-changer for the product roadmap. Never underestimate the power of talking to your users! #userresearch #ux`,
    image: null,
    likes: 142,
    comments: 19,
    retweets: 41,
    views: "13.5k",
    type: 'post',
  },
  {
    id: 14,
    author: placeholderUsers[1],
    timestamp: "1w",
    content: `The new features in Next.js 15 are looking incredible. The team is really pushing the boundaries of what's possible on the web. Can't wait to start building with it. #webdev #nextjs`,
    image: null,
    likes: 301,
    comments: 55,
    retweets: 110,
    views: "35.6k",
    type: 'post',
  },
  {
    id: 15,
    author: placeholderUsers[3],
    timestamp: "2w",
    content: `Setting up a new CI/CD pipeline with GitHub Actions. The level of automation you can achieve is fantastic for team productivity. #devops #cicd #github`,
    image: null,
    likes: 98,
    comments: 14,
    retweets: 28,
    views: "9.1k",
    type: 'post',
  },
  {
    id: 16,
    author: placeholderUsers[2],
    timestamp: "2w",
    content: `What are your best tips for beating writer's block? My go-to is to step away from the screen and go for a long walk. It works wonders! #writing #creativity`,
    image: null,
    likes: 78,
    comments: 34,
    retweets: 19,
    views: "7.7k",
    type: 'post',
  },
];

export const placeholderMessages = [
  {
    id: "msg1",
    userId: "1",
    messages: [
      { from: "1", text: "Hey Chris, saw your profile on Sentry. Your frontend projects look really solid.", time: "10:31 AM" },
      { from: "me", text: "Thanks, Alice! I appreciate that. Your design work is incredible!", time: "10:30 AM" },
      { from: "1", text: "I'm looking for a developer for a new side project. It's a mobile app for local event discovery. Would you be interested in hearing more?", time: "10:32 AM" },
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
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "2",
        category: "Platforms",
        title: "Connective Unveils 'Sentry', a New Platform for Creative Professionals to Network and Collaborate",
        author: "Maria Rodriguez",
        date: "1 day ago",
        excerpt: "The professional networking space gets a new contender today with the launch of Sentry, a platform designed specifically for freelancers and creatives.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "3",
        category: "Freelance",
        title: "The Rise of 'Micro-Teams': How Freelancers are Shaping the Future of Work",
        author: "David Smith",
        date: "3 days ago",
        excerpt: "Forget the traditional 9-to-5. A new trend is emerging where elite freelancers form small, agile teams to tackle complex projects for major corporations.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
     {
        id: "4",
        category: "UI/UX",
        title: "Is Neobrutalism the Future of UI Design? A Deep Dive.",
        author: "Emily White",
        date: "4 days ago",
        excerpt: "Characterized by raw elements, bold typography, and a stark honesty, neobrutalism is taking the design world by storm. We explore its origins and impact.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "5",
        category: "Freelance",
        title: "How to Price Your Services as a Creative Freelancer",
        author: "John Doe",
        date: "5 days ago",
        excerpt: "Struggling to figure out your rates? This guide breaks down the different pricing models and helps you find the one that works for you.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "6",
        category: "Writing",
        title: "The Art of Storytelling in Brand Marketing",
        author: "Jane Austen",
        date: "6 days ago",
        excerpt: "Discover how to craft compelling narratives that resonate with your audience and build lasting brand loyalty. It's not just about what you sell, but the story you tell.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "7",
        category: "Development",
        title: "A Guide to State Management in Modern React Applications",
        author: "Ada Lovelace",
        date: "1 week ago",
        excerpt: "From Zustand to Jotai, we explore the landscape of state management libraries in the React ecosystem beyond Redux.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "8",
        category: "Cybersecurity",
        title: "Protecting Your Digital Assets: A Guide for Freelancers",
        author: "Alan Turing",
        date: "1 week ago",
        excerpt: "As a freelancer, you're a target. Learn how to secure your devices, data, and client information from cyber threats.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "9",
        category: "Data Science",
        title: "The Impact of Big Data on Creative Industries",
        author: "Grace Hopper",
        date: "2 weeks ago",
        excerpt: "Data is not just for tech companies. See how creatives are using data to inform their work, from film production to music composition.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "10",
        category: "Cloud Computing",
        title: "Serverless for Startups: A Cost-Effective Approach to Scaling",
        author: "Vint Cerf",
        date: "2 weeks ago",
        excerpt: "Learn how serverless architectures can help your startup scale without breaking the bank on infrastructure costs.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "11",
        category: "Events",
        title: "Design Forward 2024: A Recap of the Biggest Announcements",
        author: "Casey Newton",
        date: "Yesterday",
        excerpt: "From AI-powered design tools to the latest trends in sustainable design, here's everything you missed from this year's landmark conference.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "12",
        category: "Spotlight",
        title: "From Side Project to Unicorn: The Story of Sentry",
        author: "Kara Swisher",
        date: "2 days ago",
        excerpt: "An in-depth look at how a small team of developers and designers built a platform that's changing the game for creative professionals.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "13",
        category: "Tech",
        title: "Quantum Computing: What Creatives Need to Know",
        author: "Ben Goertzel",
        date: "3 weeks ago",
        excerpt: "Quantum computing isn't just for scientists. We explore how this emerging technology could revolutionize creative fields from design to music.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "14",
        category: "Design",
        title: "The Psychology of Color in Branding",
        author: "Jessica Walsh",
        date: "3 weeks ago",
        excerpt: "A deep dive into how color theory influences consumer perception and how to choose the perfect palette for your brand.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "15",
        category: "Development",
        title: "WebAssembly: The Future of High-Performance Web Apps",
        author: "Brendan Eich",
        date: "4 weeks ago",
        excerpt: "Is JavaScript's reign ending? We explore how WebAssembly is enabling near-native performance for web applications.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "16",
        category: "Freelance",
        title: "Navigating the Gig Economy: How to Stand Out",
        author: "Sara Horowitz",
        date: "1 month ago",
        excerpt: "The founder of the Freelancers Union shares her tips for thriving in the competitive gig economy and building a sustainable career.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    }
];

export const placeholderCourses = [
    {
        id: "course1",
        title: "Advanced TypeScript for Modern Applications",
        author: "Christian Peta",
        price: 149.99,
        category: "Development",
        description: "Take your TypeScript skills to the next level. Learn advanced patterns, decorators, and how to build type-safe, enterprise-grade applications.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
        level: "Advanced",
    },
    {
        id: "course2",
        title: "Figma Mastery: From Beginner to Pro",
        author: "Alice Johnson",
        price: 99.99,
        category: "Design",
        description: "A comprehensive guide to Figma. Master components, auto layout, and prototyping to create stunning and efficient designs.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
        level: "Beginner",
    },
    {
        id: "course3",
        title: "SEO-Driven Content Strategy",
        author: "Charlie Brown",
        price: 199.99,
        category: "Writing",
        description: "Learn how to create a content strategy that drives organic traffic. This course covers keyword research, on-page SEO, and content promotion.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
        level: "Intermediate",
    },
     {
        id: "course4",
        title: "Building Serverless APIs with Node.js",
        author: "Diana Prince",
        price: 129.99,
        category: "Development",
        description: "Learn how to build, deploy, and scale serverless APIs on AWS using Node.js, API Gateway, and Lambda. No servers, no problem.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
        level: "Intermediate",
    },
    {
        id: "course5",
        title: "Introduction to Generative AI",
        author: "Alan Turing",
        price: 249.99,
        category: "AI & Machine Learning",
        description: "Explore the fundamentals of generative AI, including large language models, diffusion models, and their applications.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
        level: "Beginner",
    },
    {
        id: "course6",
        title: "Practical Data Science with Python",
        author: "Grace Hopper",
        price: 179.99,
        category: "Data Science",
        description: "Get hands-on experience with Pandas, Scikit-learn, and Matplotlib to analyze data and build predictive models.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
        level: "Intermediate",
    },
];

export const placeholderPodcasts = [
    {
        id: "podcast1",
        title: "The Design Details Podcast",
        author: "Alice Johnson & Ethan Hunt",
        category: "Design",
        description: "A weekly podcast about the details of design. We dive into the latest trends, tools, and challenges facing designers today.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "podcast2",
        title: "Code & Coffee",
        author: "Christian Peta",
        category: "Development",
        description: "A morning show for developers. Join Bob as he discusses the latest news in the world of web development, from new frameworks to career advice.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "podcast3",
        title: "The Freelance Journey",
        author: "Fiona Glenanne",
        category: "Freelance",
        description: "Interviews with successful freelancers from various fields. Learn about their journey, challenges, and what it takes to succeed on your own.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "podcast4",
        title: "Cyber Chats",
        author: "Alan Turing",
        category: "Cybersecurity",
        description: "A podcast dedicated to the world of cybersecurity. We discuss the latest threats, vulnerabilities, and how to stay safe in a digital world.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
    {
        id: "podcast5",
        title: "UI/UX Insights",
        author: "Alice Johnson",
        category: "UI/UX",
        description: "Deep dives into user interface and user experience design principles, case studies, and interviews with industry leaders.",
        imageUrl: "https://placehold.co/600x400/000000/000000",
    },
];

export const monthlyProductivityData = [
  { month: "Jan", projects: 2, revenue: 4.5, rating: 4.2, impressions: 5000, acquisition: 1, revPerProject: 2.25 },
  { month: "Feb", projects: 3, revenue: 6.0, rating: 4.5, impressions: 7500, acquisition: 2, revPerProject: 2.0 },
  { month: "Mar", projects: 4, revenue: 8.2, rating: 4.7, impressions: 9000, acquisition: 2, revPerProject: 2.05 },
  { month: "Apr", projects: 3, revenue: 7.0, rating: 4.6, impressions: 8500, acquisition: 1, revPerProject: 2.33 },
  { month: "May", projects: 5, revenue: 10.5, rating: 4.9, impressions: 12000, acquisition: 3, revPerProject: 2.1 },
  { month: "Jun", projects: 4, revenue: 9.0, rating: 4.8, impressions: 11000, acquisition: 2, revPerProject: 2.25 },
];

export const weeklyProductivityData = [
  { week: "W1", projects: 0, revenue: 1.1, rating: 4.3, impressions: 1200, acquisition: 0, revPerProject: 0 },
  { week: "W2", projects: 1, revenue: 1.5, rating: 4.5, impressions: 1800, acquisition: 1, revPerProject: 1.5 },
  { week: "W3", projects: 1, revenue: 2.0, rating: 4.4, impressions: 2200, acquisition: 0, revPerProject: 2.0 },
  { week: "W4", projects: 1, revenue: 2.5, rating: 4.6, impressions: 2800, acquisition: 1, revPerProject: 2.5 },
  { week: "W5", projects: 0, revenue: 1.0, rating: 4.7, impressions: 1500, acquisition: 0, revPerProject: 0 },
  { week: "W6", projects: 2, revenue: 3.5, rating: 4.8, impressions: 4000, acquisition: 1, revPerProject: 1.75 },
];

export const dailyProductivityData = [
  { day: "Mon", projects: 0, revenue: 0.2, rating: 4.5, impressions: 300, acquisition: 0, revPerProject: 0 },
  { day: "Tue", projects: 1, revenue: 0.5, rating: 4.6, impressions: 500, acquisition: 1, revPerProject: 0.5 },
  { day: "Wed", projects: 0, revenue: 0.3, rating: 4.5, impressions: 400, acquisition: 0, revPerProject: 0 },
  { day: "Thu", projects: 0, revenue: 0.8, rating: 4.7, impressions: 700, acquisition: 0, revPerProject: 0 },
  { day: "Fri", projects: 1, revenue: 1.2, rating: 4.8, impressions: 1000, acquisition: 0, revPerProject: 1.2 },
  { day: "Sat", projects: 0, revenue: 0.1, rating: 4.9, impressions: 200, acquisition: 0, revPerProject: 0 },
  { day: "Sun", projects: 0, revenue: 0, rating: 5.0, impressions: 150, acquisition: 0, revPerProject: 0 },
];

export const agencyMetricsData = {
  operationalExcellence: {
    title: "Operational Excellence",
    categories: [
      {
        title: "Efficiency",
        icon: React.createElement(TrendingUp, { className: "h-5 w-5" }),
        metrics: [
          { name: "Project Turnaround Time", value: "12.5 days", change: "-8%", trend: "positive" as const },
          { name: "Resource Utilization Rate", value: "82%", change: "+3%", trend: "positive" as const },
          { name: "Task Completion Rate", value: "94%", change: "+1%", trend: "neutral" as const },
        ],
      },
      {
        title: "Productivity",
        icon: React.createElement(Briefcase, { className: "h-5 w-5" }),
        metrics: [
          { name: "Total Billable Hours (Month)", value: "482 hrs", change: "+15%", trend: "positive" as const },
          { name: "Output per Employee", value: "3.1 Projects", change: "+0.2", trend: "positive" as const },
          { name: "Work-in-Progress (WIP) Limit", value: "10 / 12 projects", change: "", trend: "neutral" as const },
        ],
      },
      {
        title: "Process & Workflow",
        icon: React.createElement(Workflow, { className: "h-5 w-5" }),
        metrics: [
            { name: "On-Time Delivery Rate", value: "96%", change: "+2%", trend: "positive" as const },
            { name: "Workflow Bottlenecks (Avg. Wait)", value: "8 hours", change: "-12%", trend: "positive" as const },
            { name: "Automation Rate", value: "35%", change: "+10%", trend: "positive" as const },
        ],
      }
    ],
  },
  clientAndFinancialHealth: {
    title: "Client & Financial Health",
    categories: [
       {
        title: "Financials",
        icon: React.createElement(DollarSign, { className: "h-5 w-5" }),
        metrics: [
          { name: "Profit Margin", value: "28%", change: "+2%", trend: "positive" as const },
          { name: "Revenue per Employee", value: "$12,850", change: "+5%", trend: "positive" as const },
          { name: "Avg. Cost per Project", value: "$4,200", change: "-3%", trend: "positive" as const },
        ],
      },
      {
        title: "Client Health",
        icon: React.createElement(Users, { className: "h-5 w-5" }),
        metrics: [
          { name: "Client Retention Rate", value: "88%", change: "-1%", trend: "negative" as const },
          { name: "Client Acquisition Cost (CAC)", value: "$1,500", change: "+10%", trend: "negative" as const },
          { name: "Client Lifetime Value (CLV)", value: "$45,000", change: "+8%", trend: "positive" as const },
          { name: "Avg. Response Time", value: "3.2 hours", change: "-15%", trend: "positive" as const },
        ],
      },
      {
        title: "Quality & Satisfaction",
        icon: React.createElement(Award, { className: "h-5 w-5" }),
        metrics: [
            { name: "Error Rate (Post-Launch)", value: "1.2%", change: "-0.5%", trend: "positive" as const },
            { name: "Client Satisfaction (CSAT)", value: "4.7 / 5.0", change: "+0.1", trend: "positive" as const },
            { name: "Net Promoter Score (NPS)", value: "52", change: "+5", trend: "positive" as const },
        ],
      },
    ],
  },
};


export const timeManagementData = {
  billableHours: [
    { name: 'Week 1', billable: 32, nonBillable: 8 },
    { name: 'Week 2', billable: 35, nonBillable: 5 },
    { name: 'Week 3', billable: 28, nonBillable: 12 },
    { name: 'Week 4', billable: 38, nonBillable: 7 },
  ],
  taskCompletion: [
    { name: 'Q1', onTime: 95, late: 5 },
    { name: 'Q2', onTime: 92, late: 8 },
    { name: 'Q3', onTime: 97, late: 3 },
    { name: 'Q4', onTime: 94, late: 6 },
  ],
  timePerDeliverable: [
    { name: 'Blog Post', hours: 4.5 },
    { name: 'Logo Design', hours: 12 },
    { name: 'Web Page Dev', hours: 25 },
    { name: 'Marketing Campaign', hours: 40 },
  ],
};

export const financialHealthData = {
  incomeSources: [
    { name: 'Client A', value: 40, fill: "hsl(var(--chart-1))" },
    { name: 'Client B', value: 25, fill: "hsl(var(--chart-2))" },
    { name: 'Client C', value: 15, fill: "hsl(var(--chart-3))" },
    { name: 'Other', value: 20, fill: "hsl(var(--chart-4))" },
  ],
  cashFlow: [
    { month: 'Jan', revenue: 10000, expenses: 8000 },
    { month: 'Feb', revenue: 12000, expenses: 9000 },
    { month: 'Mar', revenue: 9000, expenses: 9500 },
    { month: 'Apr', revenue: 15000, expenses: 10000 },
    { month: 'May', revenue: 13000, expenses: 11000 },
    { month: 'Jun', revenue: 16000, expenses: 12000 },
  ]
};

export const clientManagementData = {
  retentionRate: 85,
  avgProjectValue: 5500,
  leadConversion: [
    { stage: 'Inquiries', value: 100 },
    { stage: 'Proposals Sent', value: 40 },
    { stage: 'Projects Won', value: 12 },
  ],
  referralRate: 35,
};

export const qualityPerformanceData = {
  revisionRate: 15,
  satisfactionScore: 4.8,
  portfolioUpdates: [
    { month: 'Jan', count: 2 },
    { month: 'Feb', count: 1 },
    { month: 'Mar', count: 3 },
    { month: 'Apr', count: 2 },
    { month: 'May', count: 4 },
    { month: 'Jun', count: 2 },
  ],
};
