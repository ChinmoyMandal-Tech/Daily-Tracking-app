# Daily Routine Tracker

A minimalist, privacy-focused habit tracking application built with React and Tailwind CSS. This app helps you track your daily routines without the bloat of modern productivity tools. It runs entirely in your browser and stores data locally.

🔗 **Live Demo:** [https://chinmoymandal-tech.github.io/Daily-Tracking-app/](https://chinmoymandal-tech.github.io/Daily-Tracking-app/)

## ✨ Key Features

* **🚫 No Login Required:** Data is stored in your browser's `localStorage`.
* **📅 Historic Data Integrity:** Uses a "Soft Delete" system. If you delete a habit from your daily view, it is preserved in your history charts.
* **💾 Backup & Restore:** Export your entire history as a JSON file to keep your data safe or transfer it to another device.
* **📊 Visual History:** View your past performance with color-coded indicators and daily remarks.
* **📱 Mobile Responsive:** Clean, distraction-free interface that works on all devices.

## 🛠️ Tech Stack

* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS (v4)
* **Icons:** Lucide React
* **Deployment:** GitHub Pages

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

* Node.js (v18 or higher)
* npm (v9 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/chinmoymandal-tech/Daily-Tracking-app.git
    cd Daily-Tracking-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    The app should now be running at `http://localhost:5173`.

## 📖 How to Use

1.  **Add a Habit:** Type a habit name (e.g., "Drink 2L Water") and press Enter or click the `+` button.
2.  **Track Progress:** Click the circle next to a habit to mark it as done for the day.
3.  **Add Remarks:** Use the text area to write notes about your day.
4.  **View History:** Switch to the "History" tab to see past days.
5.  **Backup Data:** Go to the "Data" tab and click "Download Backup" to save your progress to your computer.
