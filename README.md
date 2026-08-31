# 📄 PaperPilot – AI-Powered Document Intelligence Platform

PaperPilot is a full-stack AI-powered document intelligence platform that helps users upload, understand, organize, and interact with their documents.

Users can upload PDF, DOCX, and TXT files, generate customized summaries, ask questions about document content using AI, search documents semantically, save important information, organize documents into workspaces, and analyze multiple documents.

PaperPilot uses a **Retrieval-Augmented Generation (RAG)** approach to provide AI responses based on the content of uploaded documents.

---

## 🚀 Key Features

### 📤 Document Management

* Secure cloud-based document storage using Backblaze B2

---

### 🤖 AI Document Chat

* Receive context-aware AI responses

---

### 📝 Customized AI Summaries

* Generate summaries according to user preferences instead of using a fixed summary format

---

### 🔎 Semantic Search

* Quickly find information across uploaded documents

---

### 📚 Workspaces

* Create and manage workspaces

---

### 📊 Multi-Document Analysis

* Compare and understand information from multiple sources in one place

---

### 🔖 Saving Documents

---

### 🔐 Authentication and Authorization

* JWT-based authentication

---

### 🔗 Document Sharing

* Generate shareable links for documents

---

## 🧠 RAG Pipeline

PaperPilot uses a **Retrieval-Augmented Generation (RAG)** pipeline to answer user questions based on uploaded documents.

```text
                 Upload Document
                        │
                        ▼
                 Text Extraction
                        │
                        ▼
                   Text Chunking
                        │
                        ▼
               Generate Embeddings
                        │
                        ▼
         Store Chunks in PostgreSQL
                with pgvector
                        │
                        ▼
                  User Question
                        │
                        ▼
             Generate Query Embedding
                        │
                        ▼
            Vector Similarity Search
                        │
                        ▼
           Retrieve Relevant Chunks
                        │
                        ▼
              Send Context to AI
                        │
                        ▼
              Context-Aware Answer
```

### How It Works

1. The user uploads a document.
2. The document text is extracted.
3. The extracted text is divided into smaller chunks.
4. An embedding is generated for each chunk.
5. The chunks and embeddings are stored in PostgreSQL using **pgvector**.
6. When a user asks a question, the question is converted into an embedding.
7. The system retrieves the most relevant document chunks using vector similarity search.
8. The retrieved content is provided to the AI model as context.
9. The AI generates a response based on the relevant document content.

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Lucide React

### Backend

* Python
* FastAPI
* SQLAlchemy
* Alembic

### Database

* PostgreSQL
* Supabase
* pgvector

### AI and RAG

* Google Gemini API
* Vector Embeddings
* Retrieval-Augmented Generation (RAG)
* Semantic Search

### Cloud Storage

* Backblaze B2

### Authentication

* JWT (JSON Web Tokens)

### Deployment

* Vercel – Frontend
* Railway – Backend
* Supabase – PostgreSQL Database

---

## 📁 Project Structure

```text
PaperPilot/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
│
└── .gitignore
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Pdanulya/PaperPilot.git
```

Navigate to the project directory:

```bash
cd PaperPilot
```

---

## 🖥 Backend Setup

### 2️⃣ Navigate to the Backend

```bash
cd backend
```

### 3️⃣ Create a Virtual Environment

```bash
python -m venv venv
```

Activate the environment.

**Windows**

```bash
venv\Scripts\activate
```

**macOS/Linux**

```bash
source venv/bin/activate
```

### 4️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 5️⃣ Configure Environment Variables

Create a `.env` file inside the `backend` directory and configure the required environment variables.

Example:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_api_key

B2_KEY_ID=your_backblaze_key_id
B2_APPLICATION_KEY=your_backblaze_application_key
B2_BUCKET_NAME=your_bucket_name
```

### 6️⃣ Run Database Migrations

```bash
alembic upgrade head
```

### 7️⃣ Start the Backend

```bash
uvicorn app.main:app --reload
```

The backend will run on:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

## 🎨 Frontend Setup

### 8️⃣ Navigate to the Frontend

Open another terminal:

```bash
cd frontend
```

### 9️⃣ Install Dependencies

```bash
npm install
```

### 🔟 Configure Environment Variables

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

### 1️⃣1️⃣ Start the Frontend

```bash
npm run dev
```

The application will run on:

```text
http://localhost:5173
```

---

## 🌐 Deployment

PaperPilot is deployed using separate services for the frontend, backend, and database.

| Service      | Platform            |
| ------------ | ------------------- |
| Frontend     | Vercel              |
| Backend      | Railway             |
| Database     | Supabase PostgreSQL |
| File Storage | Backblaze B2        |

---

