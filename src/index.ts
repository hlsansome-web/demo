import * as dotenv from 'dotenv';
import { NewsClient } from './newsClient';
import { NewsSummarizer } from './summarizer';
import { NewsSummary } from './types';

// Load environment variables
dotenv.config();

/**
 * Main class for company news summary application
 */
export class CompanyNewsSummary {
  private newsClient: NewsClient;
  private summarizer: NewsSummarizer;

  constructor(apiKey: string) {
    this.newsClient = new NewsClient(apiKey);
    this.summarizer = new NewsSummarizer();
  }

  /**
   * Generate a news summary for a specific company
   * @param company - The company name to search for
   * @param options - Additional options for the search
   */
  async generateSummary(
    company: string,
    options?: {
      fromDate?: Date;
      language?: string;
      sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
    }
  ): Promise<NewsSummary> {
    console.log(`Fetching news for "${company}"...`);

    const fromDate = options?.fromDate || this.getYesterdayDate();
    const articles = await this.newsClient.fetchCompanyNews({
      company,
      fromDate,
      language: options?.language,
      sortBy: options?.sortBy,
    });

    console.log(`Found ${articles.length} articles. Generating summary...`);

    const summary = this.summarizer.createSummary(company, articles, fromDate);
    return summary;
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

/**
 * Main execution function
 */
async function main() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.error('Error: NEWS_API_KEY environment variable is not set.');
    console.error('Please create a .env file with your News API key.');
    console.error('Get your free API key at: https://newsapi.org/');
    process.exit(1);
  }

  // Get company name from command line arguments
  const company = process.argv[2];

  if (!company) {
    console.error('Usage: npm run dev <company-name>');
    console.error('Example: npm run dev "Tesla"');
    process.exit(1);
  }

  try {
    const app = new CompanyNewsSummary(apiKey);
    const summary = await app.generateSummary(company);

    // Print the summary
    console.log('\n' + summary.summary);

    // Optionally save to file
    const fs = require('fs');
    const outputPath = `./summary-${company.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
    console.log(`\nFull summary saved to: ${outputPath}`);

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}

export default CompanyNewsSummary;
