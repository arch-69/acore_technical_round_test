# Firebase Todo API

Node.js + Express v5 backend with Firebase Authentication and MongoDB (Mongoose).

## Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express v5
- **Database:** MongoDB + Mongoose v9
- **Auth:** Firebase Admin SDK (service account)
- **Validation:** Zod

## Setup

### 1. Start MongoDB

```bash
docker compose up -d
```

### 2. Configure service account

Place your Firebase service account JSON in the project root:

```
../serviceAccount.json
```

Or set `SERVICE_ACCOUNT_PATH` env var.

### 3. Environment

Copy `.env` and adjust if needed:

```
PORT=5000
MONGODB_URI=mongodb://root:example@localhost:27017/todo-app?authSource=admin
```

### 4. Start server

```bash
npm start        # production
npm run dev      # nodemon
```

---

## API Endpoints

### Base URL: `http://localhost:5000`

All protected endpoints require:
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

### Health

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | No |

### Auth

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/api/auth/signup` | No | `{ "idToken": "..." }` |
| POST | `/api/auth/login` | No | `{ "idToken": "..." }` |

### Todos

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/todos?page=1&limit=10&completed=true` | Yes | List (paginated, filterable) |
| POST | `/api/todos` | Yes | Create — `{ "title": "...", "description": "..." }` |
| GET | `/api/todos/:id` | Yes | Get by ID |
| PUT | `/api/todos/:id` | Yes | Full update |
| PATCH | `/api/todos/:id` | Yes | Partial update (e.g. toggle `completed`) |
| DELETE | `/api/todos/:id` | Yes | Delete |

### Standard Response Format

```typescript
{
  statusCode: number;
  message: string;
  data: T | null;
  success: boolean;
}
```

---

## Postman Collection

Import `postman_collection.json` into Postman.

### Variables to set

| Variable | Description |
|----------|-------------|
| `baseUrl` | `http://localhost:5000` |
| `firebaseIdToken` | Firebase ID token (see below) |
| `todoId` | Todo ID from a created todo |

### How to get a Firebase ID token for Postman

**Option A: From browser console**

1. Open your frontend app at `http://localhost:5173`
2. Sign in with Google
3. Open DevTools → Console and run:

```js
(await import('firebase/auth')).getIdToken((await import('firebase/auth')).getAuth().currentUser)
  .then(token => console.log(token))
```

Or simply:

```js
firebase.auth().currentUser.getIdToken().then(console.log)
```

**Option B: Using a token from your frontend code**

In your React/Vue app, after sign-in:

```js
const token = await user.getIdToken();
console.log(token); // copy this into Postman
```

### Test Flow

1. Set `baseUrl` and `firebaseIdToken` variables
2. `POST /api/auth/login` → confirms auth works
3. `POST /api/todos` → create a todo, copy its `_id` into `todoId`
4. `GET /api/todos/{{todoId}}` → fetch it
5. `PATCH /api/todos/{{todoId}}` with `{ "completed": true }` → toggle
6. `GET /api/todos` → list all
7. `DELETE /api/todos/{{todoId}}` → delete

---

## Auth Flow (Frontend)

```js
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// 1. Sign in with Google
const auth = getAuth();
const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
const idToken = await result.user.getIdToken();

// 2. Send idToken to backend
const res = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken }),
});
const { data: user } = await res.json();

// 3. Use idToken for all API calls
const todosRes = await fetch('http://localhost:5000/api/todos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  },
  body: JSON.stringify({ title: 'Buy milk' }),
});
```
