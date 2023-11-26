import glsl from "vite-plugin-glsl";
import basicSsl from "@vitejs/plugin-basic-ssl";

const isCodeSandbox = "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default {
    root: "src/",
    publicDir: "../static/",
    base: "./",
    server:
    {
        host: true,
        open: !isCodeSandbox, // Open if it's not a CodeSandbox
        port: 3000,
        https: true,
        strictPort: true,
        hmr: {
            host: "localhost",
            port: 3000,
            protocol: "wss",
        },
    },
    build:
    {
        outDir: "../dist",
        emptyOutDir: true,
        sourcemap: true
    },
    plugins:
    [
        glsl(),
        basicSsl()
    ]
};