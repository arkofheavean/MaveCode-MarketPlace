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

const allowedFigmaEmailGateRuleTypes = new Set([
  "forbidden-css-pattern",
  "required-css-signature",
  "required-class-mapping",
  "anchor-attribute-policy",
  "link-scheme-policy",
  "url-query-policy",
  "phone-tracking-policy",
  "content-marker-leakage",
  "forbidden-tag",
  "forbidden-css-feature",
  "required-tag-attributes",
  "forbidden-inline-style-property",
  "conditional-required-pattern",
  "content-cell-height-policy",
  "text-only-cell-width-policy",
])
const maximumGateRuleRegexLength = 2000
const tagNamePattern = /^[a-z][a-z0-9-]*$/i
const assertTagName = (value, label) => {
  if (typeof value !== "string" || !tagNamePattern.test(value)) {
    throw new Error(`${label} must be a valid HTML tag name`)
  }
}
const assertGateRegex = (value, label) => {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${label} must be a non-empty regex string`)
  if (value.length > maximumGateRuleRegexLength) throw new Error(`${label} exceeds ${maximumGateRuleRegexLength} characters`)
  try {
    new RegExp(value)
  } catch (error) {
    throw new Error(`${label} is not a valid regex: ${error instanceof Error ? error.message : String(error)}`)
  }
}
const assertStringArray = (value, label) => {
  if (!Array.isArray(value) || value.length === 0 || value.some((entry) => typeof entry !== "string" || entry.length === 0)) {
    throw new Error(`${label} must be a non-empty string array`)
  }
}
const validateGateRule = (rule, label) => {
  if (!rule || typeof rule !== "object") throw new Error(`${label} must be an object`)
  requiredString(rule.id, `${label}.id`)
  requiredString(rule.code, `${label}.code`)
  requiredString(rule.message, `${label}.message`)
  if (!allowedFigmaEmailGateRuleTypes.has(rule.type)) throw new Error(`${label} has unknown rule type ${rule.type}`)
  switch (rule.type) {
    case "forbidden-css-pattern": {
      assertGateRegex(rule.pattern, `${label}.pattern`)
      break
    }
    case "required-css-signature": {
      assertStringArray(rule.patterns, `${label}.patterns`)
      for (const [index, pattern] of rule.patterns.entries()) assertGateRegex(pattern, `${label}.patterns[${index}]`)
      break
    }
    case "required-class-mapping": {
      if (!Array.isArray(rule.mappings) || rule.mappings.length === 0) throw new Error(`${label}.mappings must be a non-empty array`)
      for (const [index, mapping] of rule.mappings.entries()) {
        if (!mapping || (mapping.target !== "surface" && mapping.target !== "text")) {
          throw new Error(`${label}.mappings[${index}].target must be "surface" or "text"`)
        }
        assertGateRegex(mapping.colorPattern, `${label}.mappings[${index}].colorPattern`)
        requiredString(mapping.requiredClass, `${label}.mappings[${index}].requiredClass`)
      }
      break
    }
    case "anchor-attribute-policy": {
      assertStringArray(rule.requiredAttributes, `${label}.requiredAttributes`)
      if (rule.requireTargetBlankOnWebLinks !== undefined && typeof rule.requireTargetBlankOnWebLinks !== "boolean") {
        throw new Error(`${label}.requireTargetBlankOnWebLinks must be a boolean`)
      }
      break
    }
    case "link-scheme-policy": {
      assertStringArray(rule.schemes, `${label}.schemes`)
      if (!Array.isArray(rule.requiredAttributeValues) || rule.requiredAttributeValues.length === 0) {
        throw new Error(`${label}.requiredAttributeValues must be a non-empty array`)
      }
      for (const [index, requirement] of rule.requiredAttributeValues.entries()) {
        requiredString(requirement?.attribute, `${label}.requiredAttributeValues[${index}].attribute`)
        requiredString(requirement?.value, `${label}.requiredAttributeValues[${index}].value`)
      }
      break
    }
    case "url-query-policy": {
      assertGateRegex(rule.hrefPattern, `${label}.hrefPattern`)
      assertGateRegex(rule.requiredQueryPattern, `${label}.requiredQueryPattern`)
      if (rule.duplicateQueryPattern !== undefined) assertGateRegex(rule.duplicateQueryPattern, `${label}.duplicateQueryPattern`)
      break
    }
    case "phone-tracking-policy": {
      assertGateRegex(rule.phonePattern, `${label}.phonePattern`)
      assertStringArray(rule.requiredSignatures, `${label}.requiredSignatures`)
      for (const [index, pattern] of rule.requiredSignatures.entries()) assertGateRegex(pattern, `${label}.requiredSignatures[${index}]`)
      if (rule.stripPatterns !== undefined) {
        assertStringArray(rule.stripPatterns, `${label}.stripPatterns`)
        for (const [index, pattern] of rule.stripPatterns.entries()) assertGateRegex(pattern, `${label}.stripPatterns[${index}]`)
      }
      break
    }
    case "content-marker-leakage": {
      if (!Array.isArray(rule.markers) || rule.markers.length === 0) throw new Error(`${label}.markers must be a non-empty array`)
      for (const marker of rule.markers) {
        if (typeof marker !== "string" || marker.trim().length < 4) {
          throw new Error(`${label} has a marker shorter than 4 characters`)
        }
      }
      break
    }
    case "forbidden-tag": {
      assertStringArray(rule.tags, `${label}.tags`)
      for (const [index, tag] of rule.tags.entries()) assertTagName(tag, `${label}.tags[${index}]`)
      break
    }
    case "forbidden-css-feature": {
      if (!Array.isArray(rule.features) || rule.features.length === 0) throw new Error(`${label}.features must be a non-empty array`)
      for (const [index, feature] of rule.features.entries()) {
        requiredString(feature?.label, `${label}.features[${index}].label`)
        assertGateRegex(feature?.pattern, `${label}.features[${index}].pattern`)
      }
      break
    }
    case "required-tag-attributes": {
      assertTagName(rule.tag, `${label}.tag`)
      assertStringArray(rule.attributePatterns, `${label}.attributePatterns`)
      for (const [index, pattern] of rule.attributePatterns.entries()) assertGateRegex(pattern, `${label}.attributePatterns[${index}]`)
      break
    }
    case "forbidden-inline-style-property": {
      assertTagName(rule.tag, `${label}.tag`)
      assertGateRegex(rule.propertyPattern, `${label}.propertyPattern`)
      break
    }
    case "conditional-required-pattern": {
      assertGateRegex(rule.whenPattern, `${label}.whenPattern`)
      assertStringArray(rule.requiredPatterns, `${label}.requiredPatterns`)
      for (const [index, pattern] of rule.requiredPatterns.entries()) assertGateRegex(pattern, `${label}.requiredPatterns[${index}]`)
      break
    }
    case "content-cell-height-policy": {
      if (rule.heightClassPattern !== undefined) assertGateRegex(rule.heightClassPattern, `${label}.heightClassPattern`)
      break
    }
    case "text-only-cell-width-policy": {
      break
    }
  }
}

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
  // figma/skeleton.html is OPTIONAL. Personas may instead instruct the model to build
  // from their approved master-template boilerplate via figma/prompt-rules.json; the
  // extension seeds a generic fallback skeleton when no packaged skeleton exists.
  const skeletonFile = byPath.get("figma/skeleton.html")
  if (skeletonFile) {
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
    if (parsed.schemaVersion !== 3 || parsed.kind !== "figma-email-html-gate") {
      throw new Error(`${label}.${file.path} has an unsupported validator schema; schemaVersion 3 is required`)
    }
    if (parsed.validators !== undefined) {
      throw new Error(`${label}.${file.path} declares a legacy validators array; schemaVersion 3 is fully rule-driven`)
    }
    if (parsed.sampleLeakageMarkers !== undefined) {
      throw new Error(`${label}.${file.path} declares legacy sampleLeakageMarkers; use a content-marker-leakage rule`)
    }
    const declaredRules = parsed.rules ?? []
    if (!Array.isArray(declaredRules) || declaredRules.length === 0) {
      throw new Error(`${label}.${file.path} must declare a non-empty rules array`)
    }
    assertNoDuplicate(declaredRules.map((rule) => rule?.id), `${label}.${file.path} rule id`)
    for (const [index, rule] of declaredRules.entries()) {
      validateGateRule(rule, `${label}.${file.path}.rules[${index}]`)
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

// Per-category root manifests: each must carry its own id and only its own catalog URL,
// and that catalog URL must match the legacy root manifest's corresponding entry.
const categoryManifestChecks = [
  { file: "marketplace-personas.json", id: "official-mavecode-personas", name: "MaveCode-MarketPlace Personas", urlField: "personasCatalogUrl" },
  { file: "marketplace-skills.json", id: "official-mavecode-skills", name: "MaveCode-MarketPlace Skills", urlField: "skillsCatalogUrl" },
  { file: "marketplace-mcps.json", id: "official-mavecode-mcps", name: "MaveCode-MarketPlace MCPs", urlField: "mcpsCatalogUrl" },
]
const allCatalogUrlFields = ["personasCatalogUrl", "skillsCatalogUrl", "mcpsCatalogUrl"]
for (const check of categoryManifestChecks) {
  const manifest = await verifySignedDocument(check.file)
  if (manifest.schemaVersion !== 1) throw new Error(`${check.file} must declare schemaVersion 1`)
  if (manifest.id !== check.id) throw new Error(`${check.file} id must be ${check.id}`)
  if (manifest.name !== check.name) throw new Error(`${check.file} name changed`)
  if (typeof manifest.publishedAt !== "string" || manifest.publishedAt.length === 0) {
    throw new Error(`${check.file} must declare publishedAt`)
  }
  if (typeof manifest[check.urlField] !== "string" || manifest[check.urlField].length === 0) {
    throw new Error(`${check.file} must declare ${check.urlField}`)
  }
  if (manifest[check.urlField] !== marketplace[check.urlField]) {
    throw new Error(`${check.file} ${check.urlField} does not match marketplace.json`)
  }
  for (const field of allCatalogUrlFields) {
    if (field !== check.urlField && manifest[field] !== undefined) {
      throw new Error(`${check.file} must not declare ${field}`)
    }
  }
}

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

if (marketplace.skillsCatalogUrl) {
  const skillsCatalog = await verifySignedDocument(marketplace.skillsCatalogUrl)
  assertNoDuplicate(skillsCatalog.items.map((item) => item.id), "skill id")
  for (const [index, item] of skillsCatalog.items.entries()) {
    const label = `skills.items[${index}]`
    if (item.type !== "skill") throw new Error(`${label} must have type "skill"`)
    for (const field of ["id", "name", "description", "version", "packageUrl", "sha256", "signingKeyId", "minimumMaveCodeVersion"]) {
      if (typeof item[field] !== "string" || item[field].length === 0) throw new Error(`${label}.${field} must be a non-empty string`)
    }
    if (!/^[a-f0-9]{64}$/.test(item.sha256)) throw new Error(`${label}.sha256 must be a 64-character hex digest`)
    if (!Number.isInteger(item.packageSize) || item.packageSize <= 0) throw new Error(`${label}.packageSize must be a positive integer`)
    const bytes = await readFile(item.packageUrl)
    if (bytes.length !== item.packageSize || sha256(bytes) !== item.sha256) {
      throw new Error(`${item.id} skill package digest/size does not match catalog`)
    }
    const skillPackage = await verifySignedDocument(item.packageUrl)
    if (skillPackage.id !== item.id || skillPackage.version !== item.version) {
      throw new Error(`${item.id} skill package identity does not match catalog`)
    }
    if (typeof skillPackage.instructions !== "string" || skillPackage.instructions.length === 0) {
      throw new Error(`${item.id} skill package must declare non-empty instructions`)
    }
  }
}
