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

const allowedFigmaEmailValidators = new Set([
  "unsupported-code",
  "shared-email-markup",
  "image-alt-and-height",
  "content-td-height",
  "text-only-td-width",
  "reference-sample-leakage",
  "standard-dark-mode",
  "enphase-sfmc-anchor-attributes",
  "enphase-mail-sms-link",
  "enphase-url-utm",
  "enphase-phone-tracking",
])

const officialFigmaPersonas = new Set(["standard", "enphase"])
const maximumFigmaSkeletonBytes = 512 * 1024
const maximumFigmaPromptRules = 100
const maximumFigmaPromptRuleLength = 2000

const validatePersonaFigmaAssets = (personaPackage, label) => {
  const figma = personaPackage.figma ?? []
  if (personaPackage.supportsFigma !== true && personaPackage.supportsFigma !== false) {
    throw new Error(`${label} must declare a boolean supportsFigma`)
  }
  if (personaPackage.supportsFigma && !officialFigmaPersonas.has(personaPackage.id)) {
    throw new Error(`${label} may not declare supportsFigma; only official Figma personas may`)
  }
  if (!personaPackage.supportsFigma) {
    if (figma.length > 0) throw new Error(`${label} has figma assets but supportsFigma is false`)
    return
  }
  const byPath = new Map(figma.map((file) => [file.path, file]))
  for (const file of figma) {
    if (!file.path.startsWith("figma/")) throw new Error(`${label}.${file.path} must be a figma/* asset`)
  }
  const capabilityFile = byPath.get("figma/capability.json")
  if (!capabilityFile) throw new Error(`${label} must include figma/capability.json`)
  const capability = JSON.parse(capabilityFile.content)
  if (capability.schemaVersion !== 1 || capability.kind !== "figma-capability") {
    throw new Error(`${label} figma/capability.json has an unsupported schema`)
  }
  if (capability.supportsFigma !== personaPackage.supportsFigma) {
    throw new Error(`${label} figma/capability.json supportsFigma does not match package supportsFigma`)
  }
  if (!Array.isArray(capability.features) || capability.features.some((feature) => typeof feature !== "string" || feature.length === 0)) {
    throw new Error(`${label} figma/capability.json must declare non-empty string features`)
  }
  const rulesFile = byPath.get("figma/prompt-rules.json")
  if (!rulesFile) throw new Error(`${label} must include figma/prompt-rules.json`)
  const promptRules = JSON.parse(rulesFile.content)
  if (promptRules.schemaVersion !== 1 || promptRules.kind !== "figma-prompt-rules") {
    throw new Error(`${label} figma/prompt-rules.json has an unsupported schema`)
  }
  if (!Array.isArray(promptRules.rules) || promptRules.rules.length === 0) {
    throw new Error(`${label} figma/prompt-rules.json must declare rules`)
  }
  if (promptRules.rules.length > maximumFigmaPromptRules) {
    throw new Error(`${label} figma/prompt-rules.json exceeds ${maximumFigmaPromptRules} rules`)
  }
  for (const rule of promptRules.rules) {
    if (typeof rule !== "string" || rule.length === 0) throw new Error(`${label} figma/prompt-rules.json has an empty rule`)
    if (rule.length > maximumFigmaPromptRuleLength) {
      throw new Error(`${label} figma/prompt-rules.json has a rule longer than ${maximumFigmaPromptRuleLength} characters`)
    }
  }
  const skeletonFile = byPath.get("figma/skeleton.html")
  if (!skeletonFile) throw new Error(`${label} must include figma/skeleton.html`)
  if (Buffer.byteLength(skeletonFile.content, "utf8") > maximumFigmaSkeletonBytes) {
    throw new Error(`${label} figma/skeleton.html exceeds ${maximumFigmaSkeletonBytes} bytes`)
  }
  for (const placeholder of ["{{TITLE}}", "{{WIDTH}}"]) {
    if (!skeletonFile.content.includes(placeholder)) {
      throw new Error(`${label} figma/skeleton.html is missing the ${placeholder} placeholder`)
    }
  }
  const invalidPlaceholders = [...skeletonFile.content.matchAll(/\{\{([^}]+)\}\}/g)]
    .map((match) => match[1])
    .filter((placeholder) => !/^[A-Z0-9_]+$/.test(placeholder))
  if (invalidPlaceholders.length > 0) {
    throw new Error(`${label} figma/skeleton.html has invalid placeholders: ${invalidPlaceholders.join(", ")}`)
  }
}

const validatePersonaQaAssets = (personaPackage, label) => {
  const validators = personaPackage.validators ?? []
  const qa = personaPackage.qa ?? []
  if (validators.length === 0) throw new Error(`${label} must include package-owned validator assets`)
  if (qa.length === 0) throw new Error(`${label} must include package-owned QA assets`)
  for (const file of validators) {
    if (!file.path.startsWith("validators/") || !file.path.endsWith(".json")) {
      throw new Error(`${label}.${file.path} must be a validators/*.json asset`)
    }
    const parsed = JSON.parse(file.content)
    if (parsed.schemaVersion !== 1 || parsed.kind !== "figma-email-html-gate") {
      throw new Error(`${label}.${file.path} has an unsupported validator schema`)
    }
    if (!Array.isArray(parsed.validators) || parsed.validators.length === 0) {
      throw new Error(`${label}.${file.path} must declare validators`)
    }
    for (const validator of parsed.validators) {
      if (!allowedFigmaEmailValidators.has(validator)) throw new Error(`${label}.${file.path} has unknown validator ${validator}`)
    }
    if (parsed.validators.includes("reference-sample-leakage") && !Array.isArray(parsed.sampleLeakageMarkers)) {
      throw new Error(`${label}.${file.path} must declare sampleLeakageMarkers`)
    }
    for (const marker of parsed.sampleLeakageMarkers ?? []) {
      if (typeof marker !== "string" || marker.trim().length < 4) {
        throw new Error(`${label}.${file.path} has a sample-leakage marker shorter than 4 characters`)
      }
    }
  }
  for (const file of qa) {
    if (!file.path.startsWith("qa/") || !file.path.endsWith(".json")) {
      throw new Error(`${label}.${file.path} must be a qa/*.json asset`)
    }
    const parsed = JSON.parse(file.content)
    if (parsed.schemaVersion !== 1 || parsed.kind !== "figma-email-qa-instructions") {
      throw new Error(`${label}.${file.path} has an unsupported QA schema`)
    }
    if (!Array.isArray(parsed.instructions) || parsed.instructions.some((instruction) => typeof instruction !== "string" || instruction.length === 0)) {
      throw new Error(`${label}.${file.path} must declare non-empty QA instructions`)
    }
  }
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
  validatePersonaQaAssets(personaPackage, item.id)
  validatePersonaFigmaAssets(personaPackage, item.id)
}
