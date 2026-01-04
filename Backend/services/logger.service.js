const levelPriority = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const defaultLevel = process.env.LOG_LEVEL || "info";
const isProd = process.env.NODE_ENV === "production";

export const loggerService = {
  debug,
  info,
  warn,
  error,
};

function debug(...args) {
  _log("debug", ...args);
}

function info(...args) {
  _log("info", ...args);
}

function warn(...args) {
  _log("warn", ...args);
}

function error(...args) {
  _log("error", ...args);
}

function _log(level, ...args) {
  if (!_shouldLog(level)) return;

  const ts = new Date().toISOString();
  const prefix = `[${ts}] [${level.toUpperCase()}]`;

  if (isProd && level === "debug") return;

  const fn =
    level === "error"
      ? console.error
      : level === "warn"
      ? console.warn
      : console.log;

  fn(prefix, ...args);
}

function _shouldLog(level) {
  const current = levelPriority[defaultLevel] ?? levelPriority.info;
  const incoming = levelPriority[level] ?? levelPriority.info;
  return incoming >= current;
}
