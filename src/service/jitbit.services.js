

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
      }
    );

    logger.info(`Successfully fetched ${response.data?.length || 0} companies.`);
    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch companies: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message 
      }`
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
      }
    );

    logger.info(`Successfully fetched ${response.data?.length || 0} users.`);
    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch users: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`
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
      }
    );

    logger.info(`Successfully fetched ${response.data?.length || 0} tickets.`);
    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch tickets: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`
    );
    throw error;
  }
};



export { getCompanies, getUsers,
     getTickets, };