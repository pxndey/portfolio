declare module '*.toml' {
  const content: string
  export default content
}

declare module '*.toml?raw' {
  const content: string
  export default content
}
