import OpenAI from "openai";

const APIKEY = process.env.OPEN_AI_API_KEY;

if (!APIKEY) {
  throw new Error("OPEN AI API KEY MISSING.");
}

const openai = new OpenAI({
  apiKey: APIKEY,
});

export default async function moderation(content: string) {
  return await openai.moderations.create({ input: content });
}
