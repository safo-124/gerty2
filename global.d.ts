declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "stockfish" {
  // Minimal type for the factory function returning a worker-like engine
  type EngineLike = { postMessage: (cmd: string) => void; onmessage: (e: string | { data: string }) => void; terminate?: () => void }
  const stockfishFactory: () => EngineLike
  export default stockfishFactory
}
