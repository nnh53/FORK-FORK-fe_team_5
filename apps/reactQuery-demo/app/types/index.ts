export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
}

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export interface CreatePostData {
  title: string
  body: string
  userId: number
}

export interface UpdatePostData {
  id: number
  title: string
  body: string
  userId: number
}
