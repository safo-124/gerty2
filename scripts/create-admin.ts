import "dotenv/config"
import bcrypt from "bcryptjs"
import prisma from "../lib/prisma"

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env")
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: {
      email,
      name: "Administrator",
      role: "ADMIN",
      passwordHash,
    },
  })

  console.log("✅ Admin user ensured:", { id: user.id, email: user.email, role: user.role })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
