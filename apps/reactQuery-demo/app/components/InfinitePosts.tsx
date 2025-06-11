"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { postsApi } from "../api/posts";
import type { Post } from "../types";

export default function InfinitePosts() {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: ({ pageParam = 1 }) => postsApi.getPostsPaginated(pageParam, 5),
    getNextPageParam: (lastPage, pages) => {
      // JSONPlaceholder có 100 posts, mỗi page 5 posts = 20 pages
      return pages.length < 20 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  if (status === "pending") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error instanceof Error ? error.message : "Something went wrong"}</AlertDescription>
      </Alert>
    );
  }

  const allPosts = data?.pages.flat() || [];

  return (
    <div className="space-y-6">
      {/* Status info */}
      <div className="flex gap-2 flex-wrap items-center">
        <Badge variant="secondary">{allPosts.length} posts loaded</Badge>
        <Badge variant="secondary">{data?.pages.length} pages</Badge>
        {isFetching && !isFetchingNextPage && (
          <Badge variant="outline">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Background fetching...
          </Badge>
        )}
      </div>

      {/* Posts list */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {allPosts.map((post: Post, index) => (
          <Card key={`${post.id}-${index}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{post.title}</CardTitle>
              <CardDescription>
                Post #{post.id} by User {post.userId} • Page {Math.floor(index / 5) + 1}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load more button */}
      <div className="flex justify-center">
        {hasNextPage ? (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="outline">
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load More Posts"
            )}
          </Button>
        ) : (
          <Badge variant="secondary">No more posts to load</Badge>
        )}
      </div>

      {/* Debug info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Debug Info</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div>Status: {status}</div>
          <div>Has Next Page: {hasNextPage ? "Yes" : "No"}</div>
          <div>Is Fetching: {isFetching ? "Yes" : "No"}</div>
          <div>Is Fetching Next Page: {isFetchingNextPage ? "Yes" : "No"}</div>
          <div>Total Pages: {data?.pages.length}</div>
          <div>Total Posts: {allPosts.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}
