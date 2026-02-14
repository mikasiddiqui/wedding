import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

const loadEnvFile = (filename) => {
  const envPath = path.join(ROOT, filename)
  if (!fs.existsSync(envPath)) return {}
  const raw = fs.readFileSync(envPath, "utf8")
  return raw
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .reduce((acc, line) => {
      const index = line.indexOf("=")
      if (index === -1) return acc
      const key = line.slice(0, index).trim()
      const value = line.slice(index + 1).trim()
      acc[key] = value.replace(/^"|"$/g, "")
      return acc
    }, {})
}

const env = {
  ...loadEnvFile(".env.local"),
  ...loadEnvFile(".env.production"),
  ...process.env,
}

const API_KEY = env.SMTP2GO_API_KEY
const TEMPLATE_ID = env.SMTP2GO_TEMPLATE_ID
const FROM = env.SMTP2GO_FROM
const REPLY_TO = env.SMTP2GO_REPLY_TO || env.SMTP2GO_FROM
const FROM_NAME = env.SMTP2GO_FROM_NAME || "Mika & Darshika"
const BASE_URL = env.INVITE_BASE_URL || "https://mikadarshika.com"
const DRY_RUN = env.DRY_RUN === "true"

if (!API_KEY || !TEMPLATE_ID || !FROM) {
  console.error(
    "Missing required env vars: SMTP2GO_API_KEY, SMTP2GO_TEMPLATE_ID, SMTP2GO_FROM."
  )
  process.exit(1)
}

const invitesPath = path.join(ROOT, "app", "data", "invites.json")
const invites = JSON.parse(fs.readFileSync(invitesPath, "utf8"))

const emails = []
const seen = new Set()

Object.entries(invites).forEach(([inviteId, invite]) => {
  const title = invite?.title || ""
  const people = Array.isArray(invite?.people) ? invite.people : []
  people.forEach((person) => {
    const email = (person?.email || "").trim()
    if (!email) return
    const key = `${email.toLowerCase()}::${inviteId}`
    if (seen.has(key)) return
    seen.add(key)
    emails.push({
      inviteId,
      title,
      name: person?.name || title || "Guest",
      email,
    })
  })
})

if (emails.length === 0) {
  console.log("No emails found in invites.json.")
  process.exit(0)
}

const sendEmail = async ({ inviteId, title, name, email }) => {
  const inviteLink = `${BASE_URL}/?invite=${encodeURIComponent(inviteId)}`

  const payload = {
    api_key: API_KEY,
    to: [`${name} <${email}>`],
    sender: `${FROM_NAME} <${FROM}>`,
    template_id: TEMPLATE_ID,
    template_data: {
      title,
      inviteID: inviteId,
      inviteLink,
    },
    custom_headers: [
      {
        header: "Reply-To",
        value: `${FROM_NAME} <${REPLY_TO}>`,
      },
    ],
  }

  if (DRY_RUN) {
    console.log("[DRY RUN]", payload)
    return
  }

  const response = await fetch("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`SMTP2GO error ${response.status}: ${text}`)
  }
  return JSON.parse(text)
}

const run = async () => {
  console.log(`Found ${emails.length} email(s) to send.`)
  let success = 0
  let failed = 0

  for (const entry of emails) {
    try {
      await sendEmail(entry)
      success += 1
      console.log(`Sent to ${entry.email} (${entry.inviteId})`)
    } catch (err) {
      failed += 1
      console.error(`Failed ${entry.email} (${entry.inviteId}):`, err?.message || err)
    }
  }

  console.log(`Done. Success: ${success}, Failed: ${failed}.`)
}

run()
