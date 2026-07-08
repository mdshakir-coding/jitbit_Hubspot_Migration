import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./app.js";
import logger from "./utils/logger.js";
import "./crons/cronShedular.js";


import { getCompanies, getTickets, getUsers } from "./service/jitbit.services.js";
import{syncUsers} from "./controller/UsersController.js";
import{syncCompanies} from "./controller/companiesController.js";
import{syncTickets} from "./controller/ticketsController.js";
const PORT = process.env.PORT || 3800;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);

  // syncUsers();
  // syncCompanies();
  syncTickets();

  


});
