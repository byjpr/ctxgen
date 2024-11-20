// logger.ts
import winston from "winston";

export interface Logger {
  info: (message: string) => void;
  error: (message: string, error: any) => void;
}

const logger: Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.cli()
  ),
  transports: [
    new winston.transports.Console()
    // new winston.transports.File({ filename: "error.log", level: "error" }),
    // new winston.transports.File({ filename: "combined.log" })
  ]
});

export default logger;
