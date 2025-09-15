
import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://api.inference.net/v1",
  apiKey: process.env.INFERENCE_API_KEY,
});
