import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { placeholderPosts } from "@/lib/placeholder-data";
import {
  MessageCircle,
  Heart,
  Repeat2,
  MoreHorizontal,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { ConversationStarters } from "./conversation-starters";

export default function FeedPage() {
  return (
    <div className="flex h-full min-h-screen">
      <main className="flex-1 bg-background p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl">
          <CreatePostCard />
          <div className="mt-6 space-y-6">
            {placeholderPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
      <aside className="hidden w-80 flex-col border-l p-6 lg:flex">
        <ConversationStarters />
      </aside>
    </div>
  );
}

function CreatePostCard() {
  return (
    <Card>
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
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button>Post</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PostCard({ post }: { post: (typeof placeholderPosts)[0] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.author.name}</span>
                <span className="text-sm text-muted-foreground">
                  @{post.author.handle} · {post.timestamp}
                </span>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-1 whitespace-pre-wrap">{post.content}</p>
            {post.image && (
              <div className="mt-4 overflow-hidden rounded-lg border">
                <Image
                  src={post.image}
                  alt="Post image"
                  width={600}
                  height={400}
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
