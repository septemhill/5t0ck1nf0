# qDash - A Modern Dashboard Application

qDash is a responsive dashboard front-end project built with Next.js, TypeScript, and Tailwind CSS. It features a highly functional and customizable sidebar, and is automatically deployed to GitHub Pages via GitHub Actions. The project also includes a scheduled task for periodically fetching and updating data.

## ✨ Features

*   **Responsive Design:** Great user experience on both desktop and mobile devices.
*   **Collapsible Sidebar:** A highly configurable sidebar supporting multiple modes (fixed, floating, inset) and states (expanded, collapsed, icon-only). See [`/components/ui/sidebar.tsx`](/components/ui/sidebar.tsx) for details.
*   **Theming:** Easily customize the look and feel using CSS variables.
*   **Automated Deployment:** Automatically deploys to GitHub Pages when code is pushed to the `main` branch.
*   **Scheduled Data Updates:** Automatically updates data daily via a scheduled GitHub Actions task.
*   **Keyboard Shortcuts:** Quickly toggle the sidebar with `Cmd/Ctrl + B`.

## 🛠️ Tech Stack

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui
*   **Icons:** Lucide React
*   **Package Manager:** pnpm

## 🚀 Getting Started

Follow these steps to set up the project in your local environment.

### Prerequisites

*   Node.js (v20.x or later)
*   pnpm (v9.x or later)

### Installation

1.  Clone the repository (remember to replace `your-username/qdash` with your actual repository path):
    ```bash
    git clone https://github.com/your-username/qdash.git
    cd qdash
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Set up environment variables:
    Copy `.env.example` to `.env.local` and fill in the necessary API keys.
    ```bash
    cp .env.example .env.local
    ```
    The `ALPHAVANTAGE_API_KEY` is required to run the scheduled task (`pnpm run schedule`).

4.  Start the development server:
    ```bash
    pnpm run dev
    ```

Open `http://localhost:3000` in your browser to see the result.

## 📜 Available Scripts

*   `pnpm dev`: Starts the application in development mode.
*   `pnpm build`: Builds the application for production.
*   `pnpm start`: Starts the production server.
*   `pnpm lint`: Lints the code using ESLint.
*   `pnpm schedule`: Executes the scheduled data update script.

## 🚢 Deployment

This project is configured with a GitHub Actions CI/CD workflow (defined in `.github/workflows/deploy.yml`).

*   When new commits are pushed to the `main` branch, it automatically builds and deploys to the `gh-pages` branch.
*   A daily scheduled job runs the `pnpm run schedule` script to update data. If there are changes, it automatically commits and pushes them, which in turn triggers a new deployment.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License.
