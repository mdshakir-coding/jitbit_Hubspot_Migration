import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./app.js";
import logger from "./utils/logger.js";
import "./crons/cronShedular.js";



const PORT = process.env.PORT || 3800;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);


});
