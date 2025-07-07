import { Comment, CustomerSegment, DomainCount, PostIdCount } from '../types/comment';

export const processByEmailDomain = (comments: Comment[] | undefined): CustomerSegment[] => {
  if (!comments) return [];
  
  const domainCounts = comments.reduce((acc: DomainCount, comment: Comment) => {
    const domain = comment.email.split('@')[1];
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(domainCounts).map(([name, value]) => ({
    name,
    value
  }));
};

export const processByPostId = (comments: Comment[] | undefined): CustomerSegment[] => {
  if (!comments) return [];
  
  const postCounts = comments.reduce((acc: PostIdCount, comment: Comment) => {
    acc[comment.postId] = (acc[comment.postId] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(postCounts).map(([name, value]) => ({
    name: `Post ${name}`,
    value
  }));
};