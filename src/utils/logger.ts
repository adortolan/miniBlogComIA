/**
 * Logger condicional que só exibe logs em ambiente de desenvolvimento.
 * Em produção, os logs são silenciados para evitar vazamento de informações.
 * 
 * @example
 * import { logger } from '@/utils/logger';
 * logger.error('Erro ao buscar post:', error);
 * logger.warn('Aviso:', message);
 * logger.info('Info:', data);
 */

const isDev = import.meta.env.DEV;

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface Logger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

const createLogger = (): Logger => {
  const noop = () => {};

  const createLogMethod = (level: LogLevel) => {
    if (isDev) {
      return (...args: unknown[]) => {
        console[level](`[${level.toUpperCase()}]`, ...args);
      };
    }
    return noop;
  };

  return {
    log: createLogMethod('log'),
    info: createLogMethod('info'),
    warn: createLogMethod('warn'),
    error: createLogMethod('error'),
    debug: createLogMethod('debug'),
  };
};

export const logger = createLogger();
