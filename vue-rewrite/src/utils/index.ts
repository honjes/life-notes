export * from "./symptom"
export * from "./vue"
export * from "./date"
export * from "./meal"
export * from "./med"
export * from "./error"
export * from "./note"

export function randomNumber(): string {
  return Math.floor(Math.random() * 10000).toString()
}
