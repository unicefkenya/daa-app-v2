# Digtial Attendance Application - Mobile Application v2

## Introduction

Digital Attendance is an open-source project supported by UNICEF Kenya through a collaboration with [Sisitech](https://sisitech.com). The platform allows tracking of individual student attendance in schools.

It is comprised of three components:
- **API**: Django Rest Framework
- **Dashboard**: Angular Web Application 
- **Application**: Ionic Hybrid Application (this project)

## Digital Attendance Journey
- [Digital Attendance Journey Journey](https://drive.google.com/file/d/17T3VT-howD86XOSYrExLVMXWiXTiXimD/view)

## User Manual
- [Onekana User Manual](https://sisitech.github.io/OnekanaDocs/)

---

# Setup Guide

## 1. Prerequisites

Before starting, ensure the following tools are installed:

- **Node.js** (v18.x or above) - [Download here](https://nodejs.org/en/download/)
- **Angular CLI** (v13.39 or above) - [Installation guide](https://angular.io/cli)
- **Ionic CLI** (v6.x or above) - [Installation guide](https://ionicframework.com/docs/cli)
- **Docker** - (Optional for Development only) [Download here](https://www.docker.com/get-started)
- **Visual Studio Code** (Optional for Development only, with Remote Development Extension) - [Download here](https://code.visualstudio.com/)

Additionally, ensure the backend API is already set up and accessible, e.g., `https://api.domain.com`.

---

## 2. Cloning the Project

Start by cloning the project repository:

```bash
git clone https://github.com/unicefkenya/daa-app-v2
cd daa-app-v2
```

---

## 3. Configuring .npmrc for Github NPM Packages

### Generating a GitHub Token

1. **Log in to GitHub**  
   Go to [GitHub](https://github.com) and log in to your account.

2. **Navigate to Personal Access Tokens:**
   - Click on your profile icon in the upper-right corner and select **Settings**.
   - In the left-hand sidebar, click **Developer settings**.
   - Under **Personal access tokens**, click on **Tokens (classic)**.
   - Click on **Generate new token**.

3. **Configure the Token:**
   - Add a descriptive note (e.g., “npm access token for SisiTech packages”).
   - Set the token expiration according to your security policy.
   - Under **Select scopes**, choose:
     - `repo` (for accessing private repositories)
     - `read:packages` (for reading package metadata)

4. **Generate and Copy the Token:**
   - After configuring the scopes, click **Generate token**.
   - Copy the generated token. **Make sure to store it securely**, as it won’t be displayed again.

### Updating the `.npmrc` File

To authenticate npm using your GitHub token:

- **Create or Update the `.npmrc` File in Your Project:**

   Navigate to your home directory and either create or update the `.npmrc` file with the following configuration:
   ```sh
    nano ~/.npmrc
   ```

   Update it with the following content, replacing `YOUR_GITHUB_TOKEN` with the actual token:
   ```ini
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   @sisitech:registry=https://npm.pkg.github.com/
   ```

This setup tells npm to use the GitHub Packages registry for all `@sisitech` scoped packages and authenticate using your token.


If the packages install without any errors, your configuration is successful. Otherwise, you will encounter a `401 Unauthorized` error for any `@sisitech` scoped packages.

---

## 4. Setting Up the Development Environment (Optional)

### DevContainer Configuration

The project also includes a `.devcontainer` configuration folder for development in Visual Studio Code. If you have the docker and Visual Sutdio Code with Remote Development extension installed:

1. Open the project in VS Code.
2. You will be prompted to “Reopen in Container” – select this option.
3. The container will be built and opened with all necessary tools installed (Node, Angular, Ionic CLI and android sdk.).
---

## 5. Configuring Environment Variables

The project’s environment configuration is stored in `src/environments/environment.ts`. Before running the application, update the environment variables:

```typescript
export const environment = {
  production: false,
  apiUrl: "https://api.domain.com",
  clientId: "CLIENT_ID_FROM_API"
};
```
---

## 6. Generating Client ID in Django Admin

To obtain the `clientId`, follow these steps:

1. Log in to your Django-admin panel: [https://api.domain.com/admin](https://api.domain.com/admin).
2. Navigate to the **API Clients** section (assuming you have set this up).
3. Create a new client or view existing ones.
4. Copy the `Client ID` and paste it into the `clientId` field in the environment configuration.

---

## 7. Installing Dependencies

Install the necessary Node modules by running:

```bash
npm install --force
```

This command will install all the dependencies specified in the `package.json` file.

---

## 8. Running the Application

Start the Ionic development server with:

```bash
ionic serve
```

The application will be accessible at `http://localhost:8100/`.

---

## 9. Learn More
- [Ionic Documentation](https://ionicframework.com/docs)
- [Angular Documentation](https://angular.io/docs)

---


##  Want to Contribute or Have Any Questions?
We welcome contributions and feedback! If you want to contribute to this project or have any questions, reach out via email at hello@sisitech.com
