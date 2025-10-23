// src/openaiProvider.js
import OpenAI from "openai";

const DEFAULT_OPENAI_KEY = "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";

function clean(value) {
  const text = (value ?? "").toString().trim();
  return text ? text : null;
}

function resolveOpenAIProject() {
  return (
    clean(process.env.OPENAI_PROJECT) ||
    clean(process.env.OPENAI_API_PROJECT) ||
    clean(process.env.OPENAI_PROJECT_ID) ||
    null
  );
}

function resolveOpenAIOrg() {
  return clean(process.env.OPENAI_ORG) || clean(process.env.OPENAI_ORGANIZATION) || null;
}

function resolveOpenAIBaseURL() {
  return clean(process.env.OPENAI_BASE_URL) || clean(process.env.OPENAI_API_BASE_URL) || null;
}

let cachedKey = null;
let cachedClient = null;

export function resolveOpenAIKey() {
  const key = clean(process.env.OPENAI_API_KEY) || DEFAULT_OPENAI_KEY;
  return key;
}

export function ensureOpenAIClient() {
  const key = resolveOpenAIKey();
  if (!key) {
    cachedKey = null;
    cachedClient = null;
    return null;
  }
  if (cachedClient && cachedKey === key) {
    return cachedClient;
  }
  try {
    const project = resolveOpenAIProject();
    const organization = resolveOpenAIOrg();
    const baseURL = resolveOpenAIBaseURL();

    const config = { apiKey: key };
    if (project) config.project = project;
    if (organization) config.organization = organization;
    if (baseURL) config.baseURL = baseURL;

    cachedClient = new OpenAI(config);
    cachedKey = key;
  } catch {
    cachedClient = null;
    cachedKey = null;
  }
  return cachedClient;
}

export function invalidateOpenAIClient() {
  cachedClient = null;
}

export function hasOpenAIKey() {
  return !!resolveOpenAIKey();
}
