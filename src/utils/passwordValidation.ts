/**
 * Utilitário para validação de senhas com política de segurança reforçada.
 * 
 * Requisitos mínimos:
 * - 8 caracteres
 * - 1 letra maiúscula
 * - 1 letra minúscula
 * - 1 número
 * - 1 caractere especial (opcional, mas recomendado)
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
}

const DEFAULT_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false, // Opcional por padrão
};

/**
 * Valida uma senha contra os requisitos de segurança
 * @param password - Senha a ser validada
 * @param requirements - Requisitos customizados (opcional)
 * @returns Resultado da validação com erros e força da senha
 */
export const validatePassword = (
  password: string,
  requirements: Partial<PasswordRequirements> = {}
): PasswordValidationResult => {
  const config = { ...DEFAULT_REQUIREMENTS, ...requirements };
  const errors: string[] = [];

  // Verificar comprimento mínimo
  if (password.length < config.minLength) {
    errors.push(`Senha deve ter no mínimo ${config.minLength} caracteres`);
  }

  // Verificar letra maiúscula
  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }

  // Verificar letra minúscula
  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }

  // Verificar número
  if (config.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }

  // Verificar caractere especial
  if (config.requireSpecialChar && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial (!@#$%^&*...)');
  }

  // Calcular força da senha
  const strength = calculatePasswordStrength(password);

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * Calcula a força da senha baseado em critérios
 */
const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;

  // Comprimento
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Complexidade
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

  // Variedade de caracteres
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score++;

  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  return 'strong';
};

/**
 * Retorna uma mensagem amigável sobre os requisitos de senha
 */
export const getPasswordRequirementsMessage = (): string => {
  return 'A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula e número.';
};
