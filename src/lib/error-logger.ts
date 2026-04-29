// Production error logging utility
export interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  userId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
}

class ErrorLogger {
  private isProduction = process.env.NODE_ENV === 'production';

  log(error: ErrorLog): void {
    if (this.isProduction) {
      // In production, send to your logging service
      // For now, we'll use structured console logging
      console.error(JSON.stringify(error));
    } else {
      // In development, use detailed logging
      console.error(`[${error.timestamp}] ${error.level.toUpperCase()}: ${error.message}`, {
        stack: error.stack,
        userId: error.userId,
        path: error.path,
        method: error.method,
        statusCode: error.statusCode,
      });
    }
  }

  logError(error: Error, context?: Partial<ErrorLog>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  logWarn(message: string, context?: Partial<ErrorLog>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      ...context,
    });
  }

  logInfo(message: string, context?: Partial<ErrorLog>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...context,
    });
  }
}

export const errorLogger = new ErrorLogger();
