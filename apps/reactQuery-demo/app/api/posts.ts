import type { Comment, CreatePostData, Post, UpdatePostData, User } from "../types";

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Utility function để simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const postsApi = {
  // Fetch all posts
  getPosts: async (): Promise<Post[]> => {
    await delay(1000); // Simulate network delay
    const response = await fetch(`${BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return response.json();
  },

  // Fetch single post
  getPost: async (id: number): Promise<Post> => {
    await delay(500);
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post ${id}`);
    }
    return response.json();
  },

  // Fetch posts with pagination
  getPostsPaginated: async (page = 1, limit = 10): Promise<Post[]> => {
    await delay(800);
    const response = await fetch(`${BASE_URL}/posts?_page=${page}&_limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch paginated posts");
    }
    return response.json();
  },

  // Fetch posts by user
  getPostsByUser: async (userId: number): Promise<Post[]> => {
    await delay(600);
    const response = await fetch(`${BASE_URL}/posts?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${userId}`);
    }
    return response.json();
  },

  // Create new post
  createPost: async (data: CreatePostData): Promise<Post> => {
    await delay(1200);
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create post");
    }
    return response.json();
  },

  // Update post
  updatePost: async (data: UpdatePostData): Promise<Post> => {
    await delay(1000);
    const response = await fetch(`${BASE_URL}/posts/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    return response.json();
  },

  // Delete post
  deletePost: async (id: number): Promise<void> => {
    await delay(800);
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
  },
};

export const usersApi = {
  // Fetch all users
  getUsers: async (): Promise<User[]> => {
    await delay(700);
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  },

  // Fetch single user
  getUser: async (id: number): Promise<User> => {
    await delay(500);
    const response = await fetch(`${BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user ${id}`);
    }
    return response.json();
  },
};

export const commentsApi = {
  // Fetch comments for a post
  getCommentsByPost: async (postId: number): Promise<Comment[]> => {
    await delay(600);
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${postId}`);
    }
    return response.json();
  },
};
