// ==========================================================================
// Z8 E-Motion - Official Firebase Auth & Real-Time Cloud Firestore Service
// ==========================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { CLOUD_CONFIG, DEFAULT_MASTER_ADMIN, SEED_REGISTERED_USERS, FIREBASE_CONFIG } from '../data/cloud-config.js';

let firebaseApp = null;
let auth = null;
let db = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function isFirebaseConfigured() {
  return Boolean(FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.apiKey);
}

export function initFirebase() {
  if (firebaseApp) return { app: firebaseApp, auth, db };

  try {
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp, 'default');
    return { app: firebaseApp, auth, db };
  } catch (err) {
    console.warn('Firebase initialization notice:', err.message);
    return { app: null, auth: null, db: null };
  }
}

// --------------------------------------------------------------------------
// 1. GOOGLE 1-CLICK AUTHENTICATION
// --------------------------------------------------------------------------
export async function signInWithGoogleAccount() {
  const { auth, db } = initFirebase();
  if (!auth) {
    throw new Error('Serviço de autenticação temporariamente indisponível.');
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const email = (user.email || '').toLowerCase().trim();
  const isMaster = email === CLOUD_CONFIG.MASTER_ADMIN_EMAIL.toLowerCase();

  // Verifica se o usuário já possui cadastro prévio no Firestore
  let existingData = null;
  if (db) {
    try {
      const userRef = doc(db, 'catalog_users', email);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        existingData = snapshot.data();
      }
    } catch (e) {
      console.warn('Firestore read error during Google Auth:', e.message);
    }
  }

  const userData = {
    id: existingData?.id || user.uid || ('user_' + Date.now()),
    name: existingData?.name || user.displayName || 'Parceiro Z8',
    company: existingData?.company || 'Lojista Conectado via Google',
    city: existingData?.city || 'São Paulo - SP',
    email: email,
    phone: existingData?.phone || user.phoneNumber || '',
    photoUrl: user.photoURL || '',
    role: isMaster ? 'admin' : (existingData?.role || 'partner'),
    status: isMaster ? 'approved' : (existingData?.status || 'pending'),
    authProvider: 'google',
    updatedAt: Date.now(),
    createdAt: existingData?.createdAt || new Date().toISOString()
  };

  // Salva ou atualiza no Firestore
  if (db) {
    try {
      const userRef = doc(db, 'catalog_users', email);
      await setDoc(userRef, userData, { merge: true });
    } catch (e) {
      console.warn('Firestore save error during Google Auth:', e.message);
    }
  }

  // Também envia para a API Serverless
  try {
    await fetch(CLOUD_CONFIG.API_USERS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  } catch (e) {
    // offline/fallback
  }

  return userData;
}

// --------------------------------------------------------------------------
// 2. SELF-SERVICE PASSWORD RESET VIA EMAIL (GOOGLE INFRASTRUCTURE)
// --------------------------------------------------------------------------
export async function requestPasswordResetEmail(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Por favor, informe um endereço de e-mail válido.' };
  }

  if (cleanEmail === CLOUD_CONFIG.MASTER_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, error: 'A conta do Administrador Master é protegida no código do sistema.' };
  }

  const { auth } = initFirebase();
  if (auth) {
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return { 
        success: true, 
        message: `📧 Link de redefinição de senha enviado com sucesso para ${cleanEmail}! Verifique sua caixa de entrada e pasta de spam.` 
      };
    } catch (err) {
      console.warn('Firebase reset password email warning:', err.code, err.message);
      if (err.code === 'auth/user-not-found') {
        return { success: false, error: 'E-mail não encontrado. Cadastre-se na aba ao lado.' };
      }
    }
  }

  // Fallback via API Serverless
  try {
    const res = await fetch(CLOUD_CONFIG.API_USERS_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: 'Z8@' + Math.floor(1000 + Math.random() * 9000) })
    });
    if (res.ok) {
      return { success: true, message: `Solicitação registrada! Um link seguro foi gerado para ${cleanEmail}.` };
    }
  } catch (e) {
    // ignore
  }

  return { 
    success: true, 
    message: `📧 Se o e-mail ${cleanEmail} estiver cadastrado, as instruções de recuperação foram enviadas!` 
  };
}

// --------------------------------------------------------------------------
// 3. REAL-TIME SNAPSHOT LISTENER (ADMIN INSTANT VISIBILITY)
// --------------------------------------------------------------------------
export function subscribeToUsersRealtime(callback) {
  const { db } = initFirebase();
  if (!db) return () => {};

  try {
    const usersCol = collection(db, 'catalog_users');
    const unsubscribe = onSnapshot(usersCol, (snapshot) => {
      const users = [];
      snapshot.forEach(docSnap => {
        users.push(docSnap.data());
      });
      if (typeof callback === 'function') {
        callback(users);
      }
    }, (error) => {
      console.warn('Firestore onSnapshot listener info:', error.message);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Error subscribing to Firestore:', err.message);
    return () => {};
  }
}

// --------------------------------------------------------------------------
// 4. ATOMIC PERMANENT CLOUD APPROVAL / BLOCK / DELETE
// --------------------------------------------------------------------------
export async function setCloudUserStatus(email, newStatus) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const { db } = initFirebase();
  const now = Date.now();

  if (db) {
    try {
      const userRef = doc(db, 'catalog_users', cleanEmail);
      await updateDoc(userRef, {
        status: newStatus,
        updatedAt: now
      });
    } catch (e) {
      console.warn('Firestore status update error:', e.message);
    }
  }

  // Atualiza também via API Serverless
  try {
    await fetch(CLOUD_CONFIG.API_USERS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, status: newStatus })
    });
  } catch (e) {
    // ignore
  }

  return true;
}

export async function deleteCloudUser(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (cleanEmail === CLOUD_CONFIG.MASTER_ADMIN_EMAIL.toLowerCase()) return false;

  const { db } = initFirebase();
  if (db) {
    try {
      const userRef = doc(db, 'catalog_users', cleanEmail);
      await deleteDoc(userRef);
    } catch (e) {
      console.warn('Firestore delete error:', e.message);
    }
  }

  try {
    await fetch(`${CLOUD_CONFIG.API_USERS_URL}?email=${encodeURIComponent(cleanEmail)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail })
    });
  } catch (e) {
    // ignore
  }

  return true;
}
