import { createContext, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

// Guarda o usuário logado. Formato esperado: { name, email, type }.
// Por enquanto o login é simulado; a integração com a API vem no chat 2.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      user,
      signIn: (loggedUser) => setUser(loggedUser),
      signOut: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}