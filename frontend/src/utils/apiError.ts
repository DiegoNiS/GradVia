export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ParsedApiError {
  message: string;
  details?: ErrorDetail[];
  status?: number;
}

/**
 * Utility to parse error objects returned by GradVia backend or Axios network errors.
 */
export const parseApiError = (err: any): ParsedApiError => {
  if (!err) {
    return { message: 'Ocurrió un error inesperado.' };
  }

  // Axios response error
  if (err.response) {
    const status = err.response.status;
    const data = err.response.data;

    let mainMessage = 'Ocurrió un error al procesar la solicitud.';
    let details: ErrorDetail[] | undefined = undefined;

    if (typeof data === 'string') {
      mainMessage = data;
    } else if (data && typeof data === 'object') {
      // Backend structured formats:
      // 1. { error: "...", details: [...] }
      // 2. { status: "error", message: "..." }
      // 3. { error: "..." }
      if (data.error) {
        mainMessage = data.error;
      } else if (data.message) {
        mainMessage = data.message;
      }

      if (Array.isArray(data.details)) {
        details = data.details.map((item: any) => {
          if (typeof item === 'string') {
            return { message: item };
          }
          return {
            field: item.field || item.path,
            message: item.message || String(item),
          };
        });
      }
    }

    // Specific HTTP status code defaults if message is generic
    if (status === 401 && mainMessage === 'Ocurrió un error al procesar la solicitud.') {
      mainMessage = 'Sesión no válida o expirada. Por favor inicie sesión de nuevo.';
    } else if (status === 403 && mainMessage === 'Ocurrió un error al procesar la solicitud.') {
      mainMessage = 'No tiene permisos para realizar esta acción.';
    } else if (status === 404 && mainMessage === 'Ocurrió un error al procesar la solicitud.') {
      mainMessage = 'El recurso solicitado no fue encontrado.';
    }

    return {
      message: mainMessage,
      details,
      status,
    };
  }

  // Network or request setup error
  if (err.request) {
    return {
      message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet o intenta más tarde.',
    };
  }

  return {
    message: err.message || 'Error desconocido.',
  };
};
