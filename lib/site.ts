export const SITE_NAME = "Vision Developments";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://vision-developments.vercel.app";

export const SITE_DESCRIPTION =
  "Vision Developments builds premium residential and commercial properties across Dhaka, Chittagong and Sylhet. Explore completed, ongoing and upcoming projects.";

export const LOCATIONS = [
  "Uttara",
  "Bashundhara",
  "Cantonment",
  "Niketon",
  "Gulshan",
  "Chittagong",
  "Sylhet",
] as const;

export const ADMIN_COOKIE = "vision_admin";
export const ADMIN_FLAG_KEY = "vision_admin_auth";
