/** @type {import('next').NextConfig} */
export default {
  pageExtensions: ["ts", "tsx"],
  // Keep this project's build cache separate from the stale generated .next folder.
  distDir: ".next-mavi",
  turbopack: { root: process.cwd() },
};
