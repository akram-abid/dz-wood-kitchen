import { dbDrizzle as db } from "../src/database/db";
import { users } from "../src/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import "dotenv/config";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASS;
  const fullName = process.env.ADMIN_FULLNAME || "Admin User";

  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASS in .env");
  }

  // Check if admin already exists
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existing) {
    console.log(`Admin already exists (${email}), skipping.`);
    return;
  }

  // Hash the password
  const hashed = await bcrypt.hash(password, 10);

  // Insert the admin user
  await db.insert(users).values({
    email,
    password: hashed,
    fullName,
    role: "admin",
    isEmailVerified: true,
  });

  console.log(`Admin seeded successfully (${email})`);
}

async function main() {
  try {
    await seedAdmin();
    console.log("Seeding completed.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

main();
