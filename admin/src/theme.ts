import { alpha } from "@mui/material/styles";
import { radiantDarkTheme, radiantLightTheme, type RaThemeOptions } from "react-admin";

/** The portfolio's own colors and fonts, on top of react-admin's "radiant" theme. */
const BRAND = {
  accent: "#d9822b",
  accentLight: "#f0a050",
  accentDark: "#b0611a",
  navy: "#2b3547",
  paper: "#f6f5f1",
  night: "#11151d",
};

const typography = {
  fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
  h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
  h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
};

/** The radiant theme bakes its purple into these overrides, so they are rebuilt with the brand color. */
const brandedComponents = (base: RaThemeOptions, accent: string, onAccent: string) => ({
  ...base.components,
  MuiPaper: {
    styleOverrides: {
      root: { backgroundClip: "padding-box" },
      elevation1: {
        boxShadow: `${alpha(accent, 0.2)} -2px 2px, ${alpha(accent, 0.1)} -4px 4px, ${alpha(accent, 0.05)} -6px 6px`,
      },
    },
  },
  RaDatagrid: {
    styleOverrides: { root: { "& .RaDatagrid-headerCell": { color: accent } } },
  },
  RaMenuItemLink: {
    styleOverrides: {
      root: {
        borderLeft: "3px solid transparent",
        "&:hover": { borderRadius: "0px 100px 100px 0px" },
        "&.RaMenuItemLink-active": {
          borderLeft: `3px solid ${accent}`,
          borderRadius: "0px 100px 100px 0px",
          backgroundImage: `linear-gradient(98deg, ${BRAND.accentLight}, ${BRAND.accentDark} 94%)`,
          color: onAccent,
          "& .MuiSvgIcon-root": { fill: onAccent },
        },
      },
    },
  },
});

const withBrand = (base: RaThemeOptions, palette: RaThemeOptions["palette"], onAccent: string): RaThemeOptions => {
  const accent = (palette?.primary as { main: string }).main;
  return {
    ...base,
    palette: { ...base.palette, ...palette },
    typography: { ...base.typography, ...typography },
    shape: { borderRadius: 12 },
    components: brandedComponents(base, accent, onAccent),
  };
};

export const lightTheme = withBrand(
  radiantLightTheme,
  {
    mode: "light",
    primary: { main: BRAND.accent, light: BRAND.accentLight, dark: BRAND.accentDark, contrastText: "#fff" },
    secondary: { main: BRAND.navy },
    background: { default: BRAND.paper, paper: "#fff" },
  },
  "#fff",
);

export const darkTheme = withBrand(
  radiantDarkTheme,
  {
    mode: "dark",
    primary: { main: BRAND.accentLight, light: "#f6c08a", dark: BRAND.accent, contrastText: BRAND.night },
    secondary: { main: "#b8bfcc" },
    background: { default: BRAND.night, paper: "#1c2230" },
  },
  BRAND.night,
);
