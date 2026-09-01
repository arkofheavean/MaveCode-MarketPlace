#!/usr/bin/env node
import { createHash, createPublicKey, verify } from "node:crypto"
import { readFile, readdir } from "node:fs/promises"

const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
  }
  return value
}

const canonical = (value) => JSON.stringify(stable(value))
const sha256 = (value) => createHash("sha256").update(value).digest("hex")

const readJson = async (filePath) => JSON.parse(await readFile(filePath, "utf8"))
const requiredString = (value, label) => {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${label} must be a non-empty string`)
}
const assertNoDuplicate = (values, label) => {
  const seen = new Set()
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`)
    seen.add(value)
  }
}
const assertTemplateJson = (content, label) => {
  const placeholders = [...content.matchAll(/\{\{([^}]+)\}\}/g)].map((match) => match[1])
  for (const placeholder of placeholders) {
    if (!/^[A-Z0-9_]+$/.test(placeholder)) throw new Error(`${label} has invalid placeholder ${placeholder}`)
  }
  const templated = content.replaceAll(/\{\{[A-Z0-9_]+\}\}/g, "__PLACEHOLDER__")
  try {
    JSON.parse(templated)
  } catch (error) {
    throw new Error(`${label} contains invalid template JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
}
const scanSecrets = (value, label) => {
  const text = typeof value === "string" ? value : JSON.stringify(value)
  const jwtPattern = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/
  if (jwtPattern.test(text)) throw new Error(`${label} contains a JWT-like token`)
  const metoroDemoPattern = /demo\.us-east\.metoro\.io|test@chrisbattarbee\.com/i
  if (metoroDemoPattern.test(text)) throw new Error(`${label} contains Metoro demo data`)
}
const validateMcpItem = (item, label) => {
  requiredString(item.id, `${label}.id`)
  requiredString(item.name, `${label}.name`)
  requiredString(item.description, `${label}.description`)
  requiredString(item.url, `${label}.url`)
  requiredString(item.version, `${label}.version`)
  requiredString(item.updatedAt, `${label}.updatedAt`)
  if (item.type !== "mcp") throw new Error(`${label}.type must be mcp`)
  new URL(item.url)
  const contents = Array.isArray(item.content) ? item.content : [{ name: item.name, content: item.content }]
  for (const [index, method] of contents.entries()) {
    requiredString(method.name, `${label}.content[${index}].name`)
    requiredString(method.content, `${label}.content[${index}].content`)
    assertTemplateJson(method.content, `${label}.content[${index}]`)
  }
  for (const [index, parameter] of (item.parameters ?? []).entries()) {
    requiredString(parameter.name, `${label}.parameters[${index}].name`)
    requiredString(parameter.key, `${label}.parameters[${index}].key`)
  }
  scanSecrets(item, label)
}
const key = (await readJson("keys/public-keys.json")).keys.find((entry) => entry.id === "mavecode-marketplace-2026-01")
if (!key) throw new Error("Missing marketplace signing public key")

const verifySignedDocument = async (filePath) => {
  const document = await readJson(filePath)
  const { signature, ...payload } = document
  if (typeof signature !== "string") throw new Error(`${filePath} is missing a signature`)
  const valid = verify(null, Buffer.from(canonical(payload)), createPublicKey(key.publicKeyPem), Buffer.from(signature, "base64"))
  if (!valid) throw new Error(`${filePath} signature is invalid`)
  console.log(`OK signature ${filePath}`)
  return document
}

const marketplace = await verifySignedDocument("marketplace.json")
if (marketplace.name !== "MaveCode-MarketPlace") throw new Error("Root marketplace name changed")

const personas = await verifySignedDocument("personas/personas.json")
const mcps = await verifySignedDocument("mcps/mcps.json")
assertNoDuplicate(personas.items.map((item) => item.id), "persona id")
assertNoDuplicate(mcps.items.map((item) => item.id), "MCP id")
const sortedMcpIds = [...mcps.items.map((item) => item.id)].sort((left, right) => left.localeCompare(right))
if (mcps.items.map((item) => item.id).join("\n") !== sortedMcpIds.join("\n")) throw new Error("MCP catalog order is not stable")
for (const [index, item] of mcps.items.entries()) validateMcpItem(item, `mcps.items[${index}]`)

const sourceDirectories = (await readdir("mcps/items", { withFileTypes: true })).filter((entry) => entry.isDirectory())
const sourceItems = []
for (const directory of sourceDirectories) {
  const item = await readJson(`mcps/items/${directory.name}/mcp.json`)
  validateMcpItem({ ...item, type: item.type ?? "mcp" }, `mcps/items/${directory.name}/mcp.json`)
  sourceItems.push(item.id)
}
assertNoDuplicate(sourceItems, "MCP source id")
if (sourceItems.length !== mcps.items.length) throw new Error("MCP source count does not match signed catalog")

for (const item of personas.items) {
  const bytes = await readFile(item.packageUrl)
  if (bytes.length !== item.packageSize || sha256(bytes) !== item.sha256) {
    throw new Error(`${item.id} package digest/size does not match catalog`)
  }
  const personaPackage = await verifySignedDocument(item.packageUrl)
  if (personaPackage.id !== item.id || personaPackage.version !== item.version) {
    throw new Error(`${item.id} package identity does not match catalog`)
  }
}
