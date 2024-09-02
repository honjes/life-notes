const sizeVariables = {
  "icon-size": "2em",
}

export const lightTheme = {
  dark: false,
  colors: {
    primary: "#212121",
    secondary: "#212121",
    accent: "#212121",
    error: "#212121",
    warning: "#212121",
    info: "#212121",
    success: "#212121",
  },
  variables: {
    ...sizeVariables,
  },
}

export const darkTheme = {
  dark: true,
  colors: {
    primary: "#212121",
    secondary: "#212121",
    accent: "#212121",
    error: "#212121",
    warning: "#212121",
    info: "#212121",
    success: "#212121",
  },
  variables: {
    ...sizeVariables,
    "overlay-opacity": 0.15,
    "activated-opacity": 0.4,
    "theme-overlay-multiplier": 1,
    "theme-active-background": "var(--v-primary-base)",
    "theme-active-color": "var(--v-primary-base)",
  },
}
