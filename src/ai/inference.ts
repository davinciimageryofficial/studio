
import OpenAI from "openai";

// By default, the OpenAI library automatically looks for the 
// OPENAI_API_KEY environment variable.
// We no longer need to pass it explicitly.
export const openai = new OpenAI({
  baseURL: "https://api.inference.net/v1",
});
