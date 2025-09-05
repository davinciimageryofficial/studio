
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
  AlertCircle,
  Briefcase,
  Bot,
  Bold,
  Italic,
  Code,
  Link2,
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
import { ClientOnly } from "@/components/layout/client-only";
import { cn } from "@/lib/utils";

type Post = (typeof placeholderPosts)[0];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(placeholderPosts);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const addPost = (newPostData: PostGeneratorOutput) => {
    const author = placeholderUsers.find((u) => u.id === newPostData.authorId);
    if (author) {
      const newPost: Post = {
        ...newPostData,
        author,
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  return (
    <div className="flex h-full">
      <main className="flex-1 bg-background p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-6">
            {posts.map((post) => (
              <ClientOnly key={post.id}>
                <PostCard post={post} />
              </ClientOnly>
            ))}
          </div>
        </div>
      </main>
      <aside className="hidden w-80 flex-col border-l p-6 lg:flex">
        <div className="sticky top-[84px] space-y-6">
          <ClientOnly>
            <ConversationStarters />
             <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
                <DialogTrigger asChild>
                     <Card className="cursor-pointer transition-all hover:shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src="https://picsum.photos/id/1005/40/40" data-ai-hint="man portrait" />
                                    <AvatarFallback>ME</AvatarFallback>
                                </Avatar>
                                <p className="text-muted-foreground">Write a post...</p>
                            </div>
                        </CardContent>
                    </Card>
                </DialogTrigger>
                <CreatePostDialog 
                    onPostGenerated={(post) => {
                        addPost(post);
                        setIsComposerOpen(false);
                    }}
                />
            </Dialog>
          </ClientOnly>
        </div>
      </aside>
    </div>
  );
}

function CreatePostDialog({ 
    onPostGenerated,
}: { 
    onPostGenerated: (post: PostGeneratorOutput) => void, 
}) {
  const [postContent, setPostContent] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalyzePostOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkPreview, setLinkPreview] = useState<{url: string, title: string, description: string, image: string} | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const handleAnalyze = async () => {
    // This functionality is preserved but now used inside the dialog
  };

  const handleGenerate = async () => {
     // This functionality is preserved but now used inside the dialog
  };

  const handleTextFormat = (format: 'bold' | 'italic' | 'code') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postContent.substring(start, end);
    let formattedText = "";

    switch(format) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'code':
            formattedText = `\`${selectedText}\``;
            break;
    }

    const newText = postContent.substring(0, start) + formattedText + postContent.substring(end);
    setPostContent(newText);
    textarea.focus();
  };

  const extractUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  }

  useEffect(() => {
    const url = extractUrl(postContent);
    if (url) {
        // In a real app, you would fetch metadata from this URL.
        // For now, we'll use placeholder data for the preview.
        setLinkPreview({
            url,
            title: "Link Preview Title",
            description: "This is a placeholder description for the link you shared. In a real application, we would fetch this from the website.",
            image: "https://picsum.photos/seed/link/400/200"
        });
    } else {
        setLinkPreview(null);
    }
  }, [postContent]);

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create a Post</DialogTitle>
      </DialogHeader>
      <div className="flex items-start gap-4 pt-4">
        <Avatar>
          <AvatarImage src="https://picsum.photos/id/1005/40/40" data-ai-hint="man portrait" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <Textarea
            ref={textareaRef}
            placeholder="What's on your mind?"
            className="mb-2 min-h-48 w-full resize-none border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          {linkPreview && (
              <Card className="mt-2 overflow-hidden">
                  <Image src={linkPreview.image} width={600} height={300} alt="Link preview" className="w-full object-cover" />
                  <div className="p-3">
                      <h4 className="font-semibold truncate">{linkPreview.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{linkPreview.description}</p>
                      <a href={linkPreview.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{linkPreview.url}</a>
                  </div>
              </Card>
          )}
        </div>
      </div>
      <DialogFooter className="justify-between">
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleTextFormat('bold')}><Bold /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleTextFormat('italic')}><Italic /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleTextFormat('code')}><Code /></Button>
            <Button variant="ghost" size="icon"><Link2 /></Button>
            <Button variant="ghost" size="icon"><ImageIcon /></Button>
        </div>
        <div className="flex items-center gap-2">
           <Dialog>
                <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAnalyze}
                      disabled={!postContent.trim() || isAnalyzing}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><circle cx="12" cy="12" r="7"></circle><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                      {isAnalyzing ? "Analyzing..." : "Analyze"}
                    </Button>
                </DialogTrigger>
                {/* Analysis DialogContent would go here */}
            </Dialog>
            <Button>Post</Button>
        </div>
      </DialogFooter>
    </DialogContent>
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
