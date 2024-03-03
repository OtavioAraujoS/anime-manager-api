import { HttpStatus } from '@nestjs/common';

export const handleMissingFieldsError = (
  missingFields: string[]
): {
  statusCode: number;
  message: string;
} => {
  if (missingFields.length === 0) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Todos os campos obrigatórios foram fornecidos.',
    };
  }

  const plural = missingFields.length > 1 ? 's' : '';
  const fieldNames = missingFields.join(', ');
  const errorMessage = `Os seguintes campo${plural} são obrigatórios e estão faltando: ${fieldNames}.`;

  return {
    statusCode: HttpStatus.BAD_REQUEST,
    message: errorMessage,
  };
};
