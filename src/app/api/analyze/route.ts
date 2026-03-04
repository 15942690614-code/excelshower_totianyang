import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import jwt from 'jsonwebtoken';

// ZhipuAI (GLM) requires a specific JWT generation for API Key
const generateZhipuToken = (apiKey: string) => {
  const [id, secret] = apiKey.split('.');
  const payload = {
    api_key: id,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    timestamp: Math.floor(Date.now() / 1000),
  };
  // @ts-ignore
  return jwt.sign(payload, secret, { algorithm: 'HS256', header: { sign_type: 'SIGN' } });
};

export async function POST(req: Request) {
  try {
    const { content, fileType } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    const glmKey = process.env.GLM_API_KEY;
    if (!glmKey) {
        return NextResponse.json({ error: 'GLM API Key not configured' }, { status: 500 });
    }

    // Initialize client for GLM-4
    const client = new OpenAI({
      baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
      apiKey: generateZhipuToken(glmKey),
    });

    // Construct prompt based on file type
    // GLM-4 is multimodal, but here we process extracted text/OCR content first for robustness
    // If we wanted to process images directly, we would need to pass base64 image data
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
        { role: 'user', content: content.substring(0, 8000) } // GLM-4 has larger context, safe to increase
      ],
      model: 'glm-4',
      temperature: 0.1,
      // response_format: { type: 'json_object' } // GLM-4 standard mode handles JSON instruction well
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

