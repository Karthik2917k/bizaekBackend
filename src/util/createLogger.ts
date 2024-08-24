import morgan from 'morgan';
import logger from '../logger/logger';

interface LoggerStream {
  write: (message: string) => void;
}

// Extend the logger to include the stream property
const stream: LoggerStream = {
  write: (message: string) => {
    // Trim the message to remove extra newline characters at the end
    const trimmedMessage = message.trim();
    logger.info(`\n**********************REQUEST_STARTED*********************\n${trimmedMessage}`);
  }
};

export default morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream }
);
