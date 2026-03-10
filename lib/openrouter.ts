import { OpenRouter } from "@openrouter/sdk"
import type { Message } from "@openrouter/sdk/models"
import { OPENROUTER_API_KEY } from "./env.js"
import { logger } from "./logger.js"

export type { Message }

export const createOpenRouterClient = () =>
  new OpenRouter({ apiKey: OPENROUTER_API_KEY() })

const models = {
  default: "meta-llama/llama-4-scout",
  stepfun_free: "stepfun/step-3.5-flash:free",
}
const currentModel = models.stepfun_free

export const chat = async (
  client: OpenRouter,
  messages: Message[],
  model = currentModel,
) => {
  logger.debug("OpenRouter chat request", { model, messages: messages.length })

  const response = await client.chat.send({
    chatGenerationParams: { model, messages },
  })

  if ("choices" in response) {
    const content = response.choices?.[0]?.message?.content
    logger.debug("OpenRouter chat response", {
      tokens: response.usage?.totalTokens,
    })
    return (typeof content === "string" ? content : null) ?? ""
  }

  return ""
}

export const chatJson = async <T = unknown>(
  client: OpenRouter,
  messages: Message[],
  model = currentModel,
): Promise<T> => {
  logger.debug("OpenRouter chatJson request", {
    model,
    messages: messages.length,
  })

  const response = await client.chat.send({
    chatGenerationParams: {
      model,
      messages,
      responseFormat: { type: "json_object" },
    },
  })

  if ("choices" in response) {
    const raw = response.choices?.[0]?.message?.content
    logger.debug("OpenRouter chatJson response", {
      tokens: response.usage?.totalTokens,
    })
    return JSON.parse(typeof raw === "string" ? raw : "{}") as T
  }

  return {} as T
}
