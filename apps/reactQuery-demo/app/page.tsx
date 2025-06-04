"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Posts from "./components/Posts"
import PostForm from "./components/PostForm"
import InfinitePosts from "./components/InfinitePosts"
import UserPosts from "./components/UserPosts"
import ParallelQueries from "./components/ParallelQueries"
import OptimisticUpdates from "./components/OptimisticUpdates"

// Tạo QueryClient với cấu hình tùy chỉnh
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 phút
      gcTime: 10 * 60 * 1000, // 10 phút (trước đây là cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">React Query Demo</h1>
          <p className="text-muted-foreground">Comprehensive demo showcasing all React Query features</p>
        </div>

        <Tabs defaultValue="basic-queries" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="basic-queries">Basic Queries</TabsTrigger>
            <TabsTrigger value="mutations">Mutations</TabsTrigger>
            <TabsTrigger value="infinite">Infinite</TabsTrigger>
            <TabsTrigger value="dependent">Dependent</TabsTrigger>
            <TabsTrigger value="parallel">Parallel</TabsTrigger>
            <TabsTrigger value="optimistic">Optimistic</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-queries" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Queries</CardTitle>
                <CardDescription>Demo useQuery với loading states, error handling, và refetching</CardDescription>
              </CardHeader>
              <CardContent>
                <Posts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mutations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mutations</CardTitle>
                <CardDescription>Demo useMutation để tạo, cập nhật và xóa data</CardDescription>
              </CardHeader>
              <CardContent>
                <PostForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="infinite" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Infinite Queries</CardTitle>
                <CardDescription>Demo useInfiniteQuery cho pagination và load more</CardDescription>
              </CardHeader>
              <CardContent>
                <InfinitePosts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dependent" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Dependent Queries</CardTitle>
                <CardDescription>Demo queries phụ thuộc vào kết quả của queries khác</CardDescription>
              </CardHeader>
              <CardContent>
                <UserPosts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parallel" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Parallel Queries</CardTitle>
                <CardDescription>Demo chạy nhiều queries song song</CardDescription>
              </CardHeader>
              <CardContent>
                <ParallelQueries />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimistic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimistic Updates</CardTitle>
                <CardDescription>Demo optimistic updates và rollback khi có lỗi</CardDescription>
              </CardHeader>
              <CardContent>
                <OptimisticUpdates />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* React Query DevTools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
