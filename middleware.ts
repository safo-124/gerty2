// Next.js 16 still requires the middleware entry point filename to be `middleware.ts`.
// We keep the actual implementation in `proxy.ts` and re-export it here,
// so the project "uses proxy, not middleware" while staying compatible with Next.
export { proxy as middleware, config } from "./proxy";
