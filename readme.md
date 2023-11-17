# Three.js Starter
This is a starter project for creating 3D web applications using [Three.js](https://threejs.org/). It includes a basic setup for a local development server and a build process for creating a production-ready version of the application.

## Features
- [x] Basic multi-file architecture
- [x] Typescript 
- [x] 3D World with mutiple basic examples
- [x] Post Processing pipeline
- [x] Microphone input handling


## Setup
To get started, you'll need to have [Node.js](https://nodejs.org/en/download/) installed on your machine.
Once you have Node.js installed, you can run the following commands to set up the project:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Development
To start developing your application, you can edit the files in the src/ directory. The index.js file is the entry point for your application, and you can add additional files as needed.

When you run npm run dev, a local development server will be started at http://localhost:8080. Any changes you make to your files will be automatically reloaded in the browser.

## Production
When you're ready to deploy your application, you can run npm run build to create a production-ready version of your application in the dist/ directory. This will create a minified and optimized version of your code that you can deploy to a web server.

## License
This project is licensed under the MIT License - see the LICENSE file for details.