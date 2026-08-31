#!/usr/bin/env node
import { createHash } from "node:crypto"
import { readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const sha256 = (value) => createHash("sha256").update(value).digest("hex")

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

const buildPersonaPackage = async (id, version) => {
  const personaRoot = path.join(root, "personas", id)
	const definition = await readFile(path.join(personaRoot, "persona.yaml"), "utf8")
	const pkg = {
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
    signingKeyId: "mavecode-marketplace-2026-01",
    signature: "UNSIGNED_LOCAL_DEVELOPMENT_PLACEHOLDER"
  }
  const bytes = Buffer.from(`${JSON.stringify(pkg, null, 2)}\n`)
  await writeFile(path.join(personaRoot, "package.mavepersona.json"), bytes)
  return { id, sha256: sha256(bytes), packageSize: bytes.length }
}

console.log(await Promise.all([buildPersonaPackage("standard", "1.2.12"), buildPersonaPackage("enphase", "1.3.10")]))
