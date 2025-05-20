# Full Stack Blog Editor with Auto-Save Draft Feature

## Project Overview
This project is a full-stack blog editor application that enables users to write, edit, save drafts, and publish blog posts. It includes an auto-save draft feature to improve user experience and data safety. The app separates published blogs and drafts and supports editing existing posts. It also features protected APIs using JWT authentication and visual notifications for auto-saving.

---

## Tech Stack

- **Frontend:** Next.js (React framework)
- **Backend:** Next.js API Routes (Node.js, Express-like)
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JWT-based token authentication
- **Libraries & Tools:**
  - React Hooks for state management
  - Rich text editor (Tiptap)
  - Fetch API for RESTful calls
  - `jsonwebtoken` and `jose` for JWT verification
  - Debounce utility (custom) for auto-save
  - Toast notifications (react-toastify)
  - ESLint & Prettier for code quality

---

## Features

### Frontend

- Blog Editor page with:
  - Title input
  - Rich text content editor
  - Tags input 
- Save as Draft button
- Publish button
- Auto-save draft:
  - Automatically saves draft every 30 seconds
  - Auto-saves 5 seconds after user stops typing (debounced)
- List view of all blogs, with drafts and published posts separated
- Ability to edit/update existing drafts and published blogs
- Protected routes/components: Only logged-in users can create/edit blogs
- Visual notifications for auto-save success and errors

### Backend

- REST API endpoints:
  - `POST /api/blogs/save-draft` — Save or update a draft blog
  - `POST /api/blogs/publish` — Save and publish a blog post
  - `GET /api/blogs/:id` — Retrieve a single blog by ID
  - `GET /api/blogs` — Retrieve all blogs (drafts and published)
  - `GET /api/my-blogs` — Retrieve my all blogs (drafts and published)
  - `GET /api/user` — Retrieve user information
  - `GET /api/user/login` — Log in user
  - `GET /api/user/register` — Register new user
- Blog schema with fields:
  - `user` (which user owns this blog)
  - `id` (unique identifier)
  - `title` (string)
  - `content` (string, rich text HTML)
  - `tags` (array of strings)
  - `status` (enum: draft or published)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
- User schema with fields:
  - `id` (unique identifier)
  - `firstName` (string)
  - `lastName` (string, rich text HTML)
  - `blogs` (array of Blog)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
- JWT authentication protects API endpoints
- Data validation and error handling in API routes

---

### 🧪 Testing Credentials

Use the following dummy credentials to test the app:

- **Email:** Dfddfudgfgf@vb.dfss
- **Password:** 123ABCabc

---

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- Environment variables configured (see below)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dhruvjindal555/Blog-site.git
   cd blog-editor
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add the following variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and visit `http://localhost:3000`

---

## Usage

- Register or log in to access blog editor features.
- Use the editor page to write your blog title, content, and tags.
- Drafts are auto-saved as you type or every 30 seconds.
- You can manually save drafts or publish your blog.
- View all blogs on the listing page, with drafts and published blogs shown separately.
- Edit existing blogs by selecting them from the list.

---

## Bonus Features Implemented

- Debounced auto-save after 5 seconds of inactivity
- Auto-save every 30 seconds interval
- Visual toast notifications confirming auto-save success or failure
- JWT token-based authentication protecting sensitive API endpoints
- Clean separation of concerns between frontend and backend
- Responsive UI for seamless use on desktop and mobile devices

---

## Project Structure

```
/app
  /api
    /blogs
      /save-draft.ts
        - route.ts
      /publish.ts
        - route.ts
      /[id].ts
        - route.ts
      - route.ts
    /my-blogs
      - route.ts
    /user
      - route.ts
      /login
        - route.ts
      /register
        - route.ts
  /blogs
  /my-blogs
  /register
  /login
  - app.tsx
  - layout.tsx
/components
  /ui
  - BlogCard.tsx
  - BlogEditModal.tsx
  - MenuBar.tsx
  - TextEditor.tsx
/lib
  - dbConnect.ts (MongoDB connection)
middleware.ts
/models
  - BlogModal.ts
  - UserModal.ts
/utils
  - debounce.ts
  - notifications.ts
```

---

## License

This project is licensed under the MIT License.

---

## Contact

Created by Dhruv Jinal - feel free to contact me at dhruvjindal546@gmail.com  
GitHub: [dhruvjindal555](https://github.com/dhruvjindal555)

---

Thank you for reviewing my project!
