import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // When deploying to GitHub Pages the site is served from https://<user>.github.io/<repo>/
  // We set the base path only for production builds (build command) and when a REPO_NAME env var is present.
  // In GitHub Actions we can inject REPO_NAME with: echo "REPO_NAME=${{ github.event.repository.name }}" >> $GITHUB_ENV
  const repoName = process.env.REPO_NAME;
  const customDomainEnv = process.env.CUSTOM_DOMAIN; // optional manual override
  // Detect custom domain by presence of a CNAME file committed (root or public/)
  const hasCname =
    fs.existsSync(path.resolve(__dirname, "CNAME")) ||
    fs.existsSync(path.resolve(__dirname, "public/CNAME"));
  const isProd = mode === "production";
  return {
    server: {
      host: "::",
      port: 8080,
    },
    // If a custom domain (detected or via env) is present we serve from root '/'; otherwise use repo sub-path.
    // This prevents broken asset URLs like /kort-phishing-boost/... on a custom apex domain.
    base:
      isProd && !(hasCname || customDomainEnv) && repoName
        ? `/${repoName}/`
        : "/",
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
