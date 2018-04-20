/* tslint:disable */

export interface User {
  email: string;
  username: string;
  token?: string | null;
  image?: string | null;
  bio?: string | null;
}

export interface Query {
  user: MeResponse;
  article?: Article | null;
  articles?: ArticlesConnection | null;
  feed?: ArticlesConnection | null;
  profile: ProfileResponse;
  tags?: string[] | null;
}

export interface MeResponse {
  user?: User | null;
  errors?: Error | null;
}

export interface Error {
  body: string[];
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
  author: Profile;
  comments?: CommentsConnection | null;
}

export interface Profile {
  username: string;
  bio?: string | null;
  image?: string | null;
  following: boolean;
  articles?: ArticlesConnection | null;
  comments?: CommentsConnection | null;
  favorites?: ArticlesConnection | null;
}

export interface ArticlesConnection {
  count: number;
  edges?: ArticleEdge[] | null;
  pageInfo: PageInfo;
}

export interface ArticleEdge {
  node?: Article | null;
  cursor: string;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export interface CommentsConnection {
  count: number;
  edges?: CommentEdge[] | null;
  pageInfo: PageInfo;
}

export interface CommentEdge {
  node?: Comment | null;
  cursor: string;
}

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
}

export interface ProfileResponse {
  profile?: Profile | null;
  errors?: Error | null;
}

export interface Mutation {
  login: MeResponse;
  register: MeResponse;
  updateUser: MeResponse;
  follow: ProfileResponse;
  unfollow: ProfileResponse;
  createArticle: ArticleResponse;
  updateArticle?: ArticleResponse | null;
  favoriteArticle?: ArticleResponse | null;
  deleteArticle: boolean;
  addComment: CommentResponse;
  deleteComment: boolean;
}

export interface ArticleResponse {
  article?: Article | null;
  errors?: Error | null;
}

export interface CommentResponse {
  comment?: Comment | null;
  errors?: Error | null;
}

export interface ArticleUpdateInput {
  body?: string | null;
  description?: string | null;
  title?: string | null;
}
export interface ArticleQueryArgs {
  slug?: string | null;
}
export interface ArticlesQueryArgs {
  tag?: string | null;
  authoredBy?: string | null;
  favoritedBy?: string | null;
}
export interface FeedQueryArgs {
  first?: number | null;
  after?: string | null;
}
export interface ProfileQueryArgs {
  username: string;
}
export interface CommentsArticleArgs {
  first?: number | null;
  after?: string | null;
}
export interface ArticlesProfileArgs {
  first?: number | null;
  after?: string | null;
}
export interface CommentsProfileArgs {
  first?: number | null;
  after?: string | null;
}
export interface FavoritesProfileArgs {
  first?: number | null;
  after?: string | null;
}
export interface LoginMutationArgs {
  email: string;
  password: string;
}
export interface RegisterMutationArgs {
  email: string;
  password: string;
  username: string;
}
export interface UpdateUserMutationArgs {
  email?: string | null;
  bio?: string | null;
  image?: string | null;
}
export interface FollowMutationArgs {
  username: string;
}
export interface UnfollowMutationArgs {
  username: string;
}
export interface CreateArticleMutationArgs {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList?: string[] | null;
}
export interface UpdateArticleMutationArgs {
  slug?: string | null;
  changes: ArticleUpdateInput;
}
export interface FavoriteArticleMutationArgs {
  slug: string;
}
export interface DeleteArticleMutationArgs {
  slug: string;
}
export interface AddCommentMutationArgs {
  slug: string;
  body: string;
}
export interface DeleteCommentMutationArgs {
  id: number;
}
