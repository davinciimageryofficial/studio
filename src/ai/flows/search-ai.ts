
'use server';

/**
 * @fileOverview An AI flow to handle general user queries and commands.
 *
 * - searchAI - A function that takes a user query and returns an answer or executes a command.
 */
import { openai } from '@/ai/inference';
import { SearchAIInputSchema, SearchAIOutputSchema, type SearchAIInput, type SearchAIOutput } from '@/ai/schemas/search-ai';
import { searchTheWeb } from '../tools/web-search';
import { navigateTo } from '../tools/navigation';

export type { SearchAIInput, SearchAIOutput };

const systemPrompt = `You are Sentry, a helpful AI assistant integrated into a professional networking platform.

Your role is to answer user questions and execute commands. Be helpful, concise, and friendly.

- If the user asks a question, provide a direct answer.
- If you don't know the answer or the question requires access to real-time information, you MUST use the 'searchTheWeb' tool to find a current, verified answer. Do not state that you cannot access real-time data; instead, proactively offer to search for it.
- If the user gives a command to navigate to a part of the app (e.g., "go to my profile", "open courses", "show me the feed"), use the 'navigateTo' tool.
- If the user asks to perform an action you cannot do, politely inform them of the limitation.

Your entire output must be a valid JSON object. The schema is:
{
  "answer": string,
  "destination": string | null
}
`;

const searchTheWebSchema = {
    type: 'function' as const,
    function: {
        name: 'searchTheWeb',
        description: 'Searches the web for information on a given topic. Use this when you need external information to answer a user\'s question.',
        parameters: {
            type: 'object' as const,
            properties: {
                query: {
                    type: 'string' as const,
                    description: 'The search query.',
                }
            },
            required: ['query'],
        }
    }
};

const navigateToSchema = {
    type: 'function' as const,
    function: {
        name: 'navigateTo',
        description: 'Navigates the user to a specific page within the Sentry application. Use this when the user asks to go to a page, open a feature, or view a specific section.',
        parameters: {
            type: 'object' as const,
            properties: {
                destination: {
                    type: 'string' as const,
                    enum: [
                        "dashboard", 
                        "feed", 
                        "messages", 
                        "discover", 
                        "workspaces", 
                        "workmate-radar", 
                        "news", 
                        "courses", 
                        "billing", 
                        "profile", 
                        "settings"
                    ],
                    description: 'The destination page key.',
                }
            },
            required: ['destination'],
        }
    }
};

export async function searchAI(input: SearchAIInput): Promise<SearchAIOutput> {
    const messages: any[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User query: ${input.query}` }
    ];

    const tools = [searchTheWebSchema, navigateToSchema];

    const response = await openai.chat.completions.create({
        model: "google/gemma-3-27b-instruct/bf-16",
        messages,
        tools: tools,
        tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (toolCalls) {
        messages.push(responseMessage);
        const availableTools = {
            searchTheWeb: searchTheWeb,
            navigateTo: navigateTo,
        };
        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name as keyof typeof availableTools;
            const functionToCall = availableTools[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = await functionToCall(functionArgs);
            messages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name: functionName,
                content: functionResponse,
            });
        }
        const secondResponse = await openai.chat.completions.create({
            model: "google/gemma-3-27b-instruct/bf-16",
            messages: messages,
            response_format: { type: "json_object" },
        });

        const content = secondResponse.choices[0]?.message?.content;
        if (!content) {
            throw new Error("AI failed to generate a response after tool call.");
        }
        try {
            return JSON.parse(content) as SearchAIOutput;
        } catch(e) {
            // If the model fails to return JSON, wrap the plain text response.
            return { answer: content, destination: null };
        }

    } else {
        const content = responseMessage.content;
        if (!content) {
            throw new Error("AI failed to generate a response.");
        }
        try {
             return JSON.parse(content) as SearchAIOutput;
        } catch(e) {
            return { answer: content, destination: null };
        }
    }
}
