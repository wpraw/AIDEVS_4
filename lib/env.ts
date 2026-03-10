import dotenv from "dotenv"
import path from "node:path"

dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") })

export const getEnv = (key: string) => {
  const value = process.env[key]
  if (!value) throw new Error(`Missing env variable: ${key}`)
  return value
}

export const BRAVE_API_KEY = () => getEnv("BRAVE_API_KEY")
export const OPENROUTER_API_KEY = () => getEnv("OPENROUTER_API_KEY")
