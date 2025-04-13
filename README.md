# 📚 Peer-to-Peer Book Exchange Portal

A full-stack mini web app that connects **Book Owners** and **Book Seekers**. Built with **Next.js** for frontend and **Express.js** for backend, this app allows users to list, rent, and exchange books seamlessly.

## 🌟 Features Implemented

### 🔐 Authentication (Basic)
- Login with Email and Password (mock, no encryption).
- Role-based login:
  - **Book Owners**: Add/delete book listings.
  - **Book Seekers**: Browse listings only.

### 👤 User Profiles
Users can register with:
- Name
- Mobile Number
- Email
- Password
- Role: Owner or Seeker

**Storage**: Used postgres database for it.

### 📘 Book Listing Interface
- **Owners** can:
  - Add new listings
  - Delete their own listings
  - Mark books as Rented/Exchanged
- **Seekers** can:
  - Browse all available books

**Fields for Book Listings:**
- Title
- Author
- Genre (optional)
- City/Location
- Contact Email/Phone
- Cover Image (optional)
- Status: Available / Rented

**Storage**: stored in postgres db.

### 🔍 Search & Filter
- Filter listings by:
  - Title
  - Location
  - Genre
- All users can view listings and apply filters.


## 🛠️ Tech Stack

| Layer      | Tech                    |
|------------|-------------------------|
| Frontend   | Next.js (React, Tailwind) |
| Backend    | Express.js (Node.js)    |
| Storage    | postgres   |
| Deployment | Vercel (frontend) + Railway (backend) |

## ⚙️ Setup Instructions

add env content

in backend/.env
```
PORT=4000
DATABASE_URL=<postgres_db_string>
```
in frontend/.env
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/api
```


### 📦 Backend
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

### 📦 frontend
```bash
cd frontend
npm install
npm run dev
```

then u can access app on http://localhost:3000
