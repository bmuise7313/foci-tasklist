# Foci Coding Assessment - Task List

This project is a task management application built with Angular for the frontend and a Node.js/Express API for the backend. It allows users to manage tasks with features such as adding, editing, deleting, and filtering tasks.

## Prerequisites

To run this application, ensure the following are installed on your system:
- --Node.js--: Version 18.19 or higher (Developed on version 24.0.1)
- --npm--: Comes bundled with Node.js

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/bmuise7313/foci-tasklist
   cd foci-tasklist

2. Install the required dependencies:
   ```
   npm install

## Running the Application

- To start both the API server and the Angular development server, run the following command:
    ```
    npm run start:all
    

This command will:

 - Start the API server on port 3000 using npx ts-node src/api/api.ts.
 - Start the Angular development server on port 4200 using ng serve.
 - Automatically open the application in your default browser at http://localhost:4200.

 ## Individual Commands
If you prefer to run the API and frontend servers separately, use the following commands:

 - Start the API server:
    ```
    npm run start:api

 - Start the Angular development server:
    ```
    npm run start:client
    
## Application Details
 - API Server: Runs on http://localhost:3000
 - Web Application: Runs on http://localhost:4200

## Features
- Add, edit, delete, and filter tasks
- Filter tasks by:
    - Completed
    - Incomplete
    - Overdue
- Tasks are sorted by due date, with tasks without a due date appearing at the bottom.

## System Requirements
- Operating System: Windows, macOS, or Linux
- Browser: A modern browser (e.g., Chrome, Edge, Firefox)