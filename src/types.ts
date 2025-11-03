/**
 * Represents a news article from the API
 */
export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

/**
 * Response from News API
 */
export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

/**
 * Configuration for news fetching
 */
export interface NewsConfig {
  apiKey: string;
  company: string;
  fromDate?: Date;
  language?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
}

/**
 * Summary of news articles
 */
export interface NewsSummary {
  company: string;
  dateRange: {
    from: string;
    to: string;
  };
  totalArticles: number;
  articles: Array<{
    title: string;
    source: string;
    publishedAt: string;
    description: string;
    url: string;
  }>;
  summary: string;
}
