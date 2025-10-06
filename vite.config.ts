import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // When deploying to GitHub Pages the site is served from https://<user>.github.io/<repo>/
  // We set the base path only for production builds (build command) and when a REPO_NAME env var is present.
  // In GitHub Actions we can inject REPO_NAME with: echo "REPO_NAME=${{ github.event.repository.name }}" >> $GITHUB_ENV
  const repoName = process.env.REPO_NAME;
  const customDomain = process.env.CUSTOM_DOMAIN; // When set we serve from root
  const isProd = mode === "production";
  return {
    server: {
      host: "::",
      port: 8080,
    },
    // If a custom domain is configured we serve from root '/'; otherwise use repo sub-path
    base: isProd && !customDomain && repoName ? `/${repoName}/` : undefined,
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
