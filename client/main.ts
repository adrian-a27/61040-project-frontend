import "@/assets/main.css";
import "purecss";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import { argbFromHex, hexFromArgb, themeFromSourceColor } from "@material/material-color-utilities";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);

app.mount("#app");

// Get the theme from a hex color
const theme = themeFromSourceColor(argbFromHex("#372E4F"));
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const scheme = systemDark ? theme.schemes.dark : theme.schemes.light;

document.documentElement.style.setProperty("--primary", hexFromArgb(scheme.primary));
document.documentElement.style.setProperty("--on-primary", hexFromArgb(scheme.onPrimary));
document.documentElement.style.setProperty("--secondary", hexFromArgb(scheme.secondary));
document.documentElement.style.setProperty("--on-secondary", hexFromArgb(scheme.onSecondary));
document.documentElement.style.setProperty("--tertiary", hexFromArgb(scheme.tertiary));
document.documentElement.style.setProperty("--on-tertiary", hexFromArgb(scheme.onTertiary));
document.documentElement.style.setProperty("--error", hexFromArgb(scheme.error));
document.documentElement.style.setProperty("--on-error", hexFromArgb(scheme.onError));
document.documentElement.style.setProperty("--error-container", hexFromArgb(scheme.errorContainer));
document.documentElement.style.setProperty("--on-error-container", hexFromArgb(scheme.onErrorContainer));
document.documentElement.style.setProperty("--background", hexFromArgb(scheme.background));
document.documentElement.style.setProperty("--on-background", hexFromArgb(scheme.onBackground));
document.documentElement.style.setProperty("--surface", hexFromArgb(scheme.surface));
document.documentElement.style.setProperty("--on-surface", hexFromArgb(scheme.onSurface));
document.documentElement.style.setProperty("--surface-variant", hexFromArgb(scheme.surfaceVariant));
document.documentElement.style.setProperty("--on-surface-variant", hexFromArgb(scheme.onSurfaceVariant));
document.documentElement.style.setProperty("--primary-container", hexFromArgb(scheme.primaryContainer));
document.documentElement.style.setProperty("--on-primary-container", hexFromArgb(scheme.onPrimaryContainer));
document.documentElement.style.setProperty("--secondary-container", hexFromArgb(scheme.secondaryContainer));
document.documentElement.style.setProperty("--on-secondary-container", hexFromArgb(scheme.onSecondaryContainer));
document.documentElement.style.setProperty("--tertiary-container", hexFromArgb(scheme.tertiaryContainer));
document.documentElement.style.setProperty("--on-tertiary-container", hexFromArgb(scheme.onTertiaryContainer));
document.documentElement.style.setProperty("--inverse-surface", hexFromArgb(scheme.inverseSurface));
document.documentElement.style.setProperty("--inverse-primary", hexFromArgb(scheme.inversePrimary));
document.documentElement.style.setProperty("--inverse-on-surface", hexFromArgb(scheme.inverseOnSurface));

// Print out the theme as JSON
// console.log(JSON.stringify(theme, null, 2));
