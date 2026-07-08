import logger from "../utils/logger.js";
import cron from "node-cron";


// cron.schedule("*/1 * * * * *", async () => {
//   logger.info("Cron job started: Syncing data with Pipedrive...");
//   try {
    
//     logger.info("Cron job completed successfully.");
//   } catch (error) {
//     logger.error("Error during cron job execution:", error);
//   }
// });

export  {cron};