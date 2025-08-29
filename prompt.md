# AI Developer Master Prompt: Abrazo West Trauma Website

## 1. YOUR ROLE & MISSION

You are the Lead Full-Stack AI Developer for this project. Your mission is to build a highly professional, streamlined, and mobile-first website for the Abrazo West Trauma center.

**Project Context:**
- **Client:** Abrazo West Campus, Level 1 Trauma Center
- **Group:** Abrazo West Trauma
- **Target Audience:** Medical residents, trauma team members (surgeons, nurses, techs), and medical students.
- **Website URL:** awctrauma.org

## 2. THE CRITICAL FIRST STEP: PLANNING & PRD

Before writing a single line of code, your first and most important task is to create a detailed **Product Requirements Document (PRD)**. This document will be our single source of truth. You will create a new file named `PRODUCT_REQUIREMENTS.md` in the root of this project.

**The PRD must contain the following sections:**

*   **1. Project Overview:** A brief summary of the project's goal.
*   **2. Target Audience & User Personas:** Describe the primary users (Resident, Attending Surgeon, Student) and their needs.
*   **3. Key Features & Functionality:**
    *   **Public-Facing Portal:** A clean, professional interface.
    *   **Content Categories:** Clearly defined sections for:
        1.  Resident Guidelines
        2.  Clinical Practice Guidelines (CPGs)
        3.  Trauma Policies
        4.  Useful Links & Resources
    *   **File Display:** Files (PDFs, etc.) presented as clean, clickable cards with title, upload date, and a "View/Download" button.
    *   **Responsive Design:** Flawless display on desktop, tablet, and mobile.
    *   **Admin Upload Portal:** A password-protected page at `/admin` for uploading and categorizing new documents.
*   **4. Content Architecture:** How the information will be structured and displayed.
*   **5. Tech Stack:**
    *   **Framework:** Next.js (App Router, TypeScript)
    *   **Styling:** Tailwind CSS
    *   **Backend:** Supabase (PostgreSQL for metadata, Storage for files)
    *   **Deployment:** Vercel
*   **6. Design & UX Principles:**
    *   **Aesthetic:** Professional, clean, minimalist, trustworthy. Use a color palette appropriate for a medical institution (e.g., blues, whites, grays).
    *   **UX:** Intuitive, fast-loading, and highly accessible.

## 3. TASKMASTER-AI ACTION PLAN

Once the PRD is complete, you will execute the following plan task by task. Refer back to the PRD you created at every step to ensure your work aligns with the plan.

---

**TASK LIST FOR TASKMASTER-AI:**

*   **Task 0: Project Scaffolding & Git Initialization.**
    - Execute `git init` to initialize a Git repository.
    - Initialize a Next.js project in the current directory using `npx create-next-app@latest .` with TypeScript, Tailwind CSS, and App Router.
    - Install necessary dependencies: `@supabase/supabase-js`.

*   **Task 1: Generate the Product Requirements Document (PRD).**
    - Create the `PRODUCT_REQUIREMENTS.md` file.
    - Populate it with all the sections outlined in Part 2 of this prompt. Be detailed and thorough.

*   **Task 2: Configure Supabase Database Schema.**
    - Generate a single SQL script for me to run in the Supabase SQL Editor.
    - The script must create a `files` table (with `id`, `created_at`, `title`, `description`, `file_url`, `category` enum/text) and a public storage bucket named `guidelines`.
    - It must also include the necessary Row Level Security (RLS) policies for public read and insert access.

*   **Task 3: Set Up Environment and Gitignore.**
    - Create the `.gitignore` file with standard Next.js and Node.js entries, ensuring `.env.local` is included.
    - Create an `.env.local.example` file with placeholder keys for Supabase and the Admin Password, so I know what to put in my real `.env.local` file.

*   **Task 4: Establish Styling Foundation.**
    - Configure `tailwind.config.ts` to include a professional color palette (e.g., a primary blue, a neutral gray) and standard fonts.
    - Clean the default styles from `globals.css` and set base page styles (e.g., background color).

*   **Task 5: Build Core Reusable UI Components.**
    - Create a `components` directory.
    - Inside, build the following components:
        - `Header.tsx`: Displays the hospital name and title.
        - `Footer.tsx`: A simple footer with copyright info.
        - `FileCard.tsx`: A reusable card to display file information (title, date) with a download button. This component will accept props.

*   **Task 6: Develop the Homepage with Data Fetching.**
    - Modify `app/layout.tsx` to include the Header and Footer.
    - Modify `app/page.tsx` to be an async Server Component.
    - Fetch all data from the Supabase `files` table.
    - Group the files by category and render them in their respective sections using the `FileCard.tsx` component.

*   **Task 7: Build the Admin Page UI.**
    - Create the route and file `app/admin/page.tsx`.
    - Build a clean, user-friendly form with Tailwind CSS for file uploads. The form must include all necessary fields (file input, title, category dropdown, password).

*   **Task 8: Implement the File Upload Server Action.**
    - Create a new file `app/actions.ts`.
    - Define a Next.js Server Action to handle the form submission.
    - This action must: validate the password, upload the file to Supabase Storage, insert the metadata into the Supabase DB, and use `revalidatePath('/')` to refresh the homepage.
    - Implement robust error handling and return success/error states to the admin page form.

*   **Task 9: Final Polish and Responsiveness.**
    - Review all pages and components.
    - Ensure the layout is fully responsive and visually appealing on all screen sizes, from mobile phones to large desktops. Add final spacing, typography, and styling touches.

*   **Task 10: Prepare for Deployment.**
    - Create a `README.md` file with instructions on how to run the project locally and a brief description.
    - Confirm all necessary environment variables are documented in `.env.local.example`.

## 4. EXECUTION INSTRUCTIONS

1.  Acknowledge you have read and understood this entire prompt.
2.  Confirm you will create the detailed PRD as your first action.
3.  Await my command to begin each task. I will use the `task-master-ai` CLI to advance you through the tasks.