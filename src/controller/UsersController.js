import logger from "../utils/logger.js";
import { getUsers } from "../service/jitbit.services.js";
import { getCompanies } from "../service/jitbit.services.js";
import{buildHubspotContactPayload} from "../utils/user.Payload.js";



async function syncUsers() {
  try {
    const allUsers = await getUsers();

    if (!allUsers || allUsers.length === 0) {
      logger.info("No users found.");
      return;
    }

    const user = allUsers[1]; // Sirf first user

    logger.info(`[Users] User Record:: ${JSON.stringify(user, null, 2)}`);

    const hubspotUser = buildHubspotContactPayload(user);

    logger.info(
      `[HubSpot Payload]:: ${JSON.stringify(hubspotUser, null, 2)}`
    );

    // await createHubSpotContact(hubspotUser);

  } catch (error) {
    logger.error(`Error during user sync: ${error.message}`);
  }
}

export { syncUsers };

