import ConstructionIcon from "@mui/icons-material/Construction";
import { DataTable, SelectField, SelectInput, SimpleForm, TextInput, required } from "react-admin";
import { crudViews } from "../components/crudViews";
import { OrderedList, PositionInput } from "../components/OrderedList";

export const SKILL_LEVELS = [
  { id: "ADVANCED", name: "Avancé" },
  { id: "INTERMEDIATE", name: "Intermédiaire" },
];

const SkillList = () => (
  <OrderedList>
    <DataTable>
      <DataTable.NumberCol source="position" label="#" />
      <DataTable.Col source="name" label="Compétence" />
      <DataTable.Col source="category" label="Groupe" />
      <DataTable.Col source="level" label="Niveau">
        <SelectField source="level" choices={SKILL_LEVELS} emptyText="—" />
      </DataTable.Col>
    </DataTable>
  </OrderedList>
);

const SkillForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Compétence" validate={required()} />
    <TextInput
      source="category"
      label="Groupe"
      helperText="Ex. Langages, Frameworks, Données & outils, Humain. Vide : visible seulement dans les niveaux."
    />
    <SelectInput source="level" label="Niveau" choices={SKILL_LEVELS} emptyText="Non affiché dans les niveaux" />
    <PositionInput />
  </SimpleForm>
);

export const skills = {
  name: "skills",
  options: { label: "Compétences" },
  icon: ConstructionIcon,
  ...crudViews(SkillList, SkillForm),
  recordRepresentation: "name",
};
