interface GeminiAnalyzeRequest {
  image: string; // base64 encoded image
  expectedAmount?: string;
  expectedTransactionId?: string;
  prompt: string;
}

interface GeminiAnalyzeResponse {
  transactionId?: string;
  amount?: string;
  date?: string;
  bankName?: string;
  accountNumber?: string;
  confidence?: string;
  rawText?: string;
  error?: string;
}

export async function analyzeDocumentWithGemini(
  request: GeminiAnalyzeRequest
): Promise<GeminiAnalyzeResponse> {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "your-gemini-api-key";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: request.prompt,
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: request.image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;

      try {
        // Try to parse JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);
          return parsedData;
        } else {
          // Fallback: extract data using regex if JSON parsing fails
          return extractDataFromText(text);
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response as JSON:", parseError);
        return extractDataFromText(text);
      }
    } else {
      throw new Error("No valid response from Gemini API");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to analyze document",
    };
  }
}

function extractDataFromText(text: string): GeminiAnalyzeResponse {
  // Fallback extraction using regex patterns
  const transactionIdMatch = text.match(
    /(?:transaction|txn|ref|reference)[\s:]*([a-zA-Z0-9]{6,})/i
  );
  const amountMatch = text.match(
    /(?:amount|total|sum)[\s:]*(?:\$|USD)?[\s]*([0-9,]+\.?[0-9]*)/i
  );
  const dateMatch = text.match(/(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
  const bankMatch = text.match(
    /(?:bank|brac|dutch|city|standard|islami|trust|mutual|prime|southeast|mercantile|national|commercial|agrani|janata|rupali|sonali)/i
  );

  return {
    transactionId: transactionIdMatch?.[1],
    amount: amountMatch?.[1]?.replace(/,/g, ""),
    date: dateMatch?.[1],
    bankName: bankMatch?.[0],
    confidence: "medium",
    rawText: text,
  };
}
