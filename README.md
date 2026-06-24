# DevVault (GitHub Clone)

A MERN-based GitHub replica with a custom version control system implementation. Built with a premium, IDE-like "Midnight & Slate" dark theme, it brings a sleek developer experience to version management.

## 🚀 Overview

DevVault is a full-stack platform designed to mimic the core features of GitHub. It allows developers to create repositories, track issues, submit pull requests, and manage project code within a highly responsive, modern UI built on React and Tailwind CSS.

---
## 🛠️ Tech Stack

**Frontend:**
- **React.js** (Vite)
- **Tailwind CSS** (Custom Midnight & Slate Theme)
- **React Router** for nested workspace layouts
- **Axios** for API communication

**Backend:**
- **Node.js & Express.js**
- **MongoDB** (Mongoose ORM)
- **JSON Web Tokens (JWT)** for secure authentication
- **AWS S3** for secure file and artifact storage

---

## 🌟 Features Breakdown

### 🔌 Fully Functional Features (Frontend + Backend Integration)

These features are fully wired to the MongoDB database and AWS services:

* **Authentication System:** Secure User Signup and Login flows utilizing JWT and encrypted passwords.
* **Repository Management:** 
  * Create new public/private repositories.
  * View a user's repositories on their Dashboard and Profile.
  * Fetch and view repository metadata (Description, Name, Visibility).
* **Issue Tracker:**
  * Open new issues within a specific repository.
  * Real-time listing of issues filtered by Open/Closed status.
  * Ability to toggle issue states (Close/Reopen).
* **Pull Requests (PRs):**
  * Create a new Pull Request specifying Source and Target branches.
  * View open and merged pull requests.
  * Merge pull requests directly from the dashboard.
* **File Tree Exploration:**
  * View the repository file structure and traverse the code tree.

### 🎨 Frontend-Only Features (Mock / UI Demonstrations)

These features currently showcase the premium UI design and layout, utilizing placeholder data while awaiting full backend integration:

* **Activity Feed (Dashboard):** A timeline showing user commits, PR reviews, and comments. Currently built out visually but populated with mock data.
* **Trending Statistics (Dashboard/Profile):** Star, Fork, and Watcher counts are statically rendered in the UI layout.
* **Contribution Heatmap (Profile):** The GitHub-style contribution calendar uses a randomized generation algorithm on the frontend to visualize activity.
* **Assignee/Label Filters:** The dropdowns for filtering issues and PRs by specific users and labels are UI components waiting for advanced backend search integration.
* **Inline Code Viewer Editing:** The code block renderer highlights lines and formats code beautifully, but direct browser-based editing/pushing is not yet implemented.

---

## 🎨 Design System: Midnight & Slate

The platform uses a custom, precision-crafted Tailwind design system:
- **Typography:** `Inter` for highly legible UI elements, and `JetBrains Mono` for code snippets and technical inputs.
- **Color Palette:** Deep `slate-900` (#0b1326) backgrounds with `Electric Blue` (#adc6ff) active states and primary actions.
- **Status Indicators:** Strict color-coding rules (Emerald Green for Open, Royal Purple for Merged, Error Red for Closed) applied to Tonal Chips.
- **IDE Aesthetics:** Tonal borders, 0px border-radiuses for inputs, and blurred glass panels ensure the application feels like a professional desktop utility.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB instance (local or Atlas)
- AWS Account (S3 bucket configured)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Backend Setup:**
   ```bash
   cd backend-main
   npm install
   ```
   *Create a `.env` file in `backend-main` with your MongoDB URI, JWT Secret, and AWS credentials.*
   ```bash
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend-main
   npm install
   npm run dev
   ```

4. **View the Application:**
   Open your browser and navigate to `http://localhost:5173`.
