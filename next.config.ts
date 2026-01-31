const isGithubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,

  basePath: isGithubPages ? "/wedding" : "",
  assetPrefix: isGithubPages ? "/wedding/" : "",
};

export default nextConfig;
