import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey || apiKey.startsWith('TODO')) {
        return NextResponse.json({ error: 'Configuration Error: Missing GEMINI_API_KEY' }, { status: 500 });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // User requested specifically "gemini 2.0-flash". 
        // Using 'gemini-2.0-flash' as the model ID. 
        // If this fails, it might be 'gemini-2.0-flash-exp' or similar, but we start with exact request.
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const { query, context } = await req.json();

        const prompt = `
            You are "SkySpeed", a flight search assistant.
            Convert user text to a JSON Action.
            
            Context: ${context?.count || 0} flights, avg $${context?.avgPrice || 0}.
            User: "${query}"
            
            Actions:
            - FILTER: { type: 'FILTER', criteria: { vibe?: 1-10, maxPrice?: number, stops?: number } }
            - SORT: { type: 'SORT', sortBy: 'cheapest'|'fastest'|'vibe'|'efficiency' }
            - RESCUE: { type: 'RESCUE', strategy: 'date-shift' }

            Rules:
            - "Direct" -> FILTER stops: 0
            - "Cheapest" -> SORT cheapest
            - "Vibe" -> SORT vibe OR FILTER vibe: 8
            
            Output ONLY raw JSON. No markdown.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const action = JSON.parse(cleanJson);

        return NextResponse.json(action);

    } catch (error: any) {
        console.error("AI Command Error:", error);
        return NextResponse.json({
            error: 'Failed to process command',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
