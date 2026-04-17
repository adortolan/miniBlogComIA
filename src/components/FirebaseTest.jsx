import { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

const FirebaseTest = () => {
  const [authStatus, setAuthStatus] = useState('Verificando...');
  const [firestoreStatus, setFirestoreStatus] = useState('Verificando...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStatus(`✅ Auth OK - Usuário: ${user.email}`);
      } else {
        setAuthStatus('✅ Auth OK - Nenhum usuário logado');
      }
    }, (error) => {
      setAuthStatus(`❌ Erro no Auth: ${error.message}`);
    });

    const testFirestore = async () => {
      try {
        const postsRef = collection(db, 'posts');
        await getDocs(postsRef);
        setFirestoreStatus('✅ Firestore OK - Conexão estabelecida');
      } catch (error) {
        setFirestoreStatus(`❌ Erro no Firestore: ${error.message}`);
      }
    };

    testFirestore();

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔥 Status da Conexão Firebase</h2>
      <div style={{ marginTop: '10px' }}>
        <p><strong>Authentication:</strong> {authStatus}</p>
        <p><strong>Firestore:</strong> {firestoreStatus}</p>
      </div>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <p><strong>ℹ️ Informações:</strong></p>
        <ul>
          <li>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Não configurado'}</li>
          <li>Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Não configurado'}</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseTest;
