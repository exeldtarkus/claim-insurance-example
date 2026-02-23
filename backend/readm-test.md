**simulasi end-to-end Claim Flow** dari **insurance → draft → submit → review → approve / reject**, lengkap dengan **beberapa skenario** dan **curl** yang bisa langsung kamu pakai.

Aku asumsikan:

* Base URL: `http://localhost:8000`
* JWT pakai **Bearer Token**
* Endpoint sesuai kode terakhir kamu
* Insurance sudah ada (seeded)

---

# 🔐 0️⃣ LOGIN (Ambil JWT)

## Login sebagai USER

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@mail.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "data": {
    "accessToken": "USER_TOKEN"
  }
}
```

---

## Login sebagai VERIFIER

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verifier@mail.com",
    "password": "password123"
  }'
```

---

## Login sebagai APPROVER

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "approver@mail.com",
    "password": "password123"
  }'
```

---

# 📦 1️⃣ SHOW INSURANCE (USER)

```bash
curl -X GET http://localhost:8000/api/insurance \
  -H "Authorization: Bearer USER_TOKEN"
```

Ambil salah satu:

```json
{
  "id": 3,
  "uuid": "a1b2c3-uuid-insurance",
  "amount": 5000000,
  "insurance_type": "kesehatan"
}
```

➡️ **insurance.uuid** akan dipakai ke claim

---

# 📝 2️⃣ CREATE CLAIM (DRAFT)

```bash
curl -X POST http://localhost:8000/api/claims \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "insurance_id": "a1b2c3-uuid-insurance",
    "total_amount": 4500000
  }'
```

Response:

```json
{
  "data": {
    "id": 12,
    "status": "draft",
    "version": 1
  }
}
```

---

# ✏️ 3️⃣ SAVE DRAFT (UPDATE DRAFT)

```bash
curl -X PUT http://localhost:8000/api/claims/12/draft \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 4800000
  }'
```

⚠️ Valid:

* hanya `status=draft`
* selain itu → `409`

---

# 📤 4️⃣ SUBMIT CLAIM

```bash
curl -X POST http://localhost:8000/api/claims/12/submit \
  -H "Authorization: Bearer USER_TOKEN"
```

Result:

```json
{
  "data": {
    "status": "submitted",
    "version": 2
  }
}
```

---

# 🔎 5️⃣ REVIEW CLAIM (VERIFIER)

```bash
curl -X POST http://localhost:8000/api/claims/12/review \
  -H "Authorization: Bearer VERIFIER_TOKEN"
```

Result:

```json
{
  "data": {
    "status": "reviewed",
    "version": 3
  }
}
```

---

# ✅ 6️⃣ APPROVE CLAIM (APPROVER)

```bash
curl -X POST http://localhost:8000/api/claims/12/approve \
  -H "Authorization: Bearer APPROVER_TOKEN"
```

Result:

```json
{
  "data": {
    "status": "approved",
    "version": 4
  }
}
```

---

# ❌ 7️⃣ REJECT CLAIM (SKENARIO ALTERNATIF)

Misal claim lain `id=13`

```bash
curl -X POST http://localhost:8000/api/claims/13/reject \
  -H "Authorization: Bearer APPROVER_TOKEN"
```

Result:

```json
{
  "data": {
    "status": "rejected",
    "version": 4
  }
}
```

---

# 🚫 SKENARIO ERROR (PENTING)

## ❌ User submit claim bukan miliknya

```bash
HTTP 403 Forbidden
```

---

## ❌ Review tanpa submit

```bash
POST /claims/{id}/review
→ 409 Invalid state
```

---

## ❌ Approve tanpa review

```bash
POST /claims/{id}/approve
→ 409 Invalid state
```

---

## ❌ Save draft setelah submit

```bash
PUT /claims/{id}/draft
→ 409 Only draft claim can be updated
```

---

# LIST CLAIMS

```bash
curl -X GET "http://localhost:8000/api/claims?page=1&limit=10" \
  -H "Authorization: Bearer USER_TOKEN"
```

Filter:

```bash
?status=draft
?user_id=1
```

---
