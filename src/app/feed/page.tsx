
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  Kanban,
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
import { Post, User as UserType } from "@/lib/types";
import { getPosts, getCurrentUser, getUserById } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";


function FeedContent({ posts, onUpdate, onDelete, onReply, t, isLoading, currentUser }: { posts: Post[], onUpdate: (post: Post) => void, onDelete: (postId: number) => void, onReply: (parentPostId: number, reply: Post) => void, t: typeof translations['en'], isLoading: boolean, currentUser: UserType | null }) {
    if (isLoading) {
        return (
            <div className="space-y-6 mt-6">
                {[...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
        )
    }
    
    return (
        <div className="space-y-6 mt-6">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <ClientOnly key={post.id}>
                        <PostCard post={post} onUpdate={onUpdate} onDelete={onDelete} onReply={onReply} t={t} currentUser={currentUser} />
                    </ClientOnly>
                ))
            ) : (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        {t.noPostsFound}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function PocketGuideDialog({ onStartPost, t }: { onStartPost: () => void, t: typeof translations['en'] }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t.pocketGuide}</DialogTitle>
                <DialogDescription>{t.pocketGuideDesc}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <ConversationStarters />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">{t.close}</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" onClick={onStartPost}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t.createPost}
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

function FeedPageInternal() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("you-centric");
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        const [postsData, currentUserData] = await Promise.all([getPosts(), getCurrentUser()]);
        setPosts(postsData);
        setCurrentUser(currentUserData);
        setIsLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const channel = supabase.channel('realtime posts');
    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        const newPostData = payload.new as Post;
        // Only add top-level posts in real-time
        if (!newPostData.parent_id) {
          const author = await getUserById(newPostData.author_id);
          if (author) {
            const fullPost = {
              ...newPostData,
              author,
              replies: [],
            };
            setPosts((prevPosts) => [fullPost, ...prevPosts]);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addPost = (newPostData: PostGeneratorOutput) => {
    if (currentUser) {
        const newPost: Post = {
            id: newPostData.id,
            author: currentUser,
            author_id: currentUser.id,
            content: newPostData.content,
            created_at: new Date().toISOString(),
            image: null,
            likes_count: 0,
            replies_count: 0,
            reposts_count: 0,
            views_count: 0,
            type: 'post',
            replies: [],
        };
        // This is now handled by the real-time subscription,
        // but we can keep it for optimistic UI updates if we want.
        // For now, we'll let the subscription handle it to avoid duplicates.
        // setPosts((prevPosts) => [newPost, ...prevPosts]);
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
      // Placeholder for filtering logic. A real app would have more complex logic,
      // possibly fetching filtered data from the backend.
      if (activeTab === "you-centric") {
          return posts;
      }
      if (activeTab === "clique") {
          return posts.filter(post => post.author.category === 'design');
      }
      if (activeTab === "niche") {
          if (!selectedNiche) return posts;
          const nicheLower = selectedNiche.toLowerCase();
          return posts.filter(post => 
            post.content.toLowerCase().includes(nicheLower) ||
            (post.author.skills && post.author.skills.map(s => s.toLowerCase()).includes(nicheLower))
          );
      }
      return posts;
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
              <TabsTrigger value="you-centric">{t.feedYouCentric}</TabsTrigger>
              <TabsTrigger value="clique">{t.feedClique}</TabsTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <TabsTrigger value="niche" className={cn(activeTab === 'niche' && "bg-background text-foreground shadow-sm")}>
                        {selectedNiche || t.feedNiche}
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
                        </DropdownMenu>
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsList>
            <FeedContent posts={filteredPosts} onUpdate={handlePostUpdate} onDelete={handleDeletePost} onReply={handleReply} t={t} isLoading={isLoading} currentUser={currentUser} />
          </Tabs>
        </div>
      </main>
      
       {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex h-40 w-8 flex-col items-center justify-center overflow-hidden rounded-full shadow-lg lg:bottom-8 lg:right-8">
          <div className="flex h-full w-full flex-col">
            <Dialog>
                 <DialogTrigger asChild>
                    <button className="flex flex-1 items-center justify-center bg-black text-white hover:bg-gray-800">
                        <Kanban className="h-5 w-5" />
                        <span className="sr-only">{t.pocketGuide}</span>
                    </button>
                 </DialogTrigger>
                <PocketGuideDialog onStartPost={() => setIsComposerOpen(true)} t={t} />
            </Dialog>
            <div className="h-px bg-border" />
            <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
                <DialogTrigger asChild>
                    <button className="flex flex-1 items-center justify-center bg-black text-white hover:bg-gray-800">
                        <Edit className="h-5 w-5" />
                        <span className="sr-only">{t.createPost}</span>
                    </button>
                </DialogTrigger>
                 <CreatePostDialog
                    onPostGenerated={(post) => {
                        addPost(post);
                        setIsComposerOpen(false);
                    }}
                    t={t}
                    currentUser={currentUser}
                />
            </Dialog>
          </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
    return (
        <ClientOnly>
            <FeedPageInternal />
        </ClientOnly>
    )
}

function CreatePostDialog({ 
    onPostGenerated,
    t,
    currentUser
}: { 
    onPostGenerated: (post: PostGeneratorOutput) => void,
    t: typeof translations['en'],
    currentUser: UserType | null,
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
        <DialogTitle>{t.createPost}</DialogTitle>
      </DialogHeader>
      <div className="flex items-start gap-4 pt-4">
        <Avatar>
          <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <Textarea
            ref={textareaRef}
            placeholder={t.postPlaceholder}
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
                    <TooltipContent><p>{t.bold}</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleTextFormat('italic')}><Italic /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t.italic}</p></TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleTextFormat('codeblock')}><Code /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t.codeBlock}</p></TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Link2 /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t.insertLink}</p></TooltipContent>
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
                      {isAnalyzing ? t.analyzing : t.analyze}
                    </Button>
                </DialogTrigger>
                {/* Analysis DialogContent would go here */}
            </Dialog>
            <Button>{t.post}</Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}


function ApplyForJobDialog({ post, t, currentUser }: { post: Post, t: typeof translations['en'], currentUser: UserType | null }) {
    const [coverLetter, setCoverLetter] = useState("");

    if (!post.jobDetails || !currentUser) return null;
    
    const applicationDetails = {
        applicantName: currentUser.name,
        applicantHeadline: currentUser.headline,
        applicantId: currentUser.id,
        jobTitle: post.jobDetails.title,
        coverLetter: coverLetter,
        recruiterId: post.author.id,
    };

    const query = new URLSearchParams({ application: JSON.stringify(applicationDetails) }).toString();

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t.applyFor}: {post.jobDetails.title}</DialogTitle>
                <DialogDescription>{t.applicationSentTo.replace('{name}', post.author.name)}</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="flex items-start gap-4 rounded-md border bg-muted p-4">
                    <Avatar>
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{currentUser.name}</p>
                        <p className="text-sm text-muted-foreground">{currentUser.headline}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cover-letter">{t.coverLetter}</Label>
                    <Textarea 
                        id="cover-letter"
                        placeholder={t.coverLetterPlaceholder}
                        className="min-h-32"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="secondary">{t.cancel}</Button></DialogClose>
                <DialogClose asChild>
                    <Button asChild>
                        <Link href={`/messages?${query}`}>{t.messageRecruiter}</Link>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

function ReplyDialog({ post, onReply, t, currentUser }: { post: Post, onReply: (reply: Post) => void, t: typeof translations['en'], currentUser: UserType | null }) {
    const [replyContent, setReplyContent] = useState("");

    const handleReplySubmit = () => {
        if (!replyContent.trim() || !currentUser) return;
        const newReply: Post = {
            id: Date.now(),
            author: currentUser,
            author_id: currentUser.id,
            content: replyContent,
            created_at: new Date().toISOString(),
            image: null,
            likes_count: 0,
            replies_count: 0,
            reposts_count: 0,
            views_count: 0,
            type: 'post',
            replies: [],
        };
        onReply(newReply);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t.replyTo} {post.author.name}</DialogTitle>
                <DialogDescription asChild>
                     <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {t.replyingTo}: "{post.content}"
                    </p>
                </DialogDescription>
            </DialogHeader>
            <div className="pt-4">
                <Textarea 
                    placeholder={t.writeYourReply}
                    className="min-h-24"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                />
            </div>
             <DialogFooter>
                <DialogClose asChild><Button variant="secondary">{t.cancel}</Button></DialogClose>
                <DialogClose asChild>
                    <Button onClick={handleReplySubmit} disabled={!replyContent.trim()}>{t.reply}</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}


function PostCard({ post, onUpdate, onDelete, onReply, t, currentUser, isReply = false }: { post: Post, onUpdate: (post: Post) => void, onDelete: (postId: number) => void, onReply: (parentPostId: number, reply: Post) => void, t: typeof translations['en'], currentUser: UserType | null, isReply?: boolean }) {
    const author = post.author;
    const [isLiked, setIsLiked] = useState(false);
    const [retweetCount, setRetweetCount] = useState(post.reposts_count);
    const likeCount = isLiked ? post.likes_count + 1 : post.likes_count;
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
            title: `${t.action}: ${action}`,
            description: t.actionDesc.replace('{action}', action),
        });
    }

    const isMyPost = currentUser?.id === post.author.id;

    if (!author) {
        return <PostCardSkeleton />;
    }

  return (
    <Card className={cn("border-0", isReply && "border-t-0 rounded-none shadow-none")}>
       {post.type === 'job' && post.jobDetails && (
        <CardHeader className="bg-muted/50 p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                     <Briefcase className="h-6 w-6" />
                </div>
                <div>
                     <h3 className="font-semibold">{post.jobDetails.title}</h3>
                     <p className="text-sm text-muted-foreground">{t.opportunityFrom} {author.name}</p>
                </div>
            </div>
        </CardHeader>
      )}
      <CardContent className={cn("p-4", isReply && "pt-4 pb-0")}>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>
                <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">{author.name}</span>
                    <span className="text-sm text-muted-foreground">
                    @{author.name?.toLowerCase().replace(" ", "")} · {new Date(post.created_at).toLocaleDateString()}
                    </span>
                </div>
                {author.headline && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{author.headline}</span>
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
                                <span>{t.editPost}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>{t.deletePost}</span>
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem onClick={() => handleAction('Follow')}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>{t.follow.replace('{handle}', author.name?.toLowerCase().replace(" ", "") || 'user')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Report')}>
                                <Flag className="mr-2 h-4 w-4" />
                                <span>{t.reportPost}</span>
                            </DropdownMenuItem>
                        </>
                    )}
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => handleAction('Save')}>
                        <Save className="mr-2 h-4 w-4" />
                        <span>{t.savePost}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Share')}>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>{t.sharePost}</span>
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
                            <span>{t.budget}</span>
                        </div>
                        <span>{post.jobDetails.budget}</span>
                    </div>
                     <div className="flex items-start justify-between text-sm">
                        <div className="flex items-center gap-2 font-medium">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <span>{t.keywords}</span>
                        </div>
                         <div className="flex flex-wrap justify-end gap-2">
                            {post.jobDetails.keywords.map(keyword => (
                                <Badge key={keyword} variant="secondary">{keyword}</Badge>
                            ))}
                        </div>
                    </div>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full mt-2">{t.applyNow}</Button>
                        </DialogTrigger>
                        <ApplyForJobDialog post={post} t={t} currentUser={currentUser} />
                    </Dialog>
                </div>
            )}
            <div className="mt-4 flex items-center justify-between text-muted-foreground">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            <span>{post.replies_count}</span>
                        </Button>
                    </DialogTrigger>
                    <ReplyDialog post={post} onReply={(reply) => onReply(post.id, reply)} t={t} currentUser={currentUser} />
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
                <span>{post.views_count}</span>
              </Button>
            </div>
             {post.replies && post.replies.length > 0 && (
                <div className="mt-4 space-y-4 border-l-2 pl-4">
                    {post.replies.map(reply => (
                        <PostCard key={reply.id} post={reply} onUpdate={onUpdate} onDelete={onDelete} onReply={onReply} t={t} currentUser={currentUser} isReply={true} />
                    ))}
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PostCardSkeleton() {
    return (
        <Card className="border-0">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-6 w-6" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-12" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

    