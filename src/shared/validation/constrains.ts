import { ValidationError } from '@nestjs/common';

const getErrors = (errors: ValidationError[]) => {
  const constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const constraintValues = Object.values(error.constraints);
      constraints.push(...constraintValues);
    }

    if (error.children?.length) {
      const childConstraints = getErrors(error.children);
      constraints.push(...childConstraints);
    }
  }

  return constraints;
};

export function getCustomValidationError(errors: ValidationError[]) {
  const unifiedErrors = getErrors(errors);

  const message = Object.values(unifiedErrors)[0];

  return {
    statusCode: 422,
    message,
    error: 'Unprocessable Entity',
  };
}
