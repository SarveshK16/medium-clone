
# Medium Clone

A clone of the popular blogging platform Medium, built with Node.js for the backend and React for the frontend.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)

## Features
- User authentication
- Create, read, update, and delete (CRUD) articles
- Follow and unfollow users
- Comment on articles

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/SarveshK16/medium-clone.git
    ```
2. Navigate to the project directory:
    ```sh
    cd medium-clone
    ```
3. Install dependencies for backend and frontend:
    ```sh
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

## Usage
1. Start the backend server:
    ```sh
    cd backend
    npm start
    ```
2. Start the frontend development server:
    ```sh
    cd frontend
    npm start
    ```
3. Open your browser and navigate to `http://localhost:3000`.

## Folder Structure
```
medium-clone/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   └── ...
├── common/
│   └── ...
└── README.md
```

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

