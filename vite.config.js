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
        hmr: {
            host: "yourdomainname.com",
            port: 3001,
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