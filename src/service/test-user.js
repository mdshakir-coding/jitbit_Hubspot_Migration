

// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";
// import { getUsers } from "./jitbit.services.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// async function findCompanyInHubSpot(companyName) {
//   try {
//     const response = await hubspotClient.crm.companies.searchApi.doSearch({
//       filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: companyName }] }],
//       properties: ["name"]
//     });
//     return response.results.length > 0 ? response.results[0].id : null;
//   } catch (e) {
//     return null;
//   }
// }

// async function runSync() {
//   logger.info("🚀 Starting Final Targeted Sync...");
//   const users = await getUsers();
//   const targetUser = users.find(u => u.Email === "mrethical006+1@gmail.com");

//   if (!targetUser) return;

//   try {
//     const hsCompanyId = await findCompanyInHubSpot(targetUser.CompanyName || "Test");
//     if (!hsCompanyId) {
//       logger.warn(`⚠️ Company "${targetUser.CompanyName}" Not Find Company In HubSpot.`);
//       return;
//     }

//   const properties = {
//   // Basic Information
//   firstname: targetUser.FirstName,
//   lastname: targetUser.LastName,
//   email: targetUser.Email,
//   phone: targetUser.Phone,
//   company: targetUser.CompanyName,
//   city: targetUser.Location,

//   // Custom Properties
//   full_name: targetUser.FullName,
//   client_id__sender_id_: String(targetUser.UserID ),
//   associatedcompanyid:
//     targetUser.CompanyID != null
//       ? String(targetUser.CompanyID)
//       : null,
// };

//     // 1. Contact Create/Update
//     const existing = await hubspotClient.crm.contacts.searchApi.doSearch({
//       filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: targetUser.Email }] }],
//       properties: ["email"]
//     });

//     let contactId;
//     if (existing.results.length > 0) {
//       contactId = existing.results[0].id;
//       await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
//       logger.info(`🔄 Updated contact: ${contactId}`);
//     } else {
//       const newContact = await hubspotClient.crm.contacts.basicApi.create({ properties });
//       contactId = newContact.id;
//       logger.info(`✅ Created contact: ${contactId}`);
//     }

//     // 2. Association (v4 API - Sabse stable tarika)
//     await hubspotClient.crm.associations.v4.basicApi.create("contact", contactId, "company", hsCompanyId, [
//       { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }
//     ]);
    
//     logger.info(`🎉 Successfully Associated Contact ${contactId} with Company ${hsCompanyId}`);

//   } catch (error) {
//     logger.error(`❌ Sync Failed: ${error.message}`);
//   }
// }

// runSync();




// ...............................New Code //...............................................



// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";
// import { getUsers } from "./jitbit.services.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// async function findCompanyInHubSpot(companyName) {
//   // Added safety check: Skip search if companyName is blank or undefined
//   if (!companyName) return null;

//   try {
//     const response = await hubspotClient.crm.companies.searchApi.doSearch({
//       filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: companyName }] }],
//       properties: ["name"]
//     });
//     return response.results.length > 0 ? response.results[0].id : null;
//   } catch (e) {
//     logger.error(`Error searching for company "${companyName}": ${e.message}`);
//     return null;
//   }
// }

// async function runSync() {
//   logger.info("🚀 Starting Full Sync: Jitbit to HubSpot...");
//   const users = await getUsers();
  
//   if (!users || users.length === 0) {
//     logger.warn("⚠️ No users fetched from Jitbit.");
//     return;
//   }
  
//   logger.info(`✅ Fetched ${users.length} users. Processing started...`);

//   // Loop through all users fetched from Jitbit
//   for (const targetUser of users) {
//     // Skip if email is missing to prevent HubSpot API errors
//     if (!targetUser.Email) {
//       logger.warn(`⚠️ Skipping user ID ${targetUser.UserID} because Email is missing.`);
//       continue; 
//     }

//     try {
//       // Removed the || "Test" fallback. It now uses the actual CompanyName from Jitbit.
//       const hsCompanyId = await findCompanyInHubSpot(targetUser.CompanyName);
      
//       // If company not found, log warning and skip to next user
//       if (!hsCompanyId) {
//         logger.warn(`⚠️ Company "${targetUser.CompanyName || 'Unknown'}" Not Found In HubSpot for ${targetUser.Email}. Skipping contact creation.`);
//         continue; 
//       }

//       const properties = {
//         // Basic Information
//         firstname: targetUser.FirstName,
//         lastname: targetUser.LastName,
//         email: targetUser.Email,
//         phone: targetUser.Phone,
//         company: targetUser.CompanyName,
//         city: targetUser.Location,

//         // Custom Properties
//         full_name: targetUser.FullName,
//         client_id__sender_id_: String(targetUser.UserID),
//         associatedcompanyid:
//           targetUser.CompanyID != null
//             ? String(targetUser.CompanyID)
//             : null,
//       };

