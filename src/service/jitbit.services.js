import axios from "axios";
import logger from "../utils/logger.js";

const getCompanies = async () => {
  try {
    logger.info("Fetching companies from Jitbit...");

    const response = await axios.get(
      "https://healthipass.jitbit.com/helpdesk/api/Companies",
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
          Accept: "application/json",
        },
      },
    );

    logger.info(
      `Successfully fetched ${response.data?.length || 0} companies.`,
    );
    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch companies: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );
    throw error;
  }
};

const getUsers = async () => {
  try {
    logger.info("Fetching users from Jitbit...");

    const response = await axios.get(
      "https://healthipass.jitbit.com/helpdesk/api/Users",
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
          Accept: "application/json",
        },
      },
    );

    logger.info(`Successfully fetched ${response.data?.length || 0} users.`);
    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch users: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );
    throw error;
  }
};

const getTickets = async () => {
  try {
    logger.info("Fetching tickets from Jitbit...");

    const response = await axios.get(
      "https://healthipass.jitbit.com/helpdesk/api/Tickets",
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
          Accept: "application/json",
        },
      },
    );

    logger.info(`Successfully fetched ${response.data?.length || 0} tickets.`);
    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch tickets: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );
    throw error;
  }
};
async function searchCompanyById(companyId) {
  try {
    const response = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "company_id",
              operator: "EQ",
              value: companyId.toString(),
            },
          ],
        },
      ],

      properties: ["name", "company_id"],
    });

    return response.results[0] || null;
  } catch (error) {
    logger.error(error.message);
    return null;
  }
}


// ==========================================
// Fetch Jitbit Company Custom Fields
// ==========================================

 async function getCompanyCustomFields(companyId) {
  try {
    const response = await axios.get(
      `${process.env.JITBIT_URL}/api/CompanyCustomFields?id=${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
        },
      },
    );

    logger.info(`Fetched Custom Fields for Company ID: ${companyId}`);

    return response.data || [];
  } catch (error) {
    logger.error(`Failed to fetch company custom fields: ${companyId}`);

    logger.error(error.response?.data || error.message);

    return [];
  }
}
// ==========================================
// Fetch Jitbit Company Details
// ==========================================

 async function getCompanyDetails(companyId) {

  try {

    const response = await axios.get(
      `${process.env.JITBIT_URL}/api/Companies/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
        },
      }
    );


    logger.info(
      `Successfully fetched company details: ${companyId}`
    );


    return response.data || {};


  } catch(error) {


    logger.error(
      `Failed to fetch company details: ${companyId}`
    );


    logger.error(
      error.response?.data || error.message
    );


    return {};

  }

}

export {
  getCompanies,
  getUsers,
  getTickets,
  searchCompanyById,
  getCompanyCustomFields,
  getCompanyDetails,
};
