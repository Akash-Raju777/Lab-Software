# LabTrack — Reagent Expiry & Inventory Alert System

**LabTrack** is a production-quality, clinical-grade inventory and expiry alert management system specifically designed for microbiology laboratories. It empowers laboratory staff to maintain reagent registries and dynamically compute safety thresholds (**Good**, **Expiring Soon**, and **Expired**) based on the current calendar date.

---

## 🔬 System Architecture

```
┌────────────────────────────────────────────────────────┐
│               Next.js Frontend (Vercel)                │
│    - Responsive Medical UI (Inter Typography)          │
│    - /dashboard, /reagents, /reagents/add, /alerts     │
│    - Zero-leakage client-side architecture             │
└───────────────────────────▲────────────────────────────┘
                            │ REST API (JSON)
┌───────────────────────────▼────────────────────────────┐
│            Java Spring Boot Backend (Port 8080)        │
│    - Layered: Controller -> Service -> Repository      │
│    - Dynamic Expiry Calculation & Alert Logic          │
│    - DTO validation & Global Exception Handling        │
└───────────────────────────▲────────────────────────────┘
                            │ JDBC / SSL
┌───────────────────────────▼────────────────────────────┐
│             Supabase PostgreSQL Database                │
│    - Table: `reagents` (id, name, quantity, unit, ...) │
│    - Safe: No stale statuses stored in database        │
└────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

1. **Dynamic Expiry Status Engine**:
   - **Good**: Expiry date > 7 days away.
   - **Expiring Soon**: Expiry date within 7 days (0 to 7 days).
   - **Expired**: Expiry date has passed (< 0 days).
   - *Status is computed dynamically on read to ensure 100% real-time accuracy without database staleness.*

2. **Microbiology Lab Identity**:
   - Clean, professional clinical design.
   - Strictly no AI-generated gradients, glassmorphism, or neon styling.
   - Clear visual color codes: **Green** for Good, **Amber** for Expiring Soon, **Red** for Expired.

3. **Core Pages**:
   - `/login`: Secure staff authentication (`admin@labtrack.com` / `labpassword123`).
   - `/dashboard`: Inventory KPI stats, recent alerts, upcoming expiration table.
   - `/reagents`: Sortable, filterable, searchable data table with reagent details and deletion confirmation.
   - `/reagents/add`: Form with instant dynamic status preview and client/server validation.
   - `/alerts`: Dedicated view categorized by Expired (quarantine required) and Expiring Soon.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Open your **Supabase Dashboard** > **SQL Editor**.
2. Run the SQL script located in [`supabase/schema.sql`](supabase/schema.sql):

```sql
CREATE TABLE IF NOT EXISTS reagents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reagents_expiry_date ON reagents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_reagents_name ON reagents(name);
```

---

## 🚀 Running the Application Locally

### Prerequisites
- **Java 17+** (JDK)
- **Node.js 18+** & **npm**

### Step 1: Start the Spring Boot Backend
Open a terminal in the `backend/` directory:

```bash
cd backend
# Using Maven wrapper:
./mvnw spring-boot:run
# (On Windows CMD/PowerShell: mvnw.cmd spring-boot:run)
```

The Spring Boot backend will start on **`http://localhost:8080`**.

> **Note**: If you want to connect directly to your Supabase PostgreSQL instance, set the following environment variables or configure `backend/src/main/resources/application.properties`:
> - `SPRING_DATASOURCE_URL=jdbc:postgresql://<SUPABASE_HOST>:5432/postgres?sslmode=require`
> - `SPRING_DATASOURCE_USERNAME=postgres`
> - `SPRING_DATASOURCE_PASSWORD=<YOUR_SUPABASE_DB_PASSWORD>`

### Step 2: Start the Next.js Frontend
In a separate terminal, navigate to the `frontend/` directory:

```bash
cd frontend
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Lab Administrator** | `admin@labtrack.com` | `labpassword123` |
| **Lab Technician** | `staff@labtrack.com` | `staff123` |

---

## 📡 Backend REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate laboratory personnel |
| `GET` | `/api/reagents` | List all reagents (supports `search`, `status`, `sortBy`, `sortDir`) |
| `GET` | `/api/reagents/{id}` | Get specific reagent details |
| `POST` | `/api/reagents` | Add new reagent with validation |
| `DELETE` | `/api/reagents/{id}` | Remove reagent from inventory |
| `GET` | `/api/reagents/summary` | Get KPI metrics (Total, Good, Expiring Soon, Expired) |
| `GET` | `/api/reagents/alerts` | Get all active Expiring Soon and Expired alerts |

---

## 🌐 Deploying Frontend to Vercel

1. Push this repository to GitHub / GitLab.
2. Go to [Vercel Dashboard](https://vercel.com) > **Add New Project**.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed Spring Boot backend URL (e.g., `https://api.labtrack.yourdomain.com`).
5. Click **Deploy**.
