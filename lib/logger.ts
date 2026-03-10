type LogLevel = "debug" | "info" | "warn" | "error"

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ?? "debug"

const timestamp = () => new Date().toISOString().slice(11, 23)

const format = (level: LogLevel, msg: string, meta?: unknown) => {
  const base = `[${timestamp()}] ${level.toUpperCase().padEnd(5)} ${msg}`
  return meta !== undefined ? `${base} ${JSON.stringify(meta)}` : base
}

const shouldLog = (level: LogLevel) => LEVELS[level] >= LEVELS[currentLevel]

export const logger = {
  debug(msg: string, meta?: unknown) {
    if (shouldLog("debug")) console.debug(format("debug", msg, meta))
  },
  info(msg: string, meta?: unknown) {
    if (shouldLog("info")) console.info(format("info", msg, meta))
  },
  warn(msg: string, meta?: unknown) {
    if (shouldLog("warn")) console.warn(format("warn", msg, meta))
  },
  error(msg: string, meta?: unknown) {
    if (shouldLog("error")) console.error(format("error", msg, meta))
  },
}
