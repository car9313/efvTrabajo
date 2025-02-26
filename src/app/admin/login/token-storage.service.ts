import { Injectable } from '@angular/core';
import { Guid } from '@app/nodachi/utils/guid';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_NAME_KEY = 'user_name';
export const ACCESS_TOKEN_EXPIRATION_KEY = 'access_token_expiration';
export const FINGERPRINT_KEY = 'fingerprint';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  /**
   * Almacena los datos del token en sessionStorage y localStorage.
   * @param body Respuesta de autenticación.
   */
  setLocalStorage(body: any) {
    sessionStorage.setItem(
      ACCESS_TOKEN_KEY,
      `${body.token_type} ${body.access_token}`
    );
    localStorage.setItem(REFRESH_TOKEN_KEY, body.refresh_token);
    localStorage.setItem(USER_NAME_KEY, body.userName);
    localStorage.setItem(
      ACCESS_TOKEN_EXPIRATION_KEY,
      (+new Date() + body.expires_in * 60 * 1000).toString()
    );
  }

  clearLocalStorage() {
    sessionStorage.clear();
    localStorage.removeItem(ACCESS_TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem('mrep_up');
    localStorage.removeItem('access_up');
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getTokenExpiration(): number {
    const expiration = localStorage.getItem(ACCESS_TOKEN_EXPIRATION_KEY);
    return expiration ? Number(expiration) : 0;
  }

  /**
   * Determina si el token actual ha expirado.
   */
  hasExpiredToken(): boolean {
    const token = this.getAccessToken();
    const expiration = this.getTokenExpiration();
    const prueba = !token || expiration < Date.now();
    return prueba;
  }

  getFingerprint(): string | null {
    return localStorage.getItem(FINGERPRINT_KEY);
  }
  /**
   * Establece un identificador único (fingerprint) en caso de no existir.
   */
  setFingerprint(): void {
    if (!this.getFingerprint()) {
      const guid = Guid.create();
      localStorage.setItem(FINGERPRINT_KEY, guid.toString());
    }
  }
}
