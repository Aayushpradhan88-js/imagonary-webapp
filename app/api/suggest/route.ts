import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            )
        };

        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" }
        );

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json(
            {
                completion: text
            }
        )

    } catch (error) {
        console.error("Failed to generate completion: ", error);
    if (error instanceof GoogleGenerativeAIFetchError && error.status === 503) {
            return new NextResponse(
                "The AI service is currently overloaded. Please try again in a moment.",
                { status: 503 }
            );
        }

        return new NextResponse("An error occurred while generating the suggestion.", { status: 500 });
    }
}