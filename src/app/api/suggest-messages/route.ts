import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // const { messages } = await req.json();
    const prompt =
      "Create a list of three open-ended and engaging question formatted as a string. Each question should be seperate by '||'. These question are for anonymous social media platform, like Qooh.me and should be suitable for a diverse audience. Avoid personal or sensitive topics, instead focusing on universal themes that encourage friendly interaction.";

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 400,
      stream: true,
      prompt,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          headers,
          message,
        },
        { status }
      );
    } else {
      throw error;
    }
  }
}
