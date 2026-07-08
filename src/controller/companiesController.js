import logger from "../utils/logger.js";
import { getCompanies } from "../service/jitbit.services.js";
import{buildHubspotCompanyPayload} from "../utils/user.Payload.js";


async function syncCompanies() {
  try {
    const allCompanies = await getCompanies();

    if (!allCompanies || allCompanies.length === 0) {
      logger.info("No companies found.");
      return;
    }

    const company = allCompanies[1]; // Sirf first company
    logger.info(`[Companies] Company Record:: ${JSON.stringify(company, null, 2)}`);

    const hubspotCompany = buildHubspotCompanyPayload(company);

    logger.info(
      `[HubSpot Payload]:: ${JSON.stringify(hubspotCompany, null, 2)}`
    );


  } catch (error) {
    logger.error(`Error during user sync: ${error.message}`);
  }
}

export { syncCompanies };
