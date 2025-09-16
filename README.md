# KLHreportingapp

A modern web application for reporting and analytics with support for multiple integrations like Microsoft 365, Proofpoint, Duo, and SentinelOne.  
This project is designed for use with AWS Secrets Manager to securely manage credentials for multiple companies.

---

## Features
- 🔹 Multi-company support (via AWS Secrets Manager)
- 🔹 Microsoft 365 reporting
- 🔹 Duo and Proofpoint integration
- 🔹 SentinelOne reporting
- 🔹 Clean React + TypeScript front-end
- 🔹 Secure credential management with local dev fallback

---

## Folder Structure
```
Klhreportingapp/
│
├── config/                      # Credential templates and config files
│   ├── put_credentials_here.json  # Local testing only
│   └── README.md
│
├── src/                         # Main source code
│   ├── assets/                   # Images, icons, and static files
│   ├── components/               # Reusable UI components
│   ├── data/                      # Demo/sample datasets
│   ├── lib/                       # Utilities and AWS loader
│   ├── pages/                     # Page-level components
│   └── main.tsx
│
├── public/                       # Static public assets
│
├── package.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### **1. Prerequisites**
- [Node.js](https://nodejs.org/) (LTS version recommended)
- Git
- AWS account (for Secrets Manager integration)

---

### **2. Install Dependencies**
```bash
npm install
```

---

### **3. Run in Development**
To run the project locally with a **local credentials file**:
```bash
VITE_USE_LOCAL_CREDS=true npm run dev
```

Open your browser to:  
```
http://localhost:5173
```

---

### **4. AWS Secrets Manager Setup**
Each company should have a secret stored in AWS Secrets Manager in this format:

```json
{
  "m365": {
    "tenant_id": "00000000-0000-0000-0000-000000000000",
    "client_id": "00000000-0000-0000-0000-000000000000",
    "client_secret": "REPLACE_WITH_SECRET"
  },
  "proofpoint": {
    "username": "api-user@example.com",
    "password": "REPLACE",
    "primary_domain": "example.com"
  },
  "duo": {
    "ikey": "DIXXXXXXXXXXXXXXXXXX",
    "skey": "REPLACE",
    "host": "api-XXXX.duosecurity.com"
  },
  "s1": {
    "api_host": "usea1-cw02.sentinelone.net",
    "api_token": "REPLACE",
    "site_id": "123456789012345678"
  }
}
```

The app will automatically load companies by reading all secrets with the prefix:
```
prod/client-reporting/
```

---

### **5. Build for Production**
```bash
npm run build
```

The build output will be in the `dist/` folder.

---

## Security Notes
- **Never commit real credentials** — keep sensitive files in the `config/` folder and use `.gitignore` to prevent uploading.
- Use AWS Secrets Manager for all production secrets.

---

## License
This project is proprietary and intended for internal use only.  
Do not redistribute or publish without authorization.
