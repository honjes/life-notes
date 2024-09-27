export * from "./symptom"
export * from "./vue"
export * from "./date"
export * from "./meal"
export * from "./med"
export * from "./error"
export * from "./note"
export * from "./backup"

/**
 * Generates a random number between 0 and 99999 as a string
 * @returns {string} random number
 */
export function randomNumber(): string {
  return Math.floor(Math.random() * 10000).toString()
}
