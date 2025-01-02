# ElectroReact App

This project integrates **React** with **Electron** to create a cross-platform desktop application. It runs a React app inside an Electron window, providing a seamless development and production build setup.

## Prerequisites

Before you get started, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v20.18.1 or later)
- [npm](https://www.npmjs.com/) (comes bundled with Node.js)

## Installation

Follow these steps to get the project up and running locally.

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Dhanesh-Pottekula/MotionEase.git
   cd MotionEase
Install the required dependencies
npm install

development
bash
Copy code
npm run electron

This will start:
The React development server on http://localhost:3000.
The Electron app, loading the React app inside the Electron window.

Build the React App
bash
Copy code
npm run build
This builds the React app and outputs the optimized files into the /build/ directory, which will later be bundled with Electron.

Build the Electron App for Production
Once the React app is built, package the Electron app for production with:

bash
Copy code
npm run app:dist
This will:

Build the React app (if not already built).
Use electron-builder to package the Electron app into a distributable format.
The final Electron app will be located in the /dist/ directory.

Folder Structure
Here’s the breakdown of the project structure:

plaintext
Copy code
MotionEase/
├── /build/               # Production build of the React app
├── /public/              # Static files (including index.html)
├── /src/                 # Source code of the React app
├── /dist/                # Electron app distribution files
├── package.json          # Project configuration and dependencies
├── README.md             # Project documentation
Distribution Files
Once the Electron app is packaged, you'll find the distribution files in the /dist/ directory:

macOS: /dist/macOS64/MotionEase.dmg (macOS installer)
Windows: /dist/windows64/MotionEaseSetup.exe (Windows installer)
To install the app:

For macOS, open the .dmg file and follow the installation steps.
For Windows, run the .exe installer.
After installation, the app can be run just like any other native application.


Command	Description
npm install	Installs the necessary dependencies for the project.
npm run electron	Starts the local React development server and the Electron app simultaneously.
npm run build	Builds the React app for production.
npm run app:dist	Packages the Electron app into a distributable format for production.
