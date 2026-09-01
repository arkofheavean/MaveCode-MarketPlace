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

const buildPersonaPackage = async (id, version, privateKeyPem) => {
  const personaRoot = path.join(root, "personas", id)
	const definition = await readFile(path.join(personaRoot, "persona.yaml"), "utf8")
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
  buildPersonaPackage("standard", "1.2.12", privateKeyPem),
  buildPersonaPackage("enphase", "1.3.10", privateKeyPem),
])

const personasCatalog = signDocument(
  {
    schemaVersion: 1,
    publishedAt: "2026-08-31T00:00:00.000Z",
    sourceCommit: "local-development-placeholder",
    items: [
      {
        id: "standard",
        name: "🧭 Standard",
        type: "persona",
        description: "Universal client-agnostic email development persona for any brand",
        version: "1.2.12",
        updatedAt: "2026-08-31T00:00:00.000Z",
        packageUrl: "personas/standard/package.mavepersona.json",
        sha256: standard.sha256,
        packageSize: standard.packageSize,
        signingKeyId: keyId,
        minimumMaveCodeVersion: "0.0.0",
        tags: ["email-development", "email-html", "responsive-email", "client-agnostic", "official"],
      },
      {
        id: "enphase",
        name: "⚡ Enphase",
        type: "persona",
        description: "Self-contained Enphase project engineering persona",
        version: "1.3.10",
        updatedAt: "2026-08-31T00:00:00.000Z",
        packageUrl: "personas/enphase/package.mavepersona.json",
        sha256: enphase.sha256,
        packageSize: enphase.packageSize,
        signingKeyId: keyId,
        minimumMaveCodeVersion: "0.0.0",
        tags: ["mavecode", "enphase", "email", "official"],
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
    publishedAt: "2026-08-31T00:00:00.000Z",
    sourceCommit: "local-development-placeholder",
    minimumMaveCodeVersion: "0.0.0",
    items: [],
    signingKeyId: keyId,
  },
  privateKeyPem,
)
await writeFile(path.join(root, "mcps", "mcps.json"), serialize(mcpCatalog))

const rootManifest = signDocument(
  {
    schemaVersion: 1,
    id: "official-mavecode",
    name: "MaveCode-MarketPlace",
    publisher: "MaveCode",
    publishedAt: "2026-08-31T00:00:00.000Z",
    personasCatalogUrl: "personas/personas.json",
    mcpsCatalogUrl: "mcps/mcps.json",
    signingKeyId: keyId,
  },
  privateKeyPem,
)
await writeFile(path.join(root, "marketplace.json"), serialize(rootManifest))

console.log({ standard, enphase })