//       // 1. Contact Create/Update
//       const existing = await hubspotClient.crm.contacts.searchApi.doSearch({
//         filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: targetUser.Email }] }],
//         properties: ["email"]
//       });

//       let contactId;
//       if (existing.results.length > 0) {
//         contactId = existing.results[0].id;
//         await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
//         logger.info(`🔄 Updated contact: ${targetUser.Email} (${contactId})`);
//       } else {
//         const newContact = await hubspotClient.crm.contacts.basicApi.create({ properties });
//         contactId = newContact.id;
//         logger.info(`✅ Created contact: ${targetUser.Email} (${contactId})`);
//       }

//       // 2. Association (v4 API - Sabse stable tarika)
//       await hubspotClient.crm.associations.v4.basicApi.create("contact", contactId, "company", hsCompanyId, [
//         { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }
//       ]);
      
//       logger.info(`🎉 Successfully Associated Contact ${contactId} with Company ${hsCompanyId}`);

//     } catch (error) {
//       // Catch error for specific user but continue the loop
//       logger.error(`❌ Sync Failed for ${targetUser.Email}: ${error.message}`);
//     }
//   }

//   logger.info("🏁 Full Sync Completed Successfully!");
// }

// runSync();



import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import logger from "../utils/logger.js";
import { getUsers } from "./jitbit.services.js";

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_TOKEN,
});

async function findCompanyInHubSpot(companyName) {
  if (!companyName) return null;

  try {
    const response = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: companyName.trim() }] }],
      properties: ["name"]
    });
    return response.results.length > 0 ? response.results[0].id : null;
  } catch (e) {
    logger.error(`Error searching for company "${companyName}": ${e.message}`);
    return null;
  }
}

async function createBasicCompanyInHubSpot(companyName) {
  try {
    const response = await hubspotClient.crm.companies.basicApi.create({
      properties: { name: companyName.trim() }
    });
    return response.id;
  } catch (e) {
    logger.error(`Error creating company "${companyName}": ${e.message}`);
    return null;
  }
}

async function runSync() {
  logger.info("🚀 Starting Full Sync: Jitbit to HubSpot...");
  const users = await getUsers();
  
  if (!users || users.length === 0) {
    logger.warn("⚠️ No users fetched from Jitbit.");
    return;
  }
  
  logger.info(`✅ Fetched ${users.length} users. Processing started...`);

  for (const targetUser of users) {
    // 1. Trim the email right away to fix the HubSpot 400 error
    const userEmail = targetUser.Email ? targetUser.Email.trim() : null;

    if (!userEmail) {
      logger.warn(`⚠️ Skipping user ID ${targetUser.UserID} because Email is missing or empty.`);
      continue; 
    }

    try {
      let hsCompanyId = null;

      if (targetUser.CompanyName) {
        hsCompanyId = await findCompanyInHubSpot(targetUser.CompanyName);
        
        if (!hsCompanyId) {
          logger.info(`🏢 Company "${targetUser.CompanyName}" not found. Creating new company...`);
          hsCompanyId = await createBasicCompanyInHubSpot(targetUser.CompanyName);
        }
      } else {
        logger.info(`ℹ️ User ${userEmail} has no CompanyName. Proceeding to create/update contact only.`);
      }

      // 2. Apply trim() to other text fields to prevent similar validation errors
      const properties = {
        firstname: targetUser.FirstName ? targetUser.FirstName.trim() : "",
        lastname: targetUser.LastName ? targetUser.LastName.trim() : "",
        email: userEmail,
        phone: targetUser.Phone ? targetUser.Phone.trim() : "",
        city: targetUser.Location ? targetUser.Location.trim() : "",
        full_name: targetUser.FullName ? targetUser.FullName.trim() : "",
        client_id__sender_id_: String(targetUser.UserID),
      };

      if (targetUser.CompanyName) properties.company = targetUser.CompanyName.trim();
      if (targetUser.CompanyID != null) properties.associatedcompanyid = String(targetUser.CompanyID);

      const existing = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: userEmail }] }],
        properties: ["email"]
      });

      let contactId;
      if (existing.results.length > 0) {
        contactId = existing.results[0].id;
        await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
        logger.info(`🔄 Updated contact: ${userEmail} (${contactId})`);
      } else {
        const newContact = await hubspotClient.crm.contacts.basicApi.create({ properties });
        contactId = newContact.id;
        logger.info(`✅ Created contact: ${userEmail} (${contactId})`);
      }

      if (hsCompanyId) {
        await hubspotClient.crm.associations.v4.basicApi.create("contact", contactId, "company", hsCompanyId, [
          { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }
        ]);
        logger.info(`🎉 Successfully Associated Contact ${contactId} with Company ${hsCompanyId}`);
      }

    } catch (error) {
      logger.error(`❌ Sync Failed for ${userEmail}: ${error.message}`);
    }
  }

  logger.info("🏁 Full Sync Completed Successfully!");
}

runSync();