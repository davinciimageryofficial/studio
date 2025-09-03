
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { placeholderPosts, placeholderUsers } from "@/lib/placeholder-data";
import {
  MessageCircle,
  Heart,
  Repeat2,
  MoreHorizontal,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Briefcase,
  Bot,
  PenSquare,
} from "lucide-react";
import Image from "next/image";
import { ConversationStarters } from "../conversation-starters";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { analyzePost, AnalyzePostOutput } from "@/ai/flows/post-analyzer";
import { generatePost, PostGeneratorOutput } from "@/ai/flows/post-generator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ClientOnly } from "@/components/layout/client-only";
import { cn } from "@/lib/utils";

type Post = (typeof placeholderPosts)[0];

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>(placeholderPosts);
    const [isCreatePostExpanded, setIsCreatePostExpanded] = useState(true);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                if (!isHovering) {
                  setIsCreatePostExpanded(false);
                }
            } else {
                setIsCreatePostExpanded(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isHovering]);
    
    const addPost = (newPostData: PostGeneratorOutput) => {
        const author = placeholderUsers.find(u => u.id === newPostData.authorId);
        if (author) {
            const newPost: Post = {
                ...newPostData,
                author,
            };
            setPosts(prevPosts => [newPost, ...prevPosts]);
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
        if (window.scrollY > 50) {
            setIsCreatePostExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (window.scrollY > 50) {
            setIsCreatePostExpanded(false);
        }
    };

  return (
      <div className="flex h-full min-h-screen">
        <main className="flex-1 bg-background p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-2xl">
            <div className="sticky top-[70px] z-10 bg-background transition-all duration-300 pb-2">
              <ClientOnly>
                  <CreatePostCard 
                    onPostGenerated={addPost} 
                    isMinimized={!isCreatePostExpanded}
                    onExpand={() => setIsCreatePostExpanded(true)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
              </ClientOnly>
            </div>
            <div className="mt-6 space-y-6">
              {posts.map((post) => (
                <ClientOnly key={post.id}>
                    <PostCard post={post} />
                </ClientOnly>
              ))}
            </div>
          </div>
        </main>
        <aside className="hidden w-80 flex-col border-l p-6 lg:flex">
            <ClientOnly>
              <ConversationStarters />
            </ClientOnly>
        </aside>
      </div>
  );
}

function CreatePostCard({ 
    onPostGenerated, 
    isMinimized, 
    onExpand,
    onMouseEnter,
    onMouseLeave,
}: { 
    onPostGenerated: (post: PostGeneratorOutput) => void, 
    isMinimized: boolean, 
    onExpand: () => void,
    onMouseEnter: () => void,
    onMouseLeave: () => void,
}) {
  const [postContent, setPostContent] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalyzePostOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleAnalyze = async () => {
    if (!postContent.trim()) {
      setError("Please write something before analyzing.");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    const currentUser = placeholderUsers[1];

    try {
      const result = await analyzePost({
        postContent,
        userProfile: {
          headline: currentUser.headline,
          bio: currentUser.bio,
          skills: currentUser.skills,
        },
        targetAudience: "Professionals in the tech and creative industries.",
      });
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError("Failed to analyze the post. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
        // For simplicity, we'll randomly pick a persona.
        const personas = ["developer", "designer", "writer"] as const;
        const randomPersona = personas[Math.floor(Math.random() * personas.length)];
        const result = await generatePost({ persona: randomPersona });
        onPostGenerated(result);
        setPostContent(""); // Clear content after generating
    } catch(e) {
        console.error(e);
        setError("Failed to generate a post. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  }
  
  const handleMouseLeaveCard = () => {
    if (!isFocused) {
        onMouseLeave();
    }
  }

  if (isMinimized) {
    return (
        <Card 
            className="cursor-pointer transition-all bg-black/80 backdrop-blur-sm hover:bg-black" 
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onExpand}
        >
            <CardContent className="p-2">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white flex-shrink-0 h-8 w-8">
                        <PenSquare className="h-5 w-5" />
                    </Button>
                    <div className="text-white/80 flex-1">Write a post...</div>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="transition-all" onMouseEnter={onMouseEnter} onMouseLeave={handleMouseLeaveCard}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src="https://picsum.photos/id/1005/40/40" data-ai-hint="man portrait" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <Textarea
              placeholder="What's on your mind?"
              className="mb-2 min-h-20 w-full resize-none border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAnalyze}
                      disabled={!postContent.trim() || isAnalyzing}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isAnalyzing ? "Analyzing..." : "Analyze Post"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>AI Post Analysis</DialogTitle>
                    </DialogHeader>
                    {isAnalyzing && (
                      <div className="space-y-4 py-4">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-4 w-1/3" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                      </div>
                    )}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {analysisResult && (
                      <div className="py-4 space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Suggestions</h4>
                          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            {analysisResult.suggestions.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Perception Analysis</h4>
                          <div className="space-y-4">
                            {analysisResult.perceptionAnalysis.map((metric) => (
                              <div key={metric.metric}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{metric.metric}</span>
                                  <span className="text-sm font-bold">{metric.score}/100</span>
                                </div>
                                <Progress value={metric.score} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">{metric.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    <Bot className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate Post"}
                </Button>
              </div>

              <Button>Post</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PostCard({ post }: { post: Post }) {
    const author = post.author;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={author.avatar} />
            <AvatarFallback>
              {author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">{author.name}</span>
                    <span className="text-sm text-muted-foreground">
                    @{author.handle} · {post.timestamp}
                    </span>
                </div>
                {author.jobTitle && author.company && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3" />
                        <span>{author.jobTitle} at {author.company}</span>
                    </div>
                )}
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
            {post.image && (
              <div className="mt-4 overflow-hidden rounded-lg border">
                <Image
                  src={post.image}
                  alt="Post image"
                  width={800}
                  height={600}
                  className="h-auto w-full object-cover"
                  data-ai-hint="abstract texture"
                />
              </div>
            )}
            <div className="mt-4 flex items-center justify-between text-muted-foreground">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Repeat2 className="h-5 w-5" />
                <span>{post.retweets}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm1.5 0c0 4.563 3.687 8.25 8.25 8.25s8.25-3.687 8.25-8.25S16.563 3.75 12 3.75 3.75 7.437 3.75 12zM9 9.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm0 3a.75.75 0 000 1.5h4a.75.75 0 000-1.5H9z"></path>
                </svg>
                <span>{post.views}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    

    

    


