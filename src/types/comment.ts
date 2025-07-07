export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface CustomerSegment {
  name: string;
  value: number;
}

export type DomainCount = Record<string, number>;
export type PostIdCount = Record<number, number>;