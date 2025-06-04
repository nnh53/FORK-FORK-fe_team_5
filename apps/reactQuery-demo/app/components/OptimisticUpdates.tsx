"use client"

import type React from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Undo2 } from "lucide-react"
import { postsApi } from "../api/posts"
import type { Post, CreatePostData } from "../types"

export default function OptimisticUpdates() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [shouldFail, setShouldFail] = useState(false)
  const queryClient = useQueryClient()

  // Query để fetch posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", "optimistic"],
    queryFn: postsApi.getPosts,
  })

  // Mutation với optimistic update
  const createPostMutation = useMutation({
    mutationFn: async (newPost: CreatePostData) => {
      // Simulate failure nếu shouldFail = true
      if (shouldFail) {
        throw new Error("Simulated network error")
      }
      return postsApi.createPost(newPost)
    },

    // Optimistic update - chạy ngay lập tức
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches để không overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["posts", "optimistic"] })

      // Snapshot previous value để rollback nếu cần
      const previousPosts = queryClient.getQueryData(["posts", "optimistic"])

      // Optimistically update cache
      const optimisticPost: Post = {
        id: Date.now(), // Temporary ID
        title: newPost.title,
        body: newPost.body,
        userId: newPost.userId,
      }

      queryClient.setQueryData(["posts", "optimistic"], (old: Post[] | undefined) => {
        return old ? [optimisticPost, ...old] : [optimisticPost]
      })

      // Return context object với snapshot
      return { previousPosts, optimisticPost }
    },

    // Nếu mutation thành công, replace optimistic data với real data
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(["posts", "optimistic"], (old: Post[] | undefined) => {
        if (!old) return [data]

        // Replace optimistic post với real post
        return old.map((post) => (post.id === context?.optimisticPost.id ? data : post))
      })
    },

    // Nếu mutation thất bại, rollback
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", "optimistic"], context.previousPosts)
      }
    },

    // Always refetch sau khi mutation hoàn thành
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "optimistic"] })
    },
  })

  // Mutation để delete với optimistic update
  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      if (shouldFail) {
        throw new Error("Simulated delete error")
      }
      return postsApi.deletePost(postId)
    },

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts", "optimistic"] })

      const previousPosts = queryClient.getQueryData(["posts", "optimistic"])

      // Optimistically remove post
      queryClient.setQueryData(["posts", "optimistic"], (old: Post[] | undefined) => {
        return old ? old.filter((post) => post.id !== postId) : []
      })

      return { previousPosts, deletedPostId: postId }
    },

    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", "optimistic"], context.previousPosts)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "optimistic"] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    const postData: CreatePostData = {
      title: title.trim(),
      body: body.trim(),
      userId: 1,
    }

    createPostMutation.mutate(postData)

    // Reset form
    setTitle("")
    setBody("")
  }

  const handleDelete = (postId: number) => {
    deletePostMutation.mutate(postId)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Optimistic Updates Demo</CardTitle>
          <CardDescription>Updates happen immediately, then rollback if there's an error</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Failure simulation toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shouldFail"
              checked={shouldFail}
              onChange={(e) => setShouldFail(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="shouldFail">Simulate network failure</Label>
            {shouldFail && <Badge variant="destructive">Failures enabled</Badge>}
          </div>

          {/* Create post form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title..."
                disabled={createPostMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter post content..."
                rows={3}
                disabled={createPostMutation.isPending}
              />
            </div>

            <Button type="submit" disabled={createPostMutation.isPending || !title.trim() || !body.trim()}>
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Post (Optimistic)"
              )}
            </Button>
          </form>

          {/* Status messages */}
          {createPostMutation.isSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Post created successfully!</AlertDescription>
            </Alert>
          )}

          {createPostMutation.isError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2">
                  <Undo2 className="h-4 w-4" />
                  Error occurred - changes rolled back:{" "}
                  {createPostMutation.error instanceof Error ? createPostMutation.error.message : "Unknown error"}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {deletePostMutation.isError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2">
                  <Undo2 className="h-4 w-4" />
                  Delete failed - post restored:{" "}
                  {deletePostMutation.error instanceof Error ? deletePostMutation.error.message : "Unknown error"}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Posts list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Posts with Optimistic Updates
            <Badge variant="secondary">{posts?.length || 0} posts</Badge>
          </CardTitle>
          <CardDescription>New posts appear immediately, deletions happen instantly</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {posts?.slice(0, 10).map((post: Post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm line-clamp-2">{post.title}</CardTitle>
                        <CardDescription>
                          Post #{post.id} by User {post.userId}
                          {post.id > 100 && (
                            <Badge variant="outline" className="ml-2">
                              Optimistic
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletePostMutation.isPending}
                      >
                        {deletePostMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Optimistic Updates Debug</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div>Create Status: {createPostMutation.status}</div>
          <div>Delete Status: {deletePostMutation.status}</div>
          <div>Create Pending: {createPostMutation.isPending ? "Yes" : "No"}</div>
          <div>Delete Pending: {deletePostMutation.isPending ? "Yes" : "No"}</div>
          <div>Failure Mode: {shouldFail ? "Enabled" : "Disabled"}</div>
          <div>Posts Count: {posts?.length || 0}</div>
        </CardContent>
      </Card>
    </div>
  )
}
