"use client"

import { useQueries, useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { usersApi, postsApi } from "../api/posts"
import type { User, Post } from "../types"

export default function ParallelQueries() {
  // Method 1: Multiple useQuery hooks (parallel by default)
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getUsers,
  })

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: postsApi.getPosts,
  })

  // Method 2: useQueries for dynamic parallel queries
  const userDetailQueries = useQueries({
    queries: [1, 2, 3, 4, 5].map((id) => ({
      queryKey: ["user", id],
      queryFn: () => usersApi.getUser(id),
      staleTime: 5 * 60 * 1000,
    })),
  })

  // Method 3: Parallel queries với different configurations
  const specificPostQueries = useQueries({
    queries: [
      {
        queryKey: ["post", 1],
        queryFn: () => postsApi.getPost(1),
        staleTime: 10 * 60 * 1000,
      },
      {
        queryKey: ["post", 2],
        queryFn: () => postsApi.getPost(2),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["post", 3],
        queryFn: () => postsApi.getPost(3),
        retry: 1,
      },
    ],
  })

  const isLoadingAny =
    usersQuery.isLoading ||
    postsQuery.isLoading ||
    userDetailQueries.some((q) => q.isLoading) ||
    specificPostQueries.some((q) => q.isLoading)

  const hasAnyError =
    usersQuery.error ||
    postsQuery.error ||
    userDetailQueries.some((q) => q.error) ||
    specificPostQueries.some((q) => q.error)

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Parallel Queries Status
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                usersQuery.refetch()
                postsQuery.refetch()
                userDetailQueries.forEach((q) => q.refetch())
                specificPostQueries.forEach((q) => q.refetch())
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>Multiple queries running in parallel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant={usersQuery.isSuccess ? "default" : usersQuery.isLoading ? "secondary" : "destructive"}>
                Users: {usersQuery.isLoading ? "Loading" : usersQuery.isSuccess ? "Success" : "Error"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={postsQuery.isSuccess ? "default" : postsQuery.isLoading ? "secondary" : "destructive"}>
                Posts: {postsQuery.isLoading ? "Loading" : postsQuery.isSuccess ? "Success" : "Error"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline">User Details: {userDetailQueries.filter((q) => q.isSuccess).length}/5</Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline">Specific Posts: {specificPostQueries.filter((q) => q.isSuccess).length}/3</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Users and Posts (Method 1) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Parallel Queries</CardTitle>
            <CardDescription>Multiple useQuery hooks running in parallel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Users */}
            <div>
              <h4 className="font-medium mb-2">Users ({usersQuery.data?.length || 0})</h4>
              {usersQuery.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              ) : usersQuery.error ? (
                <Alert variant="destructive">
                  <AlertDescription>Error loading users</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {usersQuery.data?.slice(0, 5).map((user: User) => (
                    <div key={user.id} className="text-sm p-2 bg-muted rounded">
                      {user.name} - {user.email}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Posts */}
            <div>
              <h4 className="font-medium mb-2">Posts ({postsQuery.data?.length || 0})</h4>
              {postsQuery.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              ) : postsQuery.error ? (
                <Alert variant="destructive">
                  <AlertDescription>Error loading posts</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {postsQuery.data?.slice(0, 5).map((post: Post) => (
                    <div key={post.id} className="text-sm p-2 bg-muted rounded">
                      <div className="font-medium line-clamp-1">{post.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Details (Method 2) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">useQueries Hook</CardTitle>
            <CardDescription>Dynamic parallel queries for user details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userDetailQueries.map((query, index) => {
                const userId = index + 1
                return (
                  <div key={userId} className="p-3 border rounded">
                    {query.isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ) : query.error ? (
                      <Alert variant="destructive">
                        <AlertDescription>Error loading user {userId}</AlertDescription>
                      </Alert>
                    ) : query.data ? (
                      <div>
                        <div className="font-medium">{query.data.name}</div>
                        <div className="text-sm text-muted-foreground">
                          @{query.data.username} • {query.data.company.name}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specific Posts (Method 3) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configured Parallel Queries</CardTitle>
          <CardDescription>Parallel queries with different configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {specificPostQueries.map((query, index) => {
              const postId = index + 1
              return (
                <Card key={postId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Post #{postId}</CardTitle>
                    <CardDescription>
                      {query.isLoading ? "Loading..." : query.error ? "Error" : query.isSuccess ? "Loaded" : "Idle"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {query.isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    ) : query.error ? (
                      <p className="text-sm text-destructive">Failed to load</p>
                    ) : query.data ? (
                      <div>
                        <div className="text-sm font-medium line-clamp-2 mb-1">{query.data.title}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{query.data.body}</p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div>Total Queries: {2 + userDetailQueries.length + specificPostQueries.length}</div>
          <div>
            Loading:{" "}
            {[usersQuery, postsQuery, ...userDetailQueries, ...specificPostQueries].filter((q) => q.isLoading).length}
          </div>
          <div>
            Success:{" "}
            {[usersQuery, postsQuery, ...userDetailQueries, ...specificPostQueries].filter((q) => q.isSuccess).length}
          </div>
          <div>
            Error:{" "}
            {[usersQuery, postsQuery, ...userDetailQueries, ...specificPostQueries].filter((q) => q.error).length}
          </div>
          <div>
            Fetching:{" "}
            {[usersQuery, postsQuery, ...userDetailQueries, ...specificPostQueries].filter((q) => q.isFetching).length}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
