# Company News Summary

A Node.js/TypeScript application that fetches and summarizes news articles about a specific company from the past 24 hours using the News API.

## Features

- Fetch news articles from the past day about any company
- Automatic summarization with key themes and insights
- Source analysis and article grouping
- Export summaries to JSON format
- Command-line interface for easy usage
- TypeScript for type safety

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- News API key (free tier available)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd demo
```

2. Install dependencies:
```bash
npm install
```

3. Set up your API key:
   - Get a free API key from [NewsAPI.org](https://newsapi.org/)
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your API key to the `.env` file:
     ```
     NEWS_API_KEY=your_actual_api_key_here
     ```

## Usage

### Development Mode

Run the application with ts-node:

```bash
npm run dev "Company Name"
```

Examples:
```bash
npm run dev "Tesla"
npm run dev "Apple Inc"
npm run dev "Microsoft"
```

### Production Mode

1. Build the TypeScript code:
```bash
npm run build
```

2. Run the compiled JavaScript:
```bash
npm start "Company Name"
```

## Output

The application provides two types of output:

### 1. Console Summary
A formatted text summary displayed in the terminal including:
- Total number of articles found
- Top news sources
- Key themes and trending topics
- Recent headlines with descriptions

### 2. JSON Export
A detailed JSON file saved to the project directory containing:
- All article metadata
- Complete article list with URLs
- Date range information
- Full summary text

Example output filename: `summary-tesla-1699123456789.json`

## Project Structure

```
demo/
├── src/
│   ├── index.ts          # Main application entry point
│   ├── newsClient.ts     # News API client
│   ├── summarizer.ts     # Summary generation logic
│   └── types.ts          # TypeScript type definitions
├── dist/                 # Compiled JavaScript (generated)
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Example environment file
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## API Reference

### CompanyNewsSummary Class

Main class for generating news summaries.

```typescript
import CompanyNewsSummary from './src/index';

const app = new CompanyNewsSummary(apiKey);

const summary = await app.generateSummary('Tesla', {
  fromDate: new Date('2024-01-01'),  // Optional: custom start date
  language: 'en',                     // Optional: language code
  sortBy: 'publishedAt'               // Optional: 'relevancy' | 'popularity' | 'publishedAt'
});
```

### NewsClient Class

Client for interacting with News API.

```typescript
import { NewsClient } from './src/newsClient';

const client = new NewsClient(apiKey);
const articles = await client.fetchCompanyNews({
  company: 'Tesla',
  fromDate: new Date(),
  language: 'en',
  sortBy: 'publishedAt'
});
```

### NewsSummarizer Class

Service for creating summaries from articles.

```typescript
import { NewsSummarizer } from './src/summarizer';

const summarizer = new NewsSummarizer();
const summary = summarizer.createSummary(company, articles, fromDate);
```

## Configuration

### Environment Variables

- `NEWS_API_KEY` (required): Your News API key from newsapi.org
- `OPENAI_API_KEY` (optional): For future AI-powered summarization features

### News API Limits

The free tier of News API has the following limits:
- 100 requests per day
- Articles from the last 30 days
- Maximum 100 articles per request

For production use, consider upgrading to a paid plan.

## Error Handling

The application handles common errors:
- Missing API key
- Invalid API key (401)
- Rate limit exceeded (429)
- Network errors
- Invalid company names

## Future Enhancements

- [ ] AI-powered summarization using OpenAI GPT
- [ ] Multiple news source support (Google News, Bing News)
- [ ] Sentiment analysis
- [ ] Web dashboard for viewing summaries
- [ ] Email notifications
- [ ] Database storage for historical summaries
- [ ] Scheduled automated summaries

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.

## Acknowledgments

- [News API](https://newsapi.org/) for providing the news data
- Built with TypeScript and Node.js
