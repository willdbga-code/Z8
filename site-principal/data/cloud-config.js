// ==========================================================================
// Z8 E-Motion - Cloud Database & API Configuration
// ==========================================================================

export const CLOUD_CONFIG = {
  // Master Admin Credentials
  MASTER_ADMIN_EMAIL: "christian.tkh@gmail.com",
  MASTER_ADMIN_NAME: "Christian Hideyuki (Admin Master)",
  MASTER_ADMIN_PHONE: "5512998008818",

  // Central Serverless API Endpoints (Vercel)
  API_USERS_URL: "/api/users",
  API_LEADS_URL: "/api/leads",
  API_ORDERS_URL: "/api/orders",

  // Dedicated Firebase Firestore Configuration for Z8 E-Motion
  FIREBASE_PROJECT_ID: "z8-emotion-brasil",
  FIREBASE_API_KEY: "AIzaSyCBAe00zQFgJkDJG70ywXx6xr0mOCIK8Fo",
  FIREBASE_AUTH_DOMAIN: "z8-emotion-brasil.firebaseapp.com",
  FIREBASE_STORAGE_BUCKET: "z8-emotion-brasil.firebasestorage.app",
  FIREBASE_MESSAGING_SENDER_ID: "445689506709",
  FIREBASE_APP_ID: "1:445689506709:web:c4946fcac8a83e3010249c",
  FIRESTORE_DATABASE: "default",

  // Storage Keys
  STORAGE_USERS_KEY: "z8_registered_users_directory",
  STORAGE_SESSION_KEY: "z8_catalog_auth_token",
  STORAGE_SESSION_USER_KEY: "z8_catalog_auth_user",
  STORAGE_CRM_KEY: "z8_crm_leads_data",
  STORAGE_ORDERS_KEY: "z8_warranty_service_orders_db"
};

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCBAe00zQFgJkDJG70ywXx6xr0mOCIK8Fo",
  authDomain: "z8-emotion-brasil.firebaseapp.com",
  projectId: "z8-emotion-brasil",
  storageBucket: "z8-emotion-brasil.firebasestorage.app",
  messagingSenderId: "445689506709",
  appId: "1:445689506709:web:c4946fcac8a83e3010249c"
};

export const DEFAULT_MASTER_ADMIN = {
  id: 'user_admin_01',
  name: 'Christian Hideyuki (Admin Master)',
  company: 'Z8 E-Motion Brasil (Matriz)',
  city: 'São Paulo - SP',
  email: 'christian.tkh@gmail.com',
  phone: '(12) 99800-8818',
  password: '@12345678@',
  role: 'admin',
  status: 'approved',
  updatedAt: 1000,
  createdAt: '2026-08-25T16:08:04.281Z'
};

// Base consolidada com todas as contas reais e cadastradas no sistema
export const SEED_REGISTERED_USERS = [
  DEFAULT_MASTER_ADMIN,
  {
    id: 'user_1787674451313',
    name: 'christian hideyuki',
    company: 'hide',
    city: 'Pindamonhangaba - SP',
    email: 'christian.hide@hotmail.com',
    phone: '(12) 98898-6148',
    password: '12345678',
    role: 'partner',
    status: 'approved',
    updatedAt: 1787674543174,
    createdAt: '2026-08-25T16:14:11.313Z'
  },
  {
    id: 'user_william_01',
    name: 'William Del Barrio',
    company: 'Del Barrio E-Motors',
    city: 'Pindamonhangaba - SP',
    email: 'willdbga@gmail.com',
    phone: '(12) 98813-0316',
    password: '12345678',
    role: 'partner',
    status: 'approved',
    updatedAt: 1787627826993,
    createdAt: '2026-08-25T03:15:24.950Z'
  },
  {
    id: 'lead_1787790262588',
    name: 'Fabrício Daniel de Oliveira Castro',
    company: 'JF',
    city: 'Pindamonhangaba - SP',
    email: 'fabriciopolocruzeiro@gmail.com',
    phone: '(12) 99106-4106',
    password: 'Z8@' + '4106',
    role: 'partner',
    status: 'pending',
    updatedAt: 1787790262589,
    createdAt: '2026-08-27T00:24:22.588Z'
  }
];
