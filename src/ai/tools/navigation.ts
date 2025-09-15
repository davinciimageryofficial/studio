
'use server';

/**
 * @fileOverview A tool for the AI to navigate the application.
 */
export async function navigateTo(args: { destination: string }) {
    // This function's primary job is to structure the output for the flow.
    // The actual navigation will be handled by the client-side code that calls the flow.
    return JSON.stringify({
      answer: `Navigating you to the ${args.destination} page.`,
      destination: args.destination,
    });
  }
