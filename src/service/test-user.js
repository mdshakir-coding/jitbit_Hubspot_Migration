
// //...........................................New Code End................................................

// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";
// import { getUsers } from "./jitbit.services.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// async function findCompanyInHubSpot(companyName) {
//   if (!companyName) return null;

//   try {
//     const response = await hubspotClient.crm.companies.searchApi.doSearch({
//       filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: companyName.trim() }] }],
//       properties: ["name"]
//     });
//     return response.results.length > 0 ? response.results[0].id : null;
//   } catch (e) {
//     logger.error(`Error searching for company "${companyName}": ${e.message}`);
//     return null;
//   }
// }

// async function createBasicCompanyInHubSpot(companyName) {
//   try {
//     const response = await hubspotClient.crm.companies.basicApi.create({
//       properties: { name: companyName.trim() }
//     });
//     return response.id;
//   } catch (e) {
//     logger.error(`Error creating company "${companyName}": ${e.message}`);
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

//   for (const targetUser of users) {
//     // 1. Trim the email right away to fix the HubSpot 400 error
//     const userEmail = targetUser.Email ? targetUser.Email.trim() : null;

//     if (!userEmail) {
//       logger.warn(`⚠️ Skipping user ID ${targetUser.UserID} because Email is missing or empty.`);
//       continue; 
//     }

//     try {
//       let hsCompanyId = null;

//       if (targetUser.CompanyName) {
//         hsCompanyId = await findCompanyInHubSpot(targetUser.CompanyName);
        
//         if (!hsCompanyId) {
//           logger.info(`🏢 Company "${targetUser.CompanyName}" not found. Creating new company...`);
//           hsCompanyId = await createBasicCompanyInHubSpot(targetUser.CompanyName);
//         }
//       } else {
//         logger.info(`ℹ️ User ${userEmail} has no CompanyName. Proceeding to create/update contact only.`);
//       }

//       // 2. Apply trim() to other text fields to prevent similar validation errors
//       const properties = {
//         firstname: targetUser.FirstName ? targetUser.FirstName.trim() : "",
//         lastname: targetUser.LastName ? targetUser.LastName.trim() : "",
//         email: userEmail,
//         phone: targetUser.Phone ? targetUser.Phone.trim() : "",
//         city: targetUser.Location ? targetUser.Location.trim() : "",
//         full_name: targetUser.FullName ? targetUser.FullName.trim() : "",
//         client_id__sender_id_: String(targetUser.UserID),
//       };

//       if (targetUser.CompanyName) properties.company = targetUser.CompanyName.trim();
//       if (targetUser.CompanyID != null) properties.associatedcompanyid = String(targetUser.CompanyID);

//       const existing = await hubspotClient.crm.contacts.searchApi.doSearch({
//         filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: userEmail }] }],
//         properties: ["email"]
//       });

//       let contactId;
//       if (existing.results.length > 0) {
//         contactId = existing.results[0].id;
//         await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
//         logger.info(`🔄 Updated contact: ${userEmail} (${contactId})`);
//       } else {
//         const newContact = await hubspotClient.crm.contacts.basicApi.create({ properties });
//         contactId = newContact.id;
//         logger.info(`✅ Created contact: ${userEmail} (${contactId})`);
//       }

//       if (hsCompanyId) {
//         await hubspotClient.crm.associations.v4.basicApi.create("contact", contactId, "company", hsCompanyId, [
//           { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }
//         ]);
//         logger.info(`🎉 Successfully Associated Contact ${contactId} with Company ${hsCompanyId}`);
//       }

//     } catch (error) {
//       logger.error(`❌ Sync Failed for ${userEmail}: ${error.message}`);
//     }
//   }

//   logger.info("🏁 Full Sync Completed Successfully!");
// }

// runSync();




//...........................New Code...........................//
import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import logger from "../utils/logger.js";
import { getUsers } from "./jitbit.services.js";

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_TOKEN,
});

// ==========================================
// Search Company by Domain
// ==========================================
async function findCompanyByDomain(domain) {
  if (!domain) return null;

  try {
    const response = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [{ filters: [{ propertyName: "domain", operator: "EQ", value: domain.trim() }] }],
      properties: ["domain", "name"]
    });
    return response.results.length > 0 ? response.results[0].id : null;
  } catch (e) {
    logger.error(`Error searching for company by domain "${domain}": ${e.message}`);
    return null;
  }
}

// ==========================================
// Create Basic Company
// ==========================================
async function createBasicCompanyInHubSpot(companyName, domain) {
  try {
    const properties = {};
    if (companyName) properties.name = companyName.trim();
    if (domain) properties.domain = domain.trim();

    const response = await hubspotClient.crm.companies.basicApi.create({
      properties
    });
    return response.id;
  } catch (e) {
    logger.error(`Error creating company "${companyName}": ${e.message}`);
    return null;
  }
}

// ==========================================
// Sync Users / Contacts
// ==========================================
async function runSync() {
  logger.info("🚀 Starting Full Sync: Jitbit to HubSpot (Contacts & Companies)...");
  const users = await getUsers();
  
  if (!users || users.length === 0) {
    logger.warn("⚠️ No users fetched from Jitbit.");
    return;
  }
  
  logger.info(`✅ Fetched ${users.length} users. Processing started...`);

  for (const targetUser of users) {
    // 1. Trim the email right away
    const userEmail = targetUser.Email ? targetUser.Email.trim() : null;

    if (!userEmail) {
      logger.warn(`⚠️ Skipping user ID ${targetUser.UserID} because Email is missing or empty.`);
      continue; 
    }

    try {
      // ==========================================
      // Step A: Contact Check (Exit if Found)
      // ==========================================
      const existingContact = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: userEmail }] }],
        properties: ["email"]
      });

      if (existingContact.results.length > 0) {
        // As per instruction: "Contacts based on email address, if match found exit"
        logger.info(`⚠️ Contact already exists in HubSpot (Skipping/Exit). Email: ${userEmail}`);
        continue; // Skip the rest of the loop and move to the next user
      }


      // ==========================================
      // Step B: Company Domain Check & Create
      // ==========================================
      let hsCompanyId = null;
      
      // Extract domain from user's email if Jitbit didn't provide an EmailDomain explicitly
      const domain = targetUser.EmailDomain ? targetUser.EmailDomain.trim() : userEmail.split('@')[1];

      if (domain) {
        // As per instruction: "match company based on domain..."
        hsCompanyId = await findCompanyByDomain(domain);
        
        if (!hsCompanyId) {
          // As per instruction: "...if not found create a company"
          const compName = targetUser.CompanyName || domain; // Fallback to domain if name is empty
          logger.info(`🏢 Company with domain "${domain}" not found. Creating new company...`);
          hsCompanyId = await createBasicCompanyInHubSpot(compName, domain);
        }
      } else {
        logger.info(`ℹ️ Could not determine domain for ${userEmail}. Proceeding to create contact only.`);
      }

      // ==========================================
      // Step C: Create New Contact
      // ==========================================
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

      const newContact = await hubspotClient.crm.contacts.basicApi.create({ properties });
      const contactId = newContact.id;
      logger.info(`✅ Created contact: ${userEmail} (${contactId})`);


      // ==========================================
      // Step D: Associate Contact with Company
      // ==========================================
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