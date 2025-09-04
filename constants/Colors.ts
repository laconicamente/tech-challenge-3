import { colorsPalette } from './Pallete';

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
export const Colors = {
  light: {
    ...colorsPalette.light,
    primary: colorsPalette.light["lime.500"],
    accent: colorsPalette.light["lime.700"],
    background: colorsPalette.light.background,
    surface: colorsPalette.light["white.main"],
    text: colorsPalette.light["grey.900"],
    error: colorsPalette.light["red.200"],
    disabled: colorsPalette.light["grey.400"],
    placeholder: colorsPalette.light["grey.400"],
    onSurface: colorsPalette.light["grey.900"],
    notification: colorsPalette.light["lime.500"],
  },
  dark: {
    ...colorsPalette.dark,
    primary: colorsPalette.dark["lime.500"],
    accent: colorsPalette.dark["lime.700"],
    background: colorsPalette.dark.background,
    surface: colorsPalette.dark["black.main"],
    text: colorsPalette.dark["lime.accent"],
    error: colorsPalette.dark["red.200"],
    disabled: colorsPalette.dark["grey.400"],
    placeholder: colorsPalette.dark["grey.400"],
    onSurface: colorsPalette.dark["lime.accent"],
    notification: colorsPalette.dark["lime.500"],
  },
};

export const PaperLightTheme = {
  ...Colors.light,
  dark: false,
  roundness: 4,
  colors: {
    primary: Colors.light.primary,
    accent: Colors.light.accent,
    background: Colors.light["white.main"],
    surface: Colors.light["white.main"], // <-- fundo claro para inputs
    text: Colors.light.text,
    error: Colors.light.error,
    disabled: Colors.light.disabled,
    placeholder: Colors.light.placeholder,
    onSurface: Colors.light.onSurface,
    notification: Colors.light.notification,
  },
};

export const PaperDarkTheme = {
  ...Colors.dark,
  dark: true,
  roundness: 4,
  colors: {
    primary: Colors.dark.primary,
    accent: Colors.dark.accent,
    background: Colors.dark.background,
    surface: Colors.dark.surface,
    text: Colors.dark.text,
    error: Colors.dark.error,
    disabled: Colors.dark.disabled,
    placeholder: Colors.dark.placeholder,
    onSurface: Colors.dark.onSurface,
    notification: Colors.dark.notification,
  },
};