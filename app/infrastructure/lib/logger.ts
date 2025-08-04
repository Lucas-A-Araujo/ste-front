export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatLogEntry(entry: Omit<LogEntry, 'timestamp'>): LogEntry {
    return {
      ...entry,
      timestamp: new Date().toISOString(),
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    if (this.isProduction) {
      return level === LogLevel.WARN || level === LogLevel.ERROR;
    }
    
    return true;
  }

  private log(level: LogLevel, message: string, context?: string, data?: any) {
    if (!this.shouldLog(level)) return;

    const entry = this.formatLogEntry({
      level,
      message,
      context,
      data,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });

    if (this.isDevelopment) {
      const colors = {
        [LogLevel.DEBUG]: '#6c757d',
        [LogLevel.INFO]: '#007bff',
        [LogLevel.WARN]: '#ffc107',
        [LogLevel.ERROR]: '#dc3545',
      };

      console.log(
        `%c[${entry.level.toUpperCase()}]%c ${entry.message}`,
        `color: ${colors[level]}; font-weight: bold;`,
        'color: inherit;',
        entry
      );
    } else {
      console.log(JSON.stringify(entry));
    }

  }


  debug(message: string, context?: string, data?: any) {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: any) {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: any) {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, data?: any) {
    this.log(LogLevel.ERROR, message, context, data);
  }

  auth(message: string, data?: any) {
    this.info(message, 'AUTH', data);
  }

  api(message: string, data?: any) {
    this.info(message, 'API', data);
  }

  navigation(message: string, data?: any) {
    this.info(message, 'NAVIGATION', data);
  }

  performance(message: string, data?: any) {
    this.info(message, 'PERFORMANCE', data);
  }

  userAction(message: string, data?: any) {
    this.info(message, 'USER_ACTION', data);
  }

  errorWithStack(message: string, error: Error, context?: string) {
    this.error(message, context, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
}

export const logger = new Logger(); 