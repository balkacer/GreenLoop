import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Algo salió mal';
  const e = error as FetchBaseQueryError;
  if ('data' in e && e.data && typeof e.data === 'object') {
    const msg = (e.data as { message?: string }).message;
    if (msg) return msg;
  }
  if ('status' in e && e.status === 'FETCH_ERROR') {
    return 'Sin conexión al servidor. ¿Está el backend en ejecución?';
  }
  return 'No pudimos completar la acción';
}
