// The exact JSON contract your frontend will receive
export interface AppErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown; // Safe container instead of any
    stack?: string; // Only visible in development
  };
}

// A concrete, strictly typed structure for validation errors
export interface ValidationErrorDetail {
  field: string;
  issue: string;
}
