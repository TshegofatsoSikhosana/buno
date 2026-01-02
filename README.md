# Buno - Budgeting App

Buno is a comprehensive, local-first budgeting application designed to help you manage your finances with ease. Built with Next.js and Dexie (IndexedDB), it offers a fast, secure, and private way to track your expenses, income, investments, and more.

## Features

-   **Dashboard Overview**: Get a bird's-eye view of your financial health with intuitive charts and summaries.
-   **Expense Tracking**: Easily record and categorize your daily expenses to see where your money goes.
-   **Income Management**: Track various income sources to stay on top of your earnings.
-   **Investment Portfolio**: Keep tabs on your investments and monitor their growth.
-   **Groceries Budgeting**: Dedicated section for managing grocery lists and costs.
-   **Budget Cloning**: Quickly set up a new month's budget by cloning data from previous months.
-   **Share Budget**: Functionality to share budget details (implementation details may vary).
-   **Local-First Data**: All your data is stored locally in your browser using IndexedDB (via Dexie.js) for privacy and speed.

## Tech Stack

This project uses a modern web development stack:

-   **Framework**: [Next.js](https://nextjs.org/) (React)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Database**: [Dexie.js](https://dexie.org/) (Wrapper for IndexedDB)
-   **Charts**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
-   **Icons**: Custom SVG icons

## Getting Started

To run the application locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/TshegofatsoSikhosana/buno.git
    cd buno
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4.  **Open the app:**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
