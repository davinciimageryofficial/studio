
'use server';

import { getJson } from "serpapi";

/**
 * @fileOverview A tool for the AI to perform web searches using SerpApi.
 */
export async function searchTheWeb(args: { query: string }) {
    console.log(`[Web Search Tool] Searching for: ${args.query}`);

    if (!process.env.SERPAPI_API_KEY) {
        console.error("SERPAPI_API_KEY is not set. Web search will not function.");
        return "I am sorry, but I am unable to perform a web search because the search API is not configured.";
    }

    try {
        const response = await getJson({
            engine: "google",
            q: args.query,
            api_key: process.env.SERPAPI_API_KEY,
        });
        
        // Extract relevant information from the search response.
        // This could be organic results, answer boxes, knowledge graphs, etc.
        if (response.answer_box) {
            return response.answer_box.snippet || response.answer_box.answer;
        }
        if (response.organic_results && response.organic_results.length > 0) {
            return response.organic_results.map(r => `- ${r.title}: ${r.snippet}`).slice(0, 5).join('\n');
        }
        
        return "No specific results found for this query. Try a different search term.";

    } catch (error) {
        console.error("Error performing web search with SerpApi:", error);
        return "Sorry, I encountered an error while trying to search the web.";
    }
}
