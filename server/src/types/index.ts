/* tslint:disable */

export interface Query {
  user?: User | null;
  article: Article;
  articles: ArticlesResponse;
  tags?: string[] | null;
}

export interface User {
  email: string;
  username: string;
  image?: string | null;
  bio: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author?: ArticleAuthorLink | null;
}

export interface ArticleAuthorLink {
  username: string;
  bio: string;
  image?: string | null;
  following: boolean;
}

export interface ArticlesResponse {
  articles?: Article[] | null;
  articlesCount: number;
}

export interface Mutation {
  login: LoginResponse;
  createUser: UserResponse;
  createArticle: ArticleResponse;
  register: RegisterResponse;
}

export interface LoginResponse {
  email: string;
  token: string;
  username: string;
  bio?: string | null;
  image?: string | null;
  errors?: Error | null;
}

export interface Error {
  body: string[];
}

export interface UserResponse {
  user?: User | null;
  errors?: Error | null;
}

export interface ArticleResponse {
  article?: Article | null;
  errors?: Error | null;
}

export interface RegisterResponse {
  user?: User | null;
  errors?: Error | null;
}
export interface ArticleQueryArgs {
  id: number;
}
export interface ArticlesQueryArgs {
  tag?: string | null;
  authoredBy?: string | null;
  favoritedBy?: string | null;
}
export interface LoginMutationArgs {
  email: string;
  password: string;
}
export interface CreateUserMutationArgs {
  email: string;
  username: string;
  image?: string | null;
  bio: string;
}
export interface CreateArticleMutationArgs {
  slug: string;
  title: string;
  description: string;
  body: string;
  tags?: string[] | null;
}
export interface RegisterMutationArgs {
  email: string;
  password: string;
  username: string;
}
