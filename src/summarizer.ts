import { NewsArticle, NewsSummary } from './types';

/**
 * Service for summarizing news articles
 */
export class NewsSummarizer {
  /**
   * Create a summary from a list of news articles
   */
  createSummary(company: string, articles: NewsArticle[], fromDate: Date): NewsSummary {
    const toDate = new Date();

    // Filter and sort articles
    const sortedArticles = articles
      .filter(article => article.title && article.publishedAt)
      .sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

    // Format articles for summary
    const formattedArticles = sortedArticles.map(article => ({
      title: article.title,
      source: article.source.name,
      publishedAt: new Date(article.publishedAt).toLocaleString(),
      description: article.description || 'No description available',
      url: article.url,
    }));

    // Generate text summary
    const summary = this.generateTextSummary(company, formattedArticles);

    return {
      company,
      dateRange: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      },
      totalArticles: formattedArticles.length,
      articles: formattedArticles,
      summary,
    };
  }

  /**
   * Generate a human-readable text summary
   */
  private generateTextSummary(
    company: string,
    articles: Array<{ title: string; source: string; publishedAt: string; description: string }>
  ): string {
    if (articles.length === 0) {
      return `No news articles found for "${company}" in the past 24 hours.`;
    }

    const lines: string[] = [];
    lines.push(`News Summary for "${company}" (Past 24 Hours)`);
    lines.push('='.repeat(60));
    lines.push(`Total articles found: ${articles.length}`);
    lines.push('');

    // Group articles by source
    const sourceCount = this.countBySources(articles);
    lines.push('Top Sources:');
    Object.entries(sourceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([source, count]) => {
        lines.push(`  - ${source}: ${count} article${count > 1 ? 's' : ''}`);
      });
    lines.push('');

    // Key themes/topics (extracted from titles)
    const themes = this.extractKeyThemes(articles);
    if (themes.length > 0) {
      lines.push('Key Themes:');
      themes.forEach(theme => {
        lines.push(`  - ${theme}`);
      });
      lines.push('');
    }

    // Recent headlines
    lines.push('Recent Headlines:');
    articles.slice(0, 10).forEach((article, index) => {
      lines.push(`${index + 1}. ${article.title}`);
      lines.push(`   Source: ${article.source} | Published: ${article.publishedAt}`);
      if (article.description && article.description !== 'No description available') {
        lines.push(`   ${article.description.substring(0, 150)}${article.description.length > 150 ? '...' : ''}`);
      }
      lines.push('');
    });

    return lines.join('\n');
  }

  /**
   * Count articles by source
   */
  private countBySources(articles: Array<{ source: string }>): Record<string, number> {
    return articles.reduce((acc, article) => {
      acc[article.source] = (acc[article.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Extract key themes from article titles
   */
  private extractKeyThemes(articles: Array<{ title: string }>): string[] {
    // Simple keyword extraction from titles
    const keywords = new Map<string, number>();
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'has', 'have', 'had', 'will', 'would', 'could', 'should']);

    articles.forEach(article => {
      const words = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));

      words.forEach(word => {
        keywords.set(word, (keywords.get(word) || 0) + 1);
      });
    });

    // Get top keywords
    return Array.from(keywords.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => `${word} (${count} mentions)`);
  }
}
