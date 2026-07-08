// import logger from "../utils/logger.js";
// import { getUsers } from "../service/jitbit.services.js";
// import { getCompanies } from "../service/jitbit.services.js";
// import{buildHubspotContactPayload} from "../utils/All.Payload.js";

// async function syncUsers() {
//   try {
//     const allUsers = await getUsers();

//     if (!allUsers || allUsers.length === 0) {
//       logger.info("No users found.");
//       return;
//     }

//     const user = allUsers[1]; // Sirf first user

//     logger.info(`[Users] User Record:: ${JSON.stringify(user, null, 2)}`);

//     const hubspotUser = buildHubspotContactPayload(user);

//     logger.info(
//       `[HubSpot Payload]:: ${JSON.stringify(hubspotUser, null, 2)}`
//     );

//     // await createHubSpotContact(hubspotUser);

//   } catch (error) {
//     logger.error(`Error during user sync: ${error.message}`);
//   }
// }

// export { syncUsers };

import logger from "../utils/logger.js";

import { getUsers, getCompanies } from "../service/jitbit.services.js";

import {
  buildHubspotContactPayload,
  buildHubspotCompanyPayload,
} from "../utils/All.Payload.js";

import {
  createHubSpotContact,
  createHubSpotCompany,
  associateContactCompany,
} from "../service/Hubspot.services.js";

async function syncUsers() {
  try {
    // 1. Fetch Users from Jitbit
    const allUsers = await getUsers();

    if (!allUsers || allUsers.length === 0) {
      logger.info("No users found.");
      return;
    }

    // 2. Fetch Companies from Jitbit
    const allCompanies = await getCompanies();

    logger.info(`Total Companies fetched: ${allCompanies.length}`);

    // Testing only one user
    const user = allUsers[1];

    logger.info(`[Users] User Record:: ${JSON.stringify(user, null, 2)}`);

    // 3. Find User Related Company
    const jitbitCompany = allCompanies.find(
      (company) => Number(company.CompanyID) === Number(user.CompanyId),
    );

    if (!jitbitCompany) {
      logger.warn(`Company not found for User CompanyId: ${user.CompanyId}`);

      return;
    }

    logger.info(
      `[Jitbit Company Found] ${JSON.stringify(jitbitCompany, null, 2)}`,
    );

    // 4. Build HubSpot Company Payload
    const companyPayload = buildHubspotCompanyPayload(jitbitCompany);

    logger.info(
      `[HubSpot Company Payload]:: ${JSON.stringify(companyPayload, null, 2)}`,
    );

    // 5. Create HubSpot Company
    const hubspotCompany = await createHubSpotCompany(companyPayload);

    logger.info(`[HubSpot Company Created] ID: ${hubspotCompany.id}`);

    // 6. Build HubSpot Contact Payload
    const contactPayload = buildHubspotContactPayload(user);

    logger.info(
      `[HubSpot Contact Payload]:: ${JSON.stringify(contactPayload, null, 2)}`,
    );

    // 7. Create HubSpot Contact
    const hubspotContact = await createHubSpotContact(contactPayload);

    logger.info(`[HubSpot Contact Created] ID: ${hubspotContact.id}`);

    // 8. Associate Contact with Company
    await associateContactCompany(hubspotContact.id, hubspotCompany.id);

    logger.info(
      `✅ Contact ${hubspotContact.id} associated with Company ${hubspotCompany.id}`,
    );
  } catch (error) {
    logger.error(
      `Error during user sync: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );
  }
}

export { syncUsers };
