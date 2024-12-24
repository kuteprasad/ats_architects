# Contributing to ATS Project

Thank you for your interest in contributing to the ATS (Applicant Tracking System) project! We welcome contributions that improve the project or fix issues. Please read the following guidelines to ensure smooth collaboration.

## Repository

This project is hosted on GitHub: [https://github.com/kuteprasad/ats_architects](https://github.com/kuteprasad/ats_architects)

## How to Contribute

### 1. Fork the Repository

Click the "Fork" button on the top right of the repository to create your own copy of the project.

### 2. Clone Your Fork

Clone the repository to your local machine using:

```bash
git clone https://github.com/<your-username>/ats_architects.git
```

### 3. Install Dependencies

After cloning the repository, follow these steps:

In the root folder, open the terminal and run the following command to install all required modules and libraries:

```bash
npm run installModules
```

### 4. Setup Environment Variables

Navigate to the server folder and create a `.env` file by copying the `.env.example` file. Set up the environment variables inside the `.env` file according to your local configuration.

### 5. Checkout the Appropriate Branch

Make sure you are on the appropriate branch before starting your development work. You can create a new branch or work on an existing one:

```bash
git checkout -b feature/your-feature-name
```

### 6. Run the Project

To run the project locally, follow these commands depending on your operating system:

For Windows:
```bash
npm run dev
```

For Mac:
```bash
npm run devm
```

### 7. Commit Your Changes

After making changes, commit them with clear and descriptive messages:

```bash
git add .
git commit -m "Add feature: brief description"
```

### 8. Push Your Changes

Push your branch to your forked repository:

```bash
git push origin feature/your-feature-name
```

### 9. Create a Pull Request

Go to your forked repository on GitHub and click "Compare & Pull Request". Provide a detailed description of what your pull request does.

## Code Style

- Follow consistent code formatting and naming conventions
- Write clean, readable code with comments where necessary
- Adhere to JavaScript and React best practices

## API Guidelines

- The project integrates Google APIs, so make sure to read and comply with their terms of service
- Document any new API endpoints you create and include example usage

## Issue Tracker

If you encounter any issues or bugs, please open an issue on the repository before submitting a pull request. This will help us track any potential problems and assign tasks more efficiently.

## Community

- Be respectful and polite in your communication
- Provide constructive feedback and help others when possible

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
