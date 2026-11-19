// src/context/AuthContext.js
// Guarda a sessão do app (usuário logado) e expõe signIn, signUp e signOut.
// Fala com a API só através do authService e persiste a sessão só através do tokenStorage.
// Formato do usuário no estado: { id, name, email, type } onde type é "Admin" ou "Common".

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler } from '../services/api';
import * as authService from '../services/authService';
import { clearSession, getStoredUser, getToken, saveSession } from '../utils/tokenStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true enquanto o app verifica se já existe uma sessão salva (evita piscar a tela de login).
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  // Ao abrir o app: restaura a sessão salva, se houver. O(1).
  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const [token, storedUser] = await Promise.all([getToken(), getStoredUser()]);
        if (active && token && storedUser) {
          setUser(storedUser);
        }
      } catch {
        // Falha ao ler o armazenamento: segue sem sessão (usuário faz login de novo).
      } finally {
        if (active) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  // Se qualquer requisição autenticada voltar 401 (token expirado), encerra a sessão.
  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const signIn = useCallback(async (email, password) => {
    const { user: apiUser, token } = await authService.signIn(email, password);
    // Guarda só os campos que o app usa (não persiste o resto da resposta).
    const sessionUser = {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      type: apiUser.type,
    };
    await saveSession(token, sessionUser);
    setUser(sessionUser);
  }, []);

  // O signup não devolve token, então cadastra e já faz o login em seguida.
  const signUp = useCallback(
    async (name, email, password) => {
      await authService.signUp(name, email, password);
      await signIn(email, password);
    },
    [signIn]
  );

  const value = useMemo(
    () => ({ user, isLoading, signIn, signUp, signOut }),
    [user, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}