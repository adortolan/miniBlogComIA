// Firebase Types
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Domain Types
export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  imageURL?: string;
  authorId: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  tags: string[];
  imageURL?: string;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
  tags?: string[];
  imageURL?: string;
}

// Context Types
export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// Service Types
export interface PostService {
  createPost(postData: CreatePostDTO): Promise<Post>;
  getAllPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | null>;
  getPostBySlug(slug: string): Promise<Post | null>;
  updatePost(id: string, postData: UpdatePostDTO): Promise<void>;
  deletePost(id: string): Promise<void>;
  getPostsByTag(tag: string): Promise<Post[]>;
  checkSlugUniqueness(slug: string, excludeId?: string | null): Promise<boolean>;
  subscribeToPostsRealtime(
    callback: (posts: Post[]) => void,
    errorCallback?: (error: Error) => void
  ): () => void;
}

// Hook Return Types
export interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export interface UseMutationResult<T> {
  mutate: (data: T) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface PostCardProps {
  post: Post;
}

export interface PostFormProps {
  initialData?: Partial<Post>;
  onSubmit: (data: CreatePostDTO | UpdatePostDTO) => Promise<void>;
  onCancel?: () => void;
}

export interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}