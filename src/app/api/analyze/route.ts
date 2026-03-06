import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// DeepSeek API Configuration
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

export async function POST(req: Request) {
  try {
    const { content, fileType } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    // Try to get DEEPSEEK_API_KEY, fallback to GLM_API_KEY if configured there
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.GLM_API_KEY;
    
    if (!apiKey) {
        return NextResponse.json({ error: 'DeepSeek API Key not configured' }, { status: 500 });
    }

    // Initialize client for DeepSeek
    const client = new OpenAI({
      baseURL: DEEPSEEK_BASE_URL,
      apiKey: apiKey, 
    });

    // Construct prompt based on file type
    const systemPrompt = `
      You are an expert data analyst. 
      Your task is to extract structured tabular data from the provided unstructured text content (OCR result or parsed document).
      
      The input is from a ${fileType} file.
      
      Output Requirements:
      1. Return ONLY a valid JSON object. No markdown, no explanations.
      2. The JSON must follow this schema:
         {
           "headers": ["Date", "Amount", "Description"], 
           "rows": [
             { "Date": "2023-01-01", "Amount": "100", "Description": "Item A" }
           ]
         }
      3. Infer reasonable headers if they are missing.
      4. Ensure all rows have the same keys as headers.
    `;

    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content.substring(0, 8000) } 
      ],
      model: 'deepseek-chat', 
      temperature: 0.1,
    });

    let result = completion.choices[0].message.content || '';
    
    // Clean up markdown code blocks if present
    result = result.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        const parsedResult = JSON.parse(result);
        return NextResponse.json(parsedResult);
    } catch (e) {
        console.error('JSON Parse Error:', result);
        throw new Error('Failed to parse model response as JSON');
    }

  } catch (error: any) {
    console.error('GLM API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

