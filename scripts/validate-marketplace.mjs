#!/usr/bin/env node
import { createHash, createPublicKey, verify } from "node:crypto"
import { readFile } from "node:fs/promises"

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
await verifySignedDocument("mcps/mcps.json")

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
