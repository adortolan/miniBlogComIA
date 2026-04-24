import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
