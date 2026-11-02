import { buildSystemPrompt } from "./systemPrompt";
import { ChatMessage, generateFallbackResponse } from "./geminiFallback";

export { type ChatMessage, generateFallbackResponse };

function getGeminiApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY
  );
}

function formatContentsForGemini(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

/**
 * Trả về Web ReadableStream chuyển từng token về Client qua Server-Sent Events (SSE)
 */
export async function streamChatMessage(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const apiKey = getGeminiApiKey();
  const lastUserMessage = messages[messages.length - 1]?.content || "";

  // 1. Fallback nếu không có API key hoặc offline: Stream giả lập Typewriter mượt mà
  if (!apiKey) {
    const fallbackText = generateFallbackResponse(lastUserMessage);
    return new ReadableStream({
      async start(controller) {
        const words = fallbackText.split(/(\s+)/);
        for (const word of words) {
          const chunk = `data: ${JSON.stringify({ text: word })}\n\n`;
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 18));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });
  }

  const systemInstruction = buildSystemPrompt();
  const formattedContents = formatContentsForGemini(messages);
  const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2500,
          },
        }),
      });

      if (!res.ok || !res.body) {
        continue;
      }

      // Tạo transform stream từ Gemini SSE sang Client SSE
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      return new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith("data: ")) {
                  try {
                    const jsonStr = trimmed.slice(6);
                    if (jsonStr === "[DONE]") continue;
                    const parsed = JSON.parse(jsonStr);
                    const textChunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (textChunk) {
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ text: textChunk })}\n\n`)
                      );
                    }
                  } catch {}
                }
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          } catch (streamErr) {
            controller.error(streamErr);
          } finally {
            controller.close();
          }
        },
      });
    } catch {
      continue;
    }
  }

  // Fallback nếu gọi API thất bại
  const fallbackText = generateFallbackResponse(lastUserMessage);
  return new ReadableStream({
    async start(controller) {
      const words = fallbackText.split(/(\s+)/);
      for (const word of words) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: word })}\n\n`));
        await new Promise((r) => setTimeout(r, 18));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

