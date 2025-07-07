import { User, Post} from '../types/user';

export interface CustomerSegment {
  name: string;
  value: number;
  color?: string;
}

export const segmentByEmailDomain = (users: User[]): CustomerSegment[] => {
  const domainCounts: { [key: string]: number } = {};
  
  users.forEach(user => {
    const domain = user.email.split('@')[1];
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
  });

  return Object.entries(domainCounts)
    .map(([domain, count]) => ({
      name: domain,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);
};

export const segmentByCity = (users: User[]): CustomerSegment[] => {
  const cityCounts: { [key: string]: number } = {};
  
  users.forEach(user => {
    const city = user.address.city;
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  return Object.entries(cityCounts)
    .map(([city, count]) => ({
      name: city,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);
};

export const segmentByCompany = (users: User[]): CustomerSegment[] => {
  const companyCounts: { [key: string]: number } = {};
  
  users.forEach(user => {
    const company = user.company.name;
    companyCounts[company] = (companyCounts[company] || 0) + 1;
  });

  return Object.entries(companyCounts)
    .map(([company, count]) => ({
      name: company,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);
};

export const segmentByEngagement = (users: User[], posts: Post[]): CustomerSegment[] => {
  const userPostCounts: { [key: number]: number } = {};
  
  // Count posts per user
  posts.forEach(post => {
    userPostCounts[post.userId] = (userPostCounts[post.userId] || 0) + 1;
  });

  // Categorize users by engagement level
  const engagementLevels = {
    'High Engagement (5+ posts)': 0,
    'Medium Engagement (2-4 posts)': 0,
    'Low Engagement (1 post)': 0,
    'No Activity': 0,
  };

  users.forEach(user => {
    const postCount = userPostCounts[user.id] || 0;
    
    if (postCount >= 5) {
      engagementLevels['High Engagement (5+ posts)']++;
    } else if (postCount >= 2) {
      engagementLevels['Medium Engagement (2-4 posts)']++;
    } else if (postCount === 1) {
      engagementLevels['Low Engagement (1 post)']++;
    } else {
      engagementLevels['No Activity']++;
    }
  });

  return Object.entries(engagementLevels)
    .map(([level, count]) => ({
      name: level,
      value: count,
    }))
    .filter(segment => segment.value > 0);
};