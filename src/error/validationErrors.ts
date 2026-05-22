import { AppError } from './Apperror.js';
import { ValidationErrorDetail } from '../types/AppErrorResponse.js';


export class ValidationError extends AppError<ValidationErrorDetail[]> {
  constructor(details: ValidationErrorDetail[], message = 'Validation Failed') {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}
