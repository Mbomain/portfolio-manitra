import { Admin, Resource } from "react-admin";
import { Dashboard } from "./components/Dashboard";
import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { i18nProvider } from "./providers/i18nProvider";
import { resources } from "./resources";
import { darkTheme, lightTheme } from "./theme";

export const App = () => (
  <Admin
    title="Portfolio · Administration"
    dataProvider={dataProvider}
    authProvider={authProvider}
    i18nProvider={i18nProvider}
    dashboard={Dashboard}
    theme={lightTheme}
    darkTheme={darkTheme}
    requireAuth
  >
    {resources.map((resource) => (
      <Resource key={resource.name} {...resource} />
    ))}
  </Admin>
);
