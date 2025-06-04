"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Trash2 } from "lucide-react"
import { postsApi } from "../api/posts"
import type { Post } from "../types"

export default function Posts() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  // Query để fetch tất cả posts
  const {
    data: posts,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: postsApi.getPosts,
    staleTime: 5 * 60 * 1000, // 5 phút
  })

  // Query để fetch post detail (chỉ chạy khi có selectedPostId)
  const {
    data: selectedPost,
    isLoading: isLoadingPost,
    error: postError,
  } = useQuery({
    queryKey: ["post", selectedPostId],
    queryFn: () => postsApi.getPost(selectedPostId!),
    enabled: !!selectedPostId, // Chỉ chạy khi có selectedPostId
  })

  const handleRefresh = () => {
    refetch()
  }

  const handleInvalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] })
  }

  const handleClearCache = () => {
    queryClient.removeQueries({ queryKey: ["posts"] })
  }

  if (isLoading) {
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
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error instanceof Error ? error.message : "Something went wrong"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Control buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleRefresh} disabled={isFetching} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          Refetch
        </Button>
        <Button onClick={handleInvalidateCache} variant="outline">
          Invalidate Cache
        </Button>
        <Button onClick={handleClearCache} variant="outline">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cache
        </Button>
        <Badge variant="secondary">{isFetching ? "Fetching..." : `${posts?.length || 0} posts loaded`}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Posts list */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Posts</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {posts?.map((post: Post) => (
              <Card
                key={post.id}
                className={`cursor-pointer transition-colors ${
                  selectedPostId === post.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPostId(post.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm line-clamp-2">{post.title}</CardTitle>
                  <CardDescription>
                    Post #{post.id} by User {post.userId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected post detail */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Post Detail</h3>
          {!selectedPostId ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">Click on a post to view details</p>
              </CardContent>
            </Card>
          ) : isLoadingPost ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ) : postError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Error loading post: {postError instanceof Error ? postError.message : "Unknown error"}
              </AlertDescription>
            </Alert>
          ) : selectedPost ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPost.title}</CardTitle>
                <CardDescription>
                  Post #{selectedPost.id} by User {selectedPost.userId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedPost.body}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
