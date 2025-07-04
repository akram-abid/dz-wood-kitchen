import { eq, and, lt } from "drizzle-orm";
import { dbDrizzle as db } from "../database/db";
import { users } from "../database/schema";
import cron from "node-cron";

async function deleteUnverifiedOldUsers() {
  const now = new Date();
  const sevenHoursAgo = new Date(now.getTime() - 7 * 60 * 60 * 1000);

  await db
    .delete(users)
    .where(
      and(lt(users.createdAt, sevenHoursAgo), eq(users.isEmailVerified, false)),
    );

  console.log("Deleted unverified users older than 7 hours.");
}

//deleteUnverifiedOldUsers().catch(console.error);
//
//

cron.schedule("0 */7 * * *", async () => {
  console.log("Running cron job to delete old unverified users...");
  try {
    await deleteUnverifiedOldUsers();
  } catch (err) {
    console.error("Error in deleteUnverifiedOldUsers:", err);
  }
});
