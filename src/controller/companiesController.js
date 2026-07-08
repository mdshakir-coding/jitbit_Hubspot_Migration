import logger from "../utils/logger.js";
import { getCompanies } from "../service/jitbit.services.js";

async function syncCompanies() {
  try {
    const companies = await getCompanies();

    logger.info(`[Companies] Company Record:: ${JSON.stringify(companies, null, 2)}`);
  } catch (error) {
    logger.error("Error during cron job execution:", error);
  }
}
export { syncCompanies };