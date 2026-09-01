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
  FIREBASE_API_KEY: "",

  // Storage Keys
  STORAGE_USERS_KEY: "z8_registered_users_directory",
  STORAGE_SESSION_KEY: "z8_catalog_auth_token",
  STORAGE_SESSION_USER_KEY: "z8_catalog_auth_user",
  STORAGE_CRM_KEY: "z8_crm_leads_data",
  STORAGE_ORDERS_KEY: "z8_warranty_service_orders_db"
};

export const DEFAULT_MASTER_ADMIN = {
  id: 'user_admin_01',
  name: 'Christian Admin',
  company: 'Z8 E-Motion Brasil (Matriz)',
  city: 'São Paulo - SP',
  email: 'christian.tkh@gmail.com',
  phone: '(12) 99800-8818',
  password: '@12345678@',
  role: 'admin',
  status: 'approved',
  updatedAt: 1000,
  createdAt: new Date().toISOString()
};
