import axios from "axios"
import { BRAVE_API_KEY } from "./env.js"
import { logger } from "./logger.js"

const VERIFY_URL = "https://hub.ag3nts.org/verify"

type VerifyPayload = {
  task: string
  answer: unknown
}

type VerifyResponse = {
  code: number
  message: string
}

export const braveVerify = async (payload: VerifyPayload) => {
  const body = {
    apikey: BRAVE_API_KEY(),
    ...payload,
  }

  logger.info(`Sending answer for task: ${payload.task}`)
  logger.debug("Payload", body)

  const { data } = await axios.post<VerifyResponse>(VERIFY_URL, body)

  logger.info(`Response: [${data.code}] ${data.message}`)
  return data
}

export const braveDataUrl = (path: string) =>
  `https://hub.ag3nts.org/data/${BRAVE_API_KEY()}/${path}`
