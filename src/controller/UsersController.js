import logger from "../utils/logger.js";
import { getUsers } from "../service/jitbit.services.js";

async function syncUsers() {
  try {
    const users = await getUsers();

    logger.info(`[Users] User Record:: ${JSON.stringify(users, null, 2)}`);
  } catch (error) {
    logger.error("Error during cron job execution:", error);
  }
}
export { syncUsers };