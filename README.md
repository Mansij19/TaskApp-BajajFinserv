# TaskFlow – Smart Task Manager 🚀

<img width="1483" height="860" alt="image" src="https://github.com/user-attachments/assets/5bbff819-c847-4ba5-a6c3-9025b1256386" />

A full-stack MERN application built as part of the MERN Stack Coding Assessment.
TaskFlow helps users create, manage, prioritize, and track tasks using an intelligent **Priority Score System** calculated dynamically on the backend.

---

## 📌 Project Overview

TaskFlow is a smart task management application developed using the **MERN Stack**:

* **MongoDB** → Database
* **Express.js** → Backend framework
* **React.js** → Frontend UI
* **Node.js** → Runtime environment

The application allows users to:

* Create tasks with importance and deadlines
* Automatically calculate task priority scores
* Filter tasks based on status and importance
* Mark tasks as completed
* Delete tasks
* View tasks sorted by urgency

---

# ✨ Features

## ✅ Backend Features

* RESTful API using Express.js
* MongoDB integration with Mongoose
* Dynamic `priorityScore` calculation
* CRUD operations for tasks
* Query filtering
* Proper validation and error handling
* CORS enabled for frontend integration

---

## ✅ Frontend Features

* Responsive React UI
* Create Task Form
* Task List View
* Priority Highlighting
* Status & Importance Filters
* Loading, Empty & Error States
* Real-time UI updates without page reload

---

#  Priority Score Formula

The priority score is computed dynamically on the server:

priorityScore=(importance\times10)+\frac{100}{\max(daysUntilDue,1)}

### Rules:

* Higher importance → higher priority
* Nearer due dates → higher priority
* Completed tasks → score becomes `0`

---

# 📂 Project Structure

```bash
taskflow/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

#  Tech Stack

## Frontend

* React.js
* Axios
* CSS / Tailwind CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Deployment

* Frontend → Vercel / Netlify
* Backend → Render / Railway
* Database → MongoDB Atlas

---

#  Installation & Setup

##  Clone Repository

```bash
git clone <your-github-repo-link>
cd taskflow
```

---

# 🔧 Backend Setup

## Navigate to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Create `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## Run backend server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

#  Frontend Setup

## Navigate to frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Create `.env` file

```env
VITE_API_URL=http://localhost:5000
```

## Start frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

#  API Endpoints

## Base Route

```bash
/bfhl/tasks
```

---

##  Create Task

### POST `/bfhl/tasks`

```json
{
  "title": "Complete MERN Project",
  "description": "Finish frontend and backend",
  "importance": 5,
  "dueDate": "2026-06-01"
}
```

---

##  Get All Tasks

### GET `/bfhl/tasks`

### Query Parameters

| Parameter     | Description              |
| ------------- | ------------------------ |
| status        | pending/completed        |
| minImportance | minimum importance value |

### Example

```bash
/bfhl/tasks?status=pending&minImportance=3
```

---

##  Update Task

### PATCH `/bfhl/tasks/:id`

```json
{
  "status": "completed"
}
```

---

##  Delete Task

### DELETE `/bfhl/tasks/:id`

---

#  Bonus Stats Endpoint

## GET `/bfhl/tasks/stats`

Returns:

```json
{
  "totalTasks": 12,
  "pendingTasks": 8,
  "completedTasks": 4,
  "averageImportance": 3.25,
  "overdueTasks": 2
}
```

Implemented using MongoDB Aggregation Pipeline.

---

#  Validation Rules

* Title → Required (3–100 characters)
* Description → Max 500 characters
* Importance → Integer between 1–5
* Due Date → Must be a future date
* Invalid IDs → Return HTTP 400
* Missing task → Return HTTP 404

---

#  UI Highlights

* High-priority tasks (`priorityScore >= 50`) highlighted visually
* Human-readable due dates
* Smooth user experience
* Inline error handling
* Loading and empty states

---

#  Deployment

## Frontend Deployment

* Vercel
* Netlify

## Backend Deployment

* Render
* Railway

## Database

* MongoDB Atlas

---

#  Testing Checklist

✅ CRUD operations working
✅ API validations working
✅ Priority score calculation correct
✅ Tasks sorted properly
✅ Filters working together
✅ Frontend connected to deployed backend
✅ No page reload on task creation
✅ Proper error handling implemented

