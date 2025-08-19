enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta })
    };

    if (this.isDevelopment) {
      console.log(`[${timestamp}] [${level}] ${message}`, meta || '');
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  error(message: string, error?: Error | any) {
    const meta = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;
    this.log(LogLevel.ERROR, message, meta);
  }

  warn(message: string, meta?: any) {
    this.log(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: any) {
    this.log(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta?: any) {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, meta);
    }
  }
}

export const logger = new Logger();