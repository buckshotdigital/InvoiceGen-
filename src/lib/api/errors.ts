import { NextResponse } from 'next/server';

export interface ApiErrorResponse {
  error: string;
  code: string;
  details?: unknown;
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  NOT_FOUND: 'NOT_FOUND',
  NO_SUBSCRIPTION: 'NO_SUBSCRIPTION',
  LIMIT_EXCEEDED: 'LIMIT_EXCEEDED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export function createErrorResponse(
  message: string,
  code: keyof typeof ErrorCodes,
  status: number,
  details?: unknown,
  emoji?: string
): NextResponse {
  const logEmoji = emoji || (status >= 500 ? '❌' : '⚠️');
  console.error(`${logEmoji} API Error [${code}]:`, message, details || '');

  const responseBody: ApiErrorResponse = {
    error: message,
    code: ErrorCodes[code],
  };

  if (details) {
    responseBody.details = details;
  }

  return NextResponse.json(responseBody, { status });
}

export function createSuccessResponse<T>(data: T, message?: string, emoji = '✅'): NextResponse {
  if (message) console.log(`${emoji} ${message}`);
  return NextResponse.json(data, { status: 200 });
}
