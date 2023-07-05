import winston from "winston";
import { productionLogger } from "./productionLogger";
import { developmentLogger } from "./developmentLogger";
import { testLogger } from "./testLogger";

let logger: winston.Logger | null = null;

switch (process.env.NODE_ENV) {
  case "production":
    logger = productionLogger();
    break;
  case "test":
    logger = testLogger();
    break;
  default:
    logger = developmentLogger();
}

export default logger as winston.Logger;
