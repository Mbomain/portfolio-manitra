import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import {
  ArrayInput,
  BooleanField,
  BooleanInput,
  ChipField,
  DataTable,
  SimpleForm,
  SimpleFormIterator,
  TextArrayInput,
  TextInput,
  required,
} from "react-admin";
import { crudViews } from "../components/crudViews";
import { OrderedList, PositionInput } from "../components/OrderedList";
import { RICH_TEXT_HELP } from "../components/formatting";

const ProjectList = () => (
  <OrderedList>
    <DataTable>
      <DataTable.NumberCol source="position" label="#" />
      <DataTable.Col source="title" label="Projet" />
      <DataTable.Col source="category" label="Catégorie">
        <ChipField source="category" size="small" />
      </DataTable.Col>
      <DataTable.Col source="period" label="Période" />
      <DataTable.Col source="featured" label="À la une">
        <BooleanField source="featured" />
      </DataTable.Col>
    </DataTable>
  </OrderedList>
);

const ProjectForm = () => (
  <SimpleForm>
    <TextInput source="title" label="Titre" validate={required()} />
    <TextInput source="category" label="Catégorie" helperText="Ex. Full-Stack, Back-end, Desktop" validate={required()} />
    <TextInput source="period" label="Période" helperText="Ex. 2025 — 2026" validate={required()} />
    <BooleanInput source="featured" label="Mettre à la une (grande carte)" />
    <TextInput source="summary" label="Résumé sur la carte" multiline minRows={2} validate={required()} />
    <TextArrayInput source="technologies" label="Technologies" helperText="Appuyez sur Entrée après chaque technologie." />
    <TextInput source="details" label="Détails (fenêtre agrandie)" multiline minRows={8} helperText={RICH_TEXT_HELP} />
    <ArrayInput source="links" label="Liens">
      <SimpleFormIterator inline>
        <TextInput source="label" label="Texte du bouton" validate={required()} />
        <TextInput source="url" label="Adresse" type="url" validate={required()} />
      </SimpleFormIterator>
    </ArrayInput>
    <PositionInput />
  </SimpleForm>
);

export const projects = {
  name: "projects",
  options: { label: "Projets" },
  icon: FolderSpecialIcon,
  ...crudViews(ProjectList, ProjectForm),
  recordRepresentation: "title",
};
