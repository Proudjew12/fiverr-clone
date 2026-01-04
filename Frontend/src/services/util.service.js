export const utilService = {
  // ids & random
  makeId,
  getRandomIntInclusive,
  pickRandom,

  // numbers
  clamp,
  toNumber,

  // time
  debounce,
  sleep,
  relativeTime,

  // storage
  saveToStorage,
  loadFromStorage,

  // formatting
  formatCurrency,

  // misc
  deepClone,
  isEmpty,
  buildQueryParams,
};

function makeId(length = 6) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let txt = "";
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(Number(min));
  max = Math.floor(Number(max));
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(items) {
  if (!Array.isArray(items) || !items.length) return null;
  return items[getRandomIntInclusive(0, items.length - 1)];
}

function clamp(n, min, max) {
  n = Number(n);
  min = Number(min);
  max = Number(max);
  return Math.min(max, Math.max(min, n));
}

function toNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function debounce(fn, wait = 300) {
  let tId;
  return (...args) => {
    clearTimeout(tId);
    tId = setTimeout(() => fn(...args), wait);
  };
}

function sleep(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("saveToStorage failed", { key, err });
  }
}

function loadFromStorage(key, defaultValue = undefined) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.error("loadFromStorage failed", { key, err });
    return defaultValue;
  }
}

function relativeTime(ts) {
  const time = typeof ts === "string" ? Date.parse(ts) : Number(ts);
  if (!Number.isFinite(time)) return "";

  const elapsed = Date.now() - time;
  const abs = Math.abs(elapsed);

  const sec = 1000;
  const min = sec * 60;
  const hour = min * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (abs < min) return rtf.format(Math.round(elapsed / sec), "second");
  if (abs < hour) return rtf.format(Math.round(elapsed / min), "minute");
  if (abs < day) return rtf.format(Math.round(elapsed / hour), "hour");
  if (abs < month) return rtf.format(Math.round(elapsed / day), "day");
  if (abs < year) return rtf.format(Math.round(elapsed / month), "month");
  return rtf.format(Math.round(elapsed / year), "year");
}

function formatCurrency(amount, currency = "USD", locale = "en-US") {
  const n = toNumber(amount, 0);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function deepClone(value) {
  // good enough for POJOs used in UI state
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

function buildQueryParams(obj) {
  const params = new URLSearchParams();

  Object.entries(obj || {}).forEach(([key, val]) => {
    if (val === null || val === undefined) return;
    if (Array.isArray(val)) {
      val
        .filter((v) => v !== null && v !== undefined && v !== "")
        .forEach((v) => params.append(key, String(v)));
      return;
    }
    if (val === "") return;
    params.set(key, String(val));
  });

  return params.toString();
}
