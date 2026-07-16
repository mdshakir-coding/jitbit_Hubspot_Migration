

import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import logger from "../utils/logger.js";
import { getUsers } from "./jitbit.services.js";

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_TOKEN,
});

async function findCompanyInHubSpot(companyName) {
  try {
    const response = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: companyName }] }],
      properties: ["name"]
    });
    return response.results.length > 0 ? response.results[0].id : null;
  } catch (e) {
    return null;
  }
}

async function runSync() {
  logger.info("🚀 Starting Final Targeted Sync...");
  const users = await getUsers();
  const targetUser = users.find(u => u.Email === "mrethical006+1@gmail.com");

  if (!targetUser) return;

  try {
    const hsCompanyId = await findCompanyInHubSpot(targetUser.CompanyName || "Test");
    if (!hsCompanyId) {
      logger.warn(`⚠️ Company "${targetUser.CompanyName}" Not Find Company In HubSpot.`);
      return;
    }

  const properties = {
  // Basic Information
  firstname: targetUser.FirstName,
  lastname: targetUser.LastName,
  email: targetUser.Email,
  phone: targetUser.Phone,
  company: targetUser.CompanyName,
  city: targetUser.Location,

  // Custom Properties
  full_name: targetUser.FullName,
  client_id__sender_id_: String(targetUser.UserID ),
  associatedcompanyid:
    targetUser.CompanyID != null
      ? String(targetUser.CompanyID)
      : null,
};

    // 1. Contact Create/Update
    const existing = await hubspotClient.crm.contacts.searchApi.doSearch({
      filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: targetUser.Email }] }],
      properties: ["email"]
    });

    let contactId;
    if (existing.results.length > 0) {
      contactId = existing.results[0].id;
      await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
      logger.info(`🔄 Updated contact: ${contactId}`);
    } else {
      const newContact = await hubspotClient.crm.contacts.basicApi.create({ properties });
      contactId = newContact.id;
      logger.info(`✅ Created contact: ${contactId}`);
    }

    // 2. Association (v4 API - Sabse stable tarika)
    await hubspotClient.crm.associations.v4.basicApi.create("contact", contactId, "company", hsCompanyId, [
      { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }
    ]);
    
    logger.info(`🎉 Successfully Associated Contact ${contactId} with Company ${hsCompanyId}`);

  } catch (error) {
    logger.error(`❌ Sync Failed: ${error.message}`);
  }
}

runSync();