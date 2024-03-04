export enum LogLevel {
  INFO = '\x1b[36mINFO\x1b[0m',
  WARNING = '\x1b[33mWARNING\x1b[0m',
  ERROR = '\x1b[31mERROR\x1b[0m',
}

export const logMessage = (
  message: string,
  level: LogLevel = LogLevel.INFO
): void => {
  const timestamp = new Date().toISOString();

  return console.log(`\n${timestamp} - ${level}: ${message}\n`);
};
