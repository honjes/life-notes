import { on } from "pouchdb"

export const defaultSizeVariables = {
  "icon-size": "2em",
  "border-radius": "0.5rem",
}

export function getTheme(theme: "dark" | "light", options = { variables: { ...defaultSizeVariables } }) {
  if (theme === "light") {
    return {
      dark: false,
      colors: {
        primary: "#212121",
        secondary: "#212121",
        accent: "#212121",
        error: "#d32e2e",
        onError: "#ffffff",
        warning: "#f47a00",
        onWarning: "#000000",
        info: "#0288d1",
        onInfo: "#000000",
        success: "#378e3c",
        onSuccess: "#000000",
      },
      variables: options.variables,
    }
  }
  return {
    dark: true,
    colors: {
      primary: "#212121",
      secondary: "#212121",
      accent: "#212121",
      error: "#d32e2e",
      onError: "#ffffff",
      warning: "#f47a00",
      onWarning: "#000000",
      info: "#0288d1",
      onInfo: "#000000",
      success: "#378e3c",
      onSuccess: "#000000",
    },
    variables: {
      "overlay-opacity": 0.15,
      "activated-opacity": 0.4,
      "theme-overlay-multiplier": 1,
      "theme-active-background": "var(--v-primary-base)",
      "theme-active-color": "var(--v-primary-base)",
      ...options.variables,
    },
  }
}

export const lightTheme = getTheme("light")

export const darkTheme = getTheme("dark")
