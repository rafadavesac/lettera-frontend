import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Atalho para ler o contexto, com erro claro se faltar o AuthProvider.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}