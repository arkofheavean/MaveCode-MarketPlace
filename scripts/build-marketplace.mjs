#!/usr/bin/env node
import { createHash, generateKeyPairSync, sign } from "node:crypto"
import { readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const sha256 = (value) => createHash("sha256").update(value).digest("hex")
const keyId = "mavecode-marketplace-2026-01"

const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
  }
  return value
}

const canonical = (value) => JSON.stringify(stable(value))
const withoutSignature = ({ signature, ...value }) => value
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`
const publishedAt = "2026-09-01T00:00:00.000Z"

const loadSigningKey = async () => {
  const configured = process.env.MARKETPLACE_PRIVATE_KEY_PEM
  if (configured) return configured.replaceAll("\\n", "\n")

  const privateKeyPath = path.join(root, ".marketplace-signing-private.pem")
  try {
    return await readFile(privateKeyPath, "utf8")
  } catch {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519", {
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
      publicKeyEncoding: { type: "spki", format: "pem" },
    })
    await writeFile(privateKeyPath, privateKey)
    await writeFile(
      path.join(root, "keys", "public-keys.json"),
      serialize({ keys: [{ id: keyId, algorithm: "Ed25519", publicKeyPem: publicKey.trimEnd() }] }),
    )
    return privateKey
  }
}

const signDocument = (document, privateKeyPem) => ({
  ...document,
  signature: sign(null, Buffer.from(canonical(withoutSignature(document))), privateKeyPem).toString("base64"),
})

const readTextFiles = async (directory) => {
  const files = []
  for (const name of await readdir(directory).catch(() => [])) {
    const filePath = path.join(directory, name)
    files.push({ path: path.relative(path.dirname(directory), filePath).replaceAll(path.sep, "/"), content: await readFile(filePath, "utf8") })
  }
  return files
}

const readMcpItems = async () => {
  const itemsRoot = path.join(root, "mcps", "items")
  const directories = (await readdir(itemsRoot, { withFileTypes: true }).catch(() => []))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))
  const items = []
  for (const directory of directories) {
    const item = JSON.parse(await readFile(path.join(itemsRoot, directory, "mcp.json"), "utf8"))
    items.push({
      ...item,
      type: "mcp",
      version: item.version ?? "1.0.0",
      updatedAt: item.updatedAt ?? publishedAt,
    })
  }
  return items
}

const parseSimplePersonaYaml = (value) => {
  const definition = {}
  let currentKey
  for (const line of value.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue
    const listMatch = line.match(/^\s+-\s+(.+)$/)
    if (listMatch && currentKey) {
      definition[currentKey] = [...(Array.isArray(definition[currentKey]) ? definition[currentKey] : []), listMatch[1].trim()]
      continue
    }
    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!keyValueMatch) continue
    currentKey = keyValueMatch[1]
    const rawValue = keyValueMatch[2]
    definition[currentKey] = rawValue ? rawValue.trim().replace(/^['"]|['"]$/g, "") : []
  }
  return definition
}

const readFigmaCapability = (figmaFiles, id) => {
  const capabilityFile = figmaFiles.find((file) => file.path === "figma/capability.json")
  if (!capabilityFile) return false
  const capability = JSON.parse(capabilityFile.content)
  if (capability.schemaVersion !== 1 || capability.kind !== "figma-capability") {
    throw new Error(`${id} figma/capability.json has an unsupported schema`)
  }
  return capability.supportsFigma === true
}

const buildSkillPackage = async (id, privateKeyPem) => {
  const skillRoot = path.join(root, "skills", id)
  const definition = JSON.parse(await readFile(path.join(skillRoot, "skill.json"), "utf8"))
  const instructions = await readFile(path.join(skillRoot, "instructions.md"), "utf8")
  const unsignedPackage = {
    schemaVersion: 1,
    id,
    version: definition.version,
    name: definition.name,
    description: definition.description,
    instructions,
    ...(Array.isArray(definition.modeSlugs) && definition.modeSlugs.length > 0
      ? { modeSlugs: definition.modeSlugs }
      : {}),
    source: { repository: "https://github.com/arkofheavean/MaveCode-MarketPlace" },
    signingKeyId: keyId,
  }
  const pkg = signDocument(unsignedPackage, privateKeyPem)
  const bytes = Buffer.from(serialize(pkg))
  await writeFile(path.join(skillRoot, "package.maveskill.json"), bytes)
  return { definition, sha256: sha256(bytes), packageSize: bytes.length }
}

const readSkillDirectories = async () => {
  const skillsRoot = path.join(root, "skills")
  return (await readdir(skillsRoot, { withFileTypes: true }).catch(() => []))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))
}

const buildPersonaPackage = async (id, version, privateKeyPem) => {
  const personaRoot = path.join(root, "personas", id)
	const definition = await readFile(path.join(personaRoot, "persona.yaml"), "utf8")
  const figma = await readTextFiles(path.join(personaRoot, "figma"))
	const unsignedPackage = {
		schemaVersion: 1,
		id,
		version,
		definition: parseSimplePersonaYaml(definition),
    rules: await readTextFiles(path.join(personaRoot, "rules")),
    references: await readTextFiles(path.join(personaRoot, "references")),
    validators: await readTextFiles(path.join(personaRoot, "validators")),
    scripts: await readTextFiles(path.join(personaRoot, "scripts")),
    qa: await readTextFiles(path.join(personaRoot, "qa")),
    figma,
    supportsFigma: readFigmaCapability(figma, id),
    source: { repository: "https://github.com/arkofheavean/MaveCode-MarketPlace" },
    signingKeyId: keyId,
  }
  const pkg = signDocument(unsignedPackage, privateKeyPem)
  const bytes = Buffer.from(serialize(pkg))
  await writeFile(path.join(personaRoot, "package.mavepersona.json"), bytes)
  return { id, sha256: sha256(bytes), packageSize: bytes.length }
}

const privateKeyPem = await loadSigningKey()
const [standard, enphase] = await Promise.all([
  buildPersonaPackage("standard", "1.2.21", privateKeyPem),
  buildPersonaPackage("enphase", "1.3.20", privateKeyPem),
])

const personasCatalog = signDocument(
  {
    schemaVersion: 1,
    publishedAt,
    sourceCommit: "local-development-placeholder",
    items: [
      {
        id: "standard",
        name: "🧭 Standard Email-Dev",
        type: "persona",
        description: "Universal client-agnostic email development persona for any brand",
        version: "1.2.21",
        updatedAt: publishedAt,
        packageUrl: "personas/standard/package.mavepersona.json",
        sha256: standard.sha256,
        packageSize: standard.packageSize,
        signingKeyId: keyId,
        minimumMaveCodeVersion: "0.0.0",
        tags: ["Email-Dev"],
      },
      {
        id: "enphase",
        name: "⚡ Enphase Email-Dev",
        type: "persona",
        description: "Self-contained Enphase project engineering persona",
        version: "1.3.20",
        updatedAt: publishedAt,
        packageUrl: "personas/enphase/package.mavepersona.json",
        sha256: enphase.sha256,
        packageSize: enphase.packageSize,
        signingKeyId: keyId,
        minimumMaveCodeVersion: "0.0.0",
        tags: ["Email-Dev"],
      },
    ],
    signingKeyId: keyId,
  },
  privateKeyPem,
)
await writeFile(path.join(root, "personas", "personas.json"), serialize(personasCatalog))

const mcpCatalog = signDocument(
  {
    schemaVersion: 1,
    publishedAt,
    sourceCommit: "local-development-placeholder",
    minimumMaveCodeVersion: "0.0.0",
    items: await readMcpItems(),
    signingKeyId: keyId,
  },
  privateKeyPem,
)
await writeFile(path.join(root, "mcps", "mcps.json"), serialize(mcpCatalog))

const skillItems = []
for (const skillId of await readSkillDirectories()) {
  const built = await buildSkillPackage(skillId, privateKeyPem)
  skillItems.push({
    id: skillId,
    name: built.definition.name,
    type: "skill",
    description: built.definition.description,
    version: built.definition.version,
    updatedAt: publishedAt,
    packageUrl: `skills/${skillId}/package.maveskill.json`,
    sha256: built.sha256,
    packageSize: built.packageSize,
    signingKeyId: keyId,
    minimumMaveCodeVersion: "0.0.0",
    tags: built.definition.tags ?? [],
    ...(built.definition.placeholder === true ? { placeholder: true } : {}),
    ...(Array.isArray(built.definition.modeSlugs) && built.definition.modeSlugs.length > 0
      ? { modeSlugs: built.definition.modeSlugs }
      : {}),
  })
}

const skillsCatalog = signDocument(
  {
    schemaVersion: 1,
    publishedAt,
    sourceCommit: "local-development-placeholder",
    minimumMaveCodeVersion: "0.0.0",
    items: skillItems,
    signingKeyId: keyId,
  },
  privateKeyPem,
)
await writeFile(path.join(root, "skills", "skills.json"), serialize(skillsCatalog))

const rootManifest = signDocument(
  {
    schemaVersion: 1,
    id: "official-mavecode",
    name: "MaveCode-MarketPlace",
    publisher: "MaveCode",
    publishedAt,
    personasCatalogUrl: "personas/personas.json",
    mcpsCatalogUrl: "mcps/mcps.json",
    skillsCatalogUrl: "skills/skills.json",
    signingKeyId: keyId,
  },
  privateKeyPem,
)
await writeFile(path.join(root, "marketplace.json"), serialize(rootManifest))

console.log({ standard, enphase, skills: skillItems.map(({ id, version }) => ({ id, version })) })
