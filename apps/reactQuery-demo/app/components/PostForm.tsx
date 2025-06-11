"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { postsApi } from "../api/posts";
import type { CreatePostData } from "../types";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState(1);
  const queryClient = useQueryClient();

  // Mutation để tạo post mới
  const createPostMutation = useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: (newPost) => {
      // Invalidate và refetch posts list
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Optionally, add the new post to cache immediately
      queryClient.setQueryData(["posts"], (oldPosts: any) => {
        return oldPosts ? [newPost, ...oldPosts] : [newPost];
      });

      // Reset form
      setTitle("");
      setBody("");
      setUserId(1);
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });

  // Mutation để update post
  const updatePostMutation = useMutation({
    mutationFn: postsApi.updatePost,
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);
    },
  });

  // Mutation để delete post
  const deletePostMutation = useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.removeQueries({ queryKey: ["post", deletedId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const postData: CreatePostData = {
      title: title.trim(),
      body: body.trim(),
      userId,
    };

    createPostMutation.mutate(postData);
  };

  const handleUpdateExample = () => {
    updatePostMutation.mutate({
      id: 1,
      title: "Updated Post Title",
      body: "This post has been updated via mutation",
      userId: 1,
    });
  };

  const handleDeleteExample = () => {
    deletePostMutation.mutate(1);
  };

  return (
    <div className="space-y-6">
      {/* Create Post Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>Demo useMutation với form submission</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input id="userId" type="number" value={userId} onChange={(e) => setUserId(Number(e.target.value))} min="1" max="10" />
            </div>

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
                rows={4}
                disabled={createPostMutation.isPending}
              />
            </div>

            <Button type="submit" disabled={createPostMutation.isPending || !title.trim() || !body.trim()} className="w-full">
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </form>

          {/* Success/Error Messages */}
          {createPostMutation.isSuccess && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Post created successfully! ID: {createPostMutation.data?.id}</AlertDescription>
            </Alert>
          )}

          {createPostMutation.isError && (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Error: {createPostMutation.error instanceof Error ? createPostMutation.error.message : "Failed to create post"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Other Mutation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Other Mutation Examples</CardTitle>
          <CardDescription>Demo update và delete mutations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleUpdateExample} disabled={updatePostMutation.isPending} variant="outline">
              {updatePostMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Post #1"
              )}
            </Button>

            <Button onClick={handleDeleteExample} disabled={deletePostMutation.isPending} variant="destructive">
              {deletePostMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Post #1"
              )}
            </Button>
          </div>

          {/* Status badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant={updatePostMutation.isSuccess ? "default" : "secondary"}>
              Update: {updatePostMutation.isSuccess ? "Success" : "Idle"}
            </Badge>
            <Badge variant={deletePostMutation.isSuccess ? "default" : "secondary"}>
              Delete: {deletePostMutation.isSuccess ? "Success" : "Idle"}
            </Badge>
          </div>

          {/* Error messages */}
          {updatePostMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Update error: {updatePostMutation.error instanceof Error ? updatePostMutation.error.message : "Unknown error"}
              </AlertDescription>
            </Alert>
          )}

          {deletePostMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Delete error: {deletePostMutation.error instanceof Error ? deletePostMutation.error.message : "Unknown error"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
