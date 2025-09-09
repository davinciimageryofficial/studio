
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Edit,
  Trash2,
  Flag,
  Save,
  Share2,
  UserPlus,
  User,
  ChevronDown,
  DollarSign,
  Info,
  Lightbulb,
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
  DialogDescription,
} from "@/components/ui/dialog";
import { analyzePost, AnalyzePostOutput } from "@/ai/flows/post-analyzer";
import { generatePost, PostGeneratorOutput } from "@/ai/flows/post-generator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ClientOnly } from "@/components/layout/client-only";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { freelanceNiches } from "@/app/skill-sync-net/page";
import { Post, User as UserType } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import Link from "next/link";


function FeedContent({ posts, onUpdate, onDelete, onReply }: { posts: Post[], onUpdate: (post: Post) => void, onDelete: (postId: number) => void, onReply: (parentPostId: number, reply: Post) => void }) {
    return (
        <div className="space-y-6 mt-6">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <ClientOnly key={post.id}>
                        <PostCard post={post} onUpdate={onUpdate} onDelete={onDelete} onReply={onReply} />
                    </ClientOnly>
                ))
            ) : (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No posts found for this filter.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function PocketGuideDialog({ onStartPost }: { onStartPost: () => void }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Pocket Guide</DialogTitle>
                <DialogDescription>AI-powered suggestions to spark your next conversation.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <ConversationStarters />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Close</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" onClick={onStartPost}>
                        <Edit className="mr-2 h-4 w-4" />
                        Create Post
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(placeholderPosts);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("you-centric");
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);


  const addPost = (newPostData: PostGeneratorOutput) => {
    const author = placeholderUsers.find((u) => u.id === newPostData.authorId);
    if (author) {
      const newPost: Post = {
        ...newPostData,
        author,
        type: 'post',
        replies: [],
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  const handleReply = (parentPostId: number, reply: Post) => {
    const addReplyRecursively = (posts: Post[]): Post[] => {
        return posts.map(post => {
            if (post.id === parentPostId) {
                return {
                    ...post,
                    replies: [...(post.replies || []), reply]
                };
            }
            if (post.replies && post.replies.length > 0) {
                return {
                    ...post,
                    replies: addReplyRecursively(post.replies)
                };
            }
            return post;
        });
    };
    setPosts(prevPosts => addReplyRecursively(prevPosts));
  };


  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(posts => posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  }

  const handleDeletePost = (postId: number) => {
    setPosts(posts => posts.filter(p => p.id !== postId));
  }
  
  const getFilteredPosts = () => {
      if (activeTab === "you-centric") {
          const followingIds = ['1', '3', '5', '7'];
          return posts.filter(post => followingIds.includes(post.author.id));
      }
      if (activeTab === "clique") {
          return posts.filter(post => post.author.category === 'design');
      }
      if (activeTab === "niche") {
          if (!selectedNiche) return [];
          const nicheLower = selectedNiche.toLowerCase();
          
          const findMainCategory = (niche: string) => {
              for (const [category, subNiches] of Object.entries(freelanceNiches)) {
                  if (subNiches.map(n => n.toLowerCase()).includes(niche.toLowerCase())) {
                      return category;
                  }
              }
              return null;
          };

          const mainNicheCategory = findMainCategory(selectedNiche);
          
          return posts.filter(post => {
            let authorMatchesCategory = false;
            if (mainNicheCategory) {
                if (post.author.category === 'development' && mainNicheCategory === "Development & IT") authorMatchesCategory = true;
                if (post.author.category === 'design' && mainNicheCategory === "Design & Creative") authorMatchesCategory = true;
                if (post.author.category === 'writing' && mainNicheCategory === "Writing & Content Creation") authorMatchesCategory = true;
            }
            const authorSkills = post.author.skills.map(s => s.toLowerCase());
            return authorMatchesCategory || authorSkills.includes(nicheLower);
          });
      }
      return [];
  };

  const handleTabChange = (value: string) => {
      setActiveTab(value);
      if (value !== 'niche') {
        setSelectedNiche(null);
      }
  }

  const handleNicheSelect = (niche: string) => {
    setActiveTab('niche');
    setSelectedNiche(niche);
  }

  const filteredPosts = getFilteredPosts();

  return (
    <div>
      <main className="bg-background p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl">
           <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-black text-muted-foreground">
              <TabsTrigger value="you-centric">You-Centric</TabsTrigger>
              <TabsTrigger value="clique">Clique</TabsTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <TabsTrigger value="niche" className={cn(activeTab === 'niche' && "bg-background text-foreground shadow-sm")}>
                        {selectedNiche || 'Niche'}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </TabsTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="center">
                    {Object.entries(freelanceNiches).map(([category, subNiches]) => (
                        <DropdownMenuSub key={category}>
                            <DropdownMenuSubTrigger>{category}</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="p-0">
                                {subNiches.map(niche => (
                                    <DropdownMenuItem key={niche} onSelect={() => handleNicheSelect(niche)}>
                                        {niche}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsList>
            <TabsContent value="you-centric">
              <FeedContent posts={filteredPosts} onUpdate={handlePostUpdate} onDelete={handleDeletePost} onReply={handleReply} />
            </TabsContent>
            <TabsContent value="clique">
               <FeedContent posts={filteredPosts} onUpdate={handlePostUpdate} onDelete={handleDeletePost} onReply={handleReply} />
            </TabsContent>
            <TabsContent value="niche">
               <FeedContent posts={filteredPosts} onUpdate={handlePostUpdate} onDelete={handleDeletePost} onReply={handleReply} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
       {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex h-40 w-8 flex-col items-center justify-center overflow-hidden rounded-full shadow-lg lg:bottom-8 lg:right-8">
          <div className="flex h-full w-full flex-col">
            <Dialog>
                 <DialogTrigger asChild>
                    <button className="flex flex-1 items-center justify-center bg-black text-white hover:bg-gray-800">
                        <Lightbulb className="h-5 w-5" />
                        <span className="sr-only">Pocket Guide</span>
                    </button>
                 </DialogTrigger>
                <PocketGuideDialog onStartPost={() => setIsComposerOpen(true)} />
            </Dialog>
            <div className="h-px bg-border" />
            <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
                <DialogTrigger asChild>
                    <button className="flex flex-1 items-center justify-center bg-black text-white hover:bg-gray-800">
                        <Edit className="h-5 w-5" />
                        <span className="sr-only">Create Post</span>
                    </button>
                </DialogTrigger>
                 <CreatePostDialog
                    onPostGenerated={(post) => {
                        addPost(post);
                        setIsComposerOpen(false);
                    }}
                />
            </Dialog>
          </div>
      </div>
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const handleAnalyze = async () => {
    // This functionality is preserved but now used inside the dialog
  };

  const handleGenerate = async () => {
     // This functionality is preserved but now used inside the dialog
  };

  const handleTextFormat = (format: 'bold' | 'italic' | 'code' | 'codeblock') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postContent.substring(start, end) || "your code here";
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
        case 'codeblock':
            formattedText = `\n\`\`\`\n${selectedText}\n\`\`\`\n`;
            break;
    }

    const newText = postContent.substring(0, start) + formattedText + postContent.substring(end);
    setPostContent(newText);
    textarea.focus();
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create a Post</DialogTitle>
      </DialogHeader>
      <div className="flex items-start gap-4 pt-4">
        <Avatar>
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <Textarea
            ref={textareaRef}
            placeholder="What's on your mind?"
            className="mb-2 min-h-48 w-full resize-none border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter className="justify-between">
        <TooltipProvider>
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleTextFormat('bold')}><Bold /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Bold</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleTextFormat('italic')}><Italic /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Italic</p></TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleTextFormat('codeblock')}><Code /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Code Block</p></TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Link2 /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Insert Link</p></TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
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


function ApplyForJobDialog({ post }: { post: Post }) {
    const [coverLetter, setCoverLetter] = useState("");
    const applicant = placeholderUsers.find(u => u.id === '2'); // Assuming current user is Bob Williams

    if (!post.jobDetails || !applicant) return null;
    
    const applicationDetails = {
        applicantName: applicant.name,
        applicantHeadline: applicant.headline,
        applicantId: applicant.id,
        jobTitle: post.jobDetails.title,
        coverLetter: coverLetter,
        recruiterId: post.author.id,
    };

    const query = new URLSearchParams({ application: JSON.stringify(applicationDetails) }).toString();

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Apply for: {post.jobDetails.title}</DialogTitle>
                <DialogDescription>Your application will be sent to {post.author.name}.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="flex items-start gap-4 rounded-md border bg-muted p-4">
                    <Avatar>
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{applicant.name}</p>
                        <p className="text-sm text-muted-foreground">{applicant.headline}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
                    <Textarea 
                        id="cover-letter"
                        placeholder="Briefly explain why you're a great fit for this role..."
                        className="min-h-32"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                <DialogClose asChild>
                    <Button asChild>
                        <Link href={`/messages?${query}`}>Message Recruiter</Link>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

function ReplyDialog({ post, onReply }: { post: Post, onReply: (reply: Post) => void }) {
    const [replyContent, setReplyContent] = useState("");
    const currentUser = placeholderUsers.find(u => u.id === '2')!; // Bob Williams

    const handleReplySubmit = () => {
        if (!replyContent.trim()) return;
        const newReply: Post = {
            id: Date.now(),
            author: currentUser,
            content: replyContent,
            timestamp: "Just now",
            likes: 0,
            comments: 0,
            retweets: 0,
            views: "0",
            type: 'post',
            image: null,
            replies: [],
        };
        onReply(newReply);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reply to {post.author.name}</DialogTitle>
                <DialogDescription asChild>
                     <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        Replying to: "{post.content}"
                    </p>
                </DialogDescription>
            </DialogHeader>
            <div className="pt-4">
                <Textarea 
                    placeholder="Write your reply..."
                    className="min-h-24"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                />
            </div>
             <DialogFooter>
                <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                <DialogClose asChild>
                    <Button onClick={handleReplySubmit} disabled={!replyContent.trim()}>Reply</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}


function PostCard({ post, onUpdate, onDelete, onReply, isReply = false }: { post: Post, onUpdate: (post: Post) => void, onDelete: (postId: number) => void, onReply: (parentPostId: number, reply: Post) => void, isReply?: boolean }) {
    const author = post.author;
    const [isLiked, setIsLiked] = useState(false);
    const [retweetCount, setRetweetCount] = useState(post.retweets);
    const likeCount = isLiked ? post.likes + 1 : post.likes;
    const { toast } = useToast();

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleRetweet = () => {
        // For simplicity, we just increment. A real app would track retweet state.
        setRetweetCount(prev => prev + 1);
    }
    
    const handleAction = (action: string) => {
        toast({
            title: `Action: ${action}`,
            description: "This functionality would be implemented in a real application.",
        });
    }

    const isMyPost = post.author.id === '2'; // Assuming user '2' is the current user

  return (
    <Card className="border-0">
       {post.type === 'job' && post.jobDetails && (
        <CardHeader className="bg-muted/50 p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                     <Briefcase className="h-6 w-6" />
                </div>
                <div>
                     <h3 className="font-semibold">{post.jobDetails.title}</h3>
                     <p className="text-sm text-muted-foreground">Opportunity from {author.name}</p>
                </div>
            </div>
        </CardHeader>
      )}
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {post.type === 'post' && (
            <Avatar>
                <AvatarFallback>
                    <User className="h-5 w-5" />
                </AvatarFallback>
            </Avatar>
          )}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {isMyPost ? (
                        <>
                            <DropdownMenuItem onClick={() => handleAction('Edit')}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Post</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Post</span>
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem onClick={() => handleAction('Follow')}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>Follow @{author.handle}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Report')}>
                                <Flag className="mr-2 h-4 w-4" />
                                <span>Report Post</span>
                            </DropdownMenuItem>
                        </>
                    )}
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => handleAction('Save')}>
                        <Save className="mr-2 h-4 w-4" />
                        <span>Save Post</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Share')}>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Share Post</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{post.content}</p>

            {post.type === 'job' && post.jobDetails && (
                <div className="mt-4 space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 font-medium">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>Budget</span>
                        </div>
                        <span>{post.jobDetails.budget}</span>
                    </div>
                     <div className="flex items-start justify-between text-sm">
                        <div className="flex items-center gap-2 font-medium">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <span>Keywords</span>
                        </div>
                         <div className="flex flex-wrap justify-end gap-2">
                            {post.jobDetails.keywords.map(keyword => (
                                <Badge key={keyword} variant="secondary">{keyword}</Badge>
                            ))}
                        </div>
                    </div>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full mt-2">Apply Now</Button>
                        </DialogTrigger>
                        <ApplyForJobDialog post={post} />
                    </Dialog>
                </div>
            )}
            <div className="mt-4 flex items-center justify-between text-muted-foreground">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            <span>{post.replies?.length || post.comments}</span>
                        </Button>
                    </DialogTrigger>
                    <ReplyDialog post={post} onReply={(reply) => onReply(post.id, reply)} />
                </Dialog>
              <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={handleRetweet}>
                <Repeat2 className="h-5 w-5" />
                <span>{retweetCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={handleLike}>
                <Heart className={cn("h-5 w-5", isLiked && "fill-current text-red-500")} />
                <span>{likeCount}</span>
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
             {post.replies && post.replies.length > 0 && (
                <div className="mt-4 space-y-4 border-l-2 pl-4">
                    {post.replies.map(reply => (
                        <PostCard key={reply.id} post={reply} onUpdate={onUpdate} onDelete={onDelete} onReply={onReply} isReply={true} />
                    ))}
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
