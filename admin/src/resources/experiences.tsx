import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import {
  ArrayInput,
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

const ExperienceList = () => (
  <OrderedList>
    <DataTable>
      <DataTable.NumberCol source="position" label="#" />
      <DataTable.Col source="role" label="Poste" />
      <DataTable.Col source="organization" label="Organisation" />
      <DataTable.Col source="period" label="Période" />
      <DataTable.Col source="tag" label="Étiquette" />
    </DataTable>
  </OrderedList>
);

const ExperienceForm = () => (
  <SimpleForm>
    <TextInput source="role" label="Poste" helperText="Style nominal, ex. « Responsable relation client »" validate={required()} />
    <TextInput source="organization" label="Organisation" validate={required()} />
    <TextInput source="period" label="Période" helperText="Ex. Sept. 2025 — Oct. 2026" validate={required()} />
    <TextInput source="tag" label="Étiquette" helperText="Ex. Alternance, Leadership (facultatif)" />
    <TextInput source="summary" label="Résumé" multiline minRows={2} helperText={RICH_TEXT_HELP} />
    <ArrayInput source="highlights" label="Missions">
      <SimpleFormIterator>
        <TextInput source="" label="Mission" helperText={false} />
      </SimpleFormIterator>
    </ArrayInput>
    <TextArrayInput source="technologies" label="Technologies" />
    <PositionInput />
  </SimpleForm>
);

export const experiences = {
  name: "experiences",
  options: { label: "Parcours" },
  icon: WorkHistoryIcon,
  ...crudViews(ExperienceList, ExperienceForm),
  recordRepresentation: "role",
};
