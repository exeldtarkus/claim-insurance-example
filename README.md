
```markdown
# 🛡️ Claim Management System (Fullstack)

Sistem manajemen klaim asuransi terintegrasi yang dibangun dengan arsitektur modern. Proyek ini mencakup alur kerja lengkap dari pengajuan klaim oleh **User**, verifikasi oleh **Verifier**, hingga keputusan final oleh **Approver**.

## 🚀 Fitur Utama

* **Multi-Role Workflow**: Alur transisi status klaim yang ketat (`Draft` -> `Submitted` -> `Reviewed` -> `Approved/Rejected`).
* **Atomic Transactions**: Menggunakan `db.begin_nested()` dan `with_for_update` untuk mencegah *race conditions*.
* **Dynamic API Proxy**: Integrasi Next.js 15 API Routes sebagai jembatan ke Backend FastAPI.
* **Modern UI/UX**: Dashboard responsif dengan Tailwind CSS, Redux Toolkit, dan Modal kustom (Backdrop Blur).
* **Optimistic Versioning**: Melacak versi dokumen di setiap perubahan status untuk audit.

---

## 🔑 Akun Uji Coba (Demo Accounts)

Gunakan akun di bawah ini untuk mencoba alur kerja sistem. Semua akun menggunakan password yang sama:

**Password Global:** `password123`

| Role | Email | Otoritas |
| :--- | :--- | :--- |
| **User** | `user1@customer.test` s/d `user16@customer.test` | Membuat asuransi & submit klaim. |
| **Verifier** | `reviewer@insurance.test` | Review dokumen & tandai sebagai *Reviewed*. |
| **Approver** | `approver@insurance.test` | Keputusan final (*Approve* atau *Reject*). |

---

## 🛠️ Tech Stack

**Backend:** FastAPI, SQLAlchemy, Alembic, Pydantic.
**Frontend:** Next.js 15 (App Router), Redux Toolkit, Tailwind CSS.
**DevOps:** Docker & Docker Compose.

---

## 📁 Struktur Proyek

```text
claim-exmpl-project/
├── backend/            # FastAPI Service (Micro-module structure)
│   ├── ms_claims/      # Logika Bisnis Klaim
│   ├── ms_insurance/   # Manajemen Produk Asuransi
│   └── ...
├── claim-fe/           # Next.js Frontend (App Router)
└── docker-compose.yml  # Orchestration File

```

---

## 🚦 Cara Menjalankan (Docker)

1. **Siapkan Env**: Buat `./backend/.env.docker` dan `./claim-fe/.env`.
2. **Build & Run**:
```bash
docker-compose up --build

```


3. **Akses**:
* Frontend: `http://localhost:3000`
* Backend Docs: `http://localhost:8000/docs`



---

## 🔐 Alur Kerja Status

1. **User**: `Draft` -> `Submitted`.
2. **Verifier**: Melihat `Submitted` -> `Reviewed`.
3. **Approver**: Melihat `Reviewed` -> `Approved` / `Rejected`.

---

**Developed by Exel Tarkus** *Software Developer*

```