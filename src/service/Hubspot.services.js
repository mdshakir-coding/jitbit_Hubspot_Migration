import axios from "axios";
import logger from "../utils/logger.js";

const HUBSPOT_BASE_URL = "https://api.hubapi.com";

const hubspotHeaders = {
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
};

/**
 * Create HubSpot Contact
 */
async function createHubSpotContact(payload) {
  try {
    const response = await axios.post(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`,
      payload,
      hubspotHeaders,
    );

    logger.info(`HubSpot Contact Created: ${response.data.id}`);

    return response.data;
  } catch (error) {
    logger.error(
      `Create Contact Error: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );

    throw error;
  }
}

/**
 * Create HubSpot Company
 */
async function createHubSpotCompany(payload) {
  try {
    const response = await axios.post(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/companies`,
      payload,
      hubspotHeaders,
    );

    logger.info(`HubSpot Company Created: ${response.data.id}`);

    return response.data;
  } catch (error) {
    logger.error(
      `Create Company Error: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );

    throw error;
  }
}

/**
 * Associate Contact with Company
 */
async function associateContactCompany(contactId, companyId) {
  try {
    const response = await axios.put(
      `${HUBSPOT_BASE_URL}/crm/v4/objects/contacts/${contactId}/associations/companies/${companyId}`,

      {},

      hubspotHeaders,
    );

    logger.info(`Contact ${contactId} associated with Company ${companyId}`);

    return response.data;
  } catch (error) {
    logger.error(
      `Association Error: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );

    throw error;
  }
}

export { createHubSpotContact, createHubSpotCompany, associateContactCompany };
