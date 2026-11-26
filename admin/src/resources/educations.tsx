import SchoolIcon from "@mui/icons-material/School";
import { DataTable, SimpleForm, TextInput, required } from "react-admin";
import { crudViews } from "../components/crudViews";
import { OrderedList, PositionInput } from "../components/OrderedList";
import { RICH_TEXT_HELP } from "../components/formatting";

const EducationList = () => (
  <OrderedList>
    <DataTable>
      <DataTable.NumberCol source="position" label="#" />
      <DataTable.Col source="degree" label="Diplôme" />
      <DataTable.Col source="school" label="École" />
      <DataTable.Col source="period" label="Période" />
    </DataTable>
  </OrderedList>
);

const EducationForm = () => (
  <SimpleForm>
    <TextInput source="degree" label="Diplôme" validate={required()} />
    <TextInput source="school" label="École" validate={required()} />
    <TextInput source="period" label="Période" validate={required()} />
    <TextInput source="description" label="Description" multiline minRows={2} helperText={RICH_TEXT_HELP} />
    <PositionInput />
  </SimpleForm>
);

export const educations = {
  name: "educations",
  options: { label: "Études" },
  icon: SchoolIcon,
  ...crudViews(EducationList, EducationForm),
  recordRepresentation: "degree",
};
