import axios from 'axios';
import { NewsApiResponse, NewsConfig, NewsArticle } from './types';

/**
 * Client for fetching news from News API
 */
export class NewsClient {
  private readonly baseUrl = 'https://newsapi.org/v2';
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('News API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Fetch news articles about a specific company from the past day
   */
  async fetchCompanyNews(config: Omit<NewsConfig, 'apiKey'>): Promise<NewsArticle[]> {
    const {
      company,
      fromDate = this.getYesterdayDate(),
      language = 'en',
      sortBy = 'publishedAt'
    } = config;

    try {
      const params = new URLSearchParams({
        q: company,
        from: fromDate.toISOString(),
        to: new Date().toISOString(),
        language,
        sortBy,
        apiKey: this.apiKey,
      });

      const response = await axios.get<NewsApiResponse>(
        `${this.baseUrl}/everything?${params.toString()}`,
        {
          headers: {
            'User-Agent': 'Company-News-Summary/1.0',
          },
        }
      );

      if (response.data.status !== 'ok') {
        throw new Error(`News API error: ${response.data.status}`);
      }

      return response.data.articles;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid News API key. Please check your API key.');
        }
        if (error.response?.status === 429) {
          throw new Error('News API rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch news: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get date from 24 hours ago
   */
  private getYesterdayDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
}
