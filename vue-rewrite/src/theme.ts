import { definePreset } from "@primevue/themes"
import Aura from "@primevue/themes/aura"

export const themePreset = definePreset(Aura, {
  components: {
    button: {
      paddingX: "0.75rem",
      paddingY: "0.5rem",
    },
    datatable: {
      colorScheme: {
        light: {
          headerColor: "{surface.700}",
          headerCellColor: "{surface.700}",
          rowColor: "{surface.700}",
        },
        dark: {
          headerColor: "{surface.300}",
          headerCellColor: "{surface.300}",
          rowColor: "{surface.300}",
        },
      },
    },
    datepicker: {
      colorScheme: {
        light: {
          panelColor: "{surface.700}",
        },
        dark: {
          panelColor: "{surface.300}",
        },
      },
    },
    autocomplete: {
      colorScheme: {
        light: {
          overlayColor: "{surface.700}",
          optionColor: "{surface.700}",
        },
        dark: {
          overlayColor: "{surface.300}",
          optionColor: "{surface.300}",
        },
      },
    },
    select: {
      colorScheme: {
        light: {
          optionColor: "{surface.700}",
        },
        dark: {
          optionColor: "{surface.300}",
        },
      },
    },
  },
  semantic: {
    primary: {
      50: "{zinc.50}",
      100: "{zinc.100}",
      200: "{zinc.200}",
      300: "{zinc.300}",
      400: "{zinc.400}",
      500: "{zinc.500}",
      600: "{zinc.600}",
      700: "{zinc.700}",
      800: "{zinc.800}",
      900: "{zinc.900}",
      950: "{zinc.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{zinc.900}",
          inverseColor: "#ffffff",
          hoverColor: "{zinc.900}",
          activeColor: "{zinc.800}",
        },
        surface: {
          50: "{gray.50}",
          100: "{gray.100}",
          200: "{gray.200}",
          300: "{gray.300}",
          400: "{gray.400}",
          500: "{gray.500}",
          600: "{gray.600}",
          700: "{gray.700}",
          800: "{gray.800}",
          900: "{gray.900}",
          950: "{gray.950}",
        },
        text: {
          color: "{surface.700}",
          hoverColor: "{surface.800}",
          mutedColor: "{surface.500}",
          hoverMutedColor: "{surface.600}",
        },
        highlight: {
          background: "{zinc.950}",
          focusBackground: "{zinc.700}",
          color: "#ffffff",
          focusColor: "#ffffff",
        },
      },
      dark: {
        primary: {
          color: "{zinc.50}",
          inverseColor: "{zinc.950}",
          hoverColor: "{zinc.100}",
          activeColor: "{zinc.200}",
        },
        surface: {
          50: "{gray.50}",
          100: "{gray.100}",
          200: "{gray.200}",
          300: "{gray.300}",
          400: "{gray.400}",
          500: "{gray.500}",
          600: "{gray.600}",
          700: "{gray.700}",
          800: "{gray.800}",
          900: "{gray.900}",
          950: "{gray.950}",
        },
        text: {
          color: "{surface.700}",
          hoverColor: "{surface.800}",
          mutedColor: "{surface.500}",
          hoverMutedColor: "{surface.600}",
        },
        highlight: {
          background: "rgba(250, 250, 250, .16)",
          focusBackground: "rgba(250, 250, 250, .24)",
          color: "rgba(255,255,255,.87)",
          focusColor: "rgba(255,255,255,.87)",
        },
        overlay: {
          modal: {
            color: "{surface.50}",
          },
        },
      },
    },
  },
})
