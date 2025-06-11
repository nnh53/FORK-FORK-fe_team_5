"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { commentsApi, postsApi, usersApi } from "../api/posts";
import type { Comment, Post, User } from "../types";

export default function UserPosts() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // Query 1: Fetch all users (independent)
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getUsers,
  });

  // Query 2: Fetch posts by selected user (dependent on selectedUserId)
  const {
    data: userPosts,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useQuery({
    queryKey: ["posts", "user", selectedUserId],
    queryFn: () => postsApi.getPostsByUser(selectedUserId!),
    enabled: !!selectedUserId, // Chỉ chạy khi có selectedUserId
  });

  // Query 3: Fetch comments for selected post (dependent on selectedPostId)
  const {
    data: postComments,
    isLoading: isLoadingComments,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", "post", selectedPostId],
    queryFn: () => commentsApi.getCommentsByPost(selectedPostId!),
    enabled: !!selectedPostId, // Chỉ chạy khi có selectedPostId
  });

  const handleUserChange = (userId: string) => {
    const id = Number.parseInt(userId);
    setSelectedUserId(id);
    setSelectedPostId(null); // Reset selected post khi đổi user
  };

  const selectedUser = users?.find((user) => user.id === selectedUserId);

  return (
    <div className="space-y-6">
      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select User</CardTitle>
          <CardDescription>Demo dependent queries - posts sẽ load sau khi chọn user</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <Skeleton className="h-10 w-full" />
          ) : usersError ? (
            <Alert variant="destructive">
              <AlertDescription>Error loading users: {usersError instanceof Error ? usersError.message : "Unknown error"}</AlertDescription>
            </Alert>
          ) : (
            <Select onValueChange={handleUserChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user: User) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} (@{user.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Selected User Info */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedUser.name}</CardTitle>
            <CardDescription>
              @{selectedUser.username} • {selectedUser.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Phone:</strong> {selectedUser.phone}
              </div>
              <div>
                <strong>Website:</strong> {selectedUser.website}
              </div>
              <div>
                <strong>Company:</strong> {selectedUser.company.name}
              </div>
              <div>
                <strong>City:</strong> {selectedUser.address.city}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Posts */}
      {selectedUserId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Posts by {selectedUser?.name}
              {isLoadingPosts && <Badge variant="outline">Loading...</Badge>}
            </CardTitle>
            <CardDescription>Click on a post to view its comments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPosts ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
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
            ) : postsError ? (
              <Alert variant="destructive">
                <AlertDescription>Error loading posts: {postsError instanceof Error ? postsError.message : "Unknown error"}</AlertDescription>
              </Alert>
            ) : userPosts && userPosts.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {userPosts.map((post: Post) => (
                  <Card
                    key={post.id}
                    className={`cursor-pointer transition-colors ${selectedPostId === post.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm line-clamp-2">{post.title}</CardTitle>
                      <CardDescription>Post #{post.id}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No posts found for this user.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Post Comments */}
      {selectedPostId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Comments for Post #{selectedPostId}
              {isLoadingComments && <Badge variant="outline">Loading...</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingComments ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : commentsError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Error loading comments: {commentsError instanceof Error ? commentsError.message : "Unknown error"}
                </AlertDescription>
              </Alert>
            ) : postComments && postComments.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {postComments.map((comment: Comment) => (
                  <Card key={comment.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{comment.name}</CardTitle>
                      <CardDescription>{comment.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{comment.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No comments found for this post.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Query Status Debug */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Query Status</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div>Users Query: {isLoadingUsers ? "Loading" : users ? "Success" : "Idle"}</div>
          <div>Posts Query: {!selectedUserId ? "Disabled" : isLoadingPosts ? "Loading" : userPosts ? "Success" : "Idle"}</div>
          <div>Comments Query: {!selectedPostId ? "Disabled" : isLoadingComments ? "Loading" : postComments ? "Success" : "Idle"}</div>
        </CardContent>
      </Card>
    </div>
  );
}
