import { supabase } from "./supabase";

type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function getOpenAIKey(): Promise<string | null> {
  try {
    const { data: apiKeys, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("provider", "openai")
      .eq("is_active", true)
      .limit(1);

    if (error) throw error;
    return apiKeys && apiKeys.length > 0 ? apiKeys[0].key_value : null;
  } catch (error) {
    console.error("Error fetching OpenAI API key:", error);
    return null;
  }
}

export async function callOpenAI({
  messages,
  model = "gpt-3.5-turbo",
  temperature = 0.7,
  maxTokens = 500,
}: {
  messages: OpenAIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}) {
  const apiKey = await getOpenAIKey();

  if (!apiKey) {
    return {
      error:
        "No OpenAI API key found. Please add your API key in the settings.",
      content: null,
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling OpenAI API");
    }

    const data = await response.json();
    return {
      error: null,
      content: data.choices[0].message.content,
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return {
      error: error.message || "Error calling OpenAI API",
      content: null,
    };
  }
}

export async function generateMedicalResponse(userQuery: string) {
  const systemPrompt = `You are an AI medical assistant for Medgen AI. Provide helpful, accurate, and concise information about medical topics. 
  Always include a disclaimer that you're not a substitute for professional medical advice. 
  If asked about serious symptoms, always recommend consulting a healthcare professional.`;

  return callOpenAI({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
  });
}

export async function analyzeMedicalImage(
  imageType: string,
  findings: string[],
) {
  const systemPrompt = `You are an AI medical image analysis assistant for Medgen AI. Based on the image type and findings provided, generate a detailed analysis and interpretation.`;

  const userContent = `Image Type: ${imageType}\nFindings: ${findings.join("\n- ")}\n\nPlease provide a detailed analysis and interpretation of these findings.`;

  return callOpenAI({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    maxTokens: 800,
  });
}

export async function generateDiagnosis(
  symptoms: string[],
  answers: Record<string, string>,
) {
  const systemPrompt = `You are an AI medical diagnosis assistant for Medgen AI. Based on the symptoms and additional information provided, suggest possible conditions and recommendations. Always include a disclaimer about consulting healthcare professionals.`;

  const formattedAnswers = Object.entries(answers)
    .map(([question, answer]) => `${question}: ${answer}`)
    .join("\n");

  const userContent = `Symptoms: ${symptoms.join(", ")}\n\nAdditional Information:\n${formattedAnswers}\n\nPlease provide potential diagnoses based on these symptoms and information.`;

  return callOpenAI({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    maxTokens: 1000,
  });
}

export async function generateDrugInfo(input: string, method: string) {
  const systemPrompt = `You are an AI pharmaceutical assistant for Medgen AI's drug discovery feature. Based on the input provided, generate information about potential drug compounds, their properties, and possible applications. Include appropriate disclaimers about the theoretical nature of this information.`;

  const userContent = `Method: ${method}\nInput: ${input}\n\nPlease provide information about potential drug compounds based on this input.`;

  return callOpenAI({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    maxTokens: 1000,
  });
}
