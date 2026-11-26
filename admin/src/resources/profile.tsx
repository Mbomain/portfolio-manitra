import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InsightsIcon from "@mui/icons-material/Insights";
import TranslateIcon from "@mui/icons-material/Translate";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { DataTable, NumberInput, SimpleForm, TextInput, required } from "react-admin";
import { crudViews } from "../components/crudViews";
import { OrderedList, PositionInput } from "../components/OrderedList";

const LabelWithEmojiList = () => (
  <OrderedList>
    <DataTable>
      <DataTable.NumberCol source="position" label="#" />
      <DataTable.Col source="emoji" label="" />
      <DataTable.Col source="label" label="Libellé" />
    </DataTable>
  </OrderedList>
);

const LabelWithEmojiForm = () => (
  <SimpleForm>
    <TextInput source="emoji" label="Emoji" helperText="Ex. 🎵 (Windows + . pour ouvrir le clavier d’emojis)" />
    <TextInput source="label" label="Libellé" validate={required()} />
    <PositionInput />
  </SimpleForm>
);

const LanguageList = () => (
  <OrderedList>
    <DataTable>
      <DataTable.NumberCol source="position" label="#" />
      <DataTable.Col source="name" label="Langue" />
      <DataTable.Col source="level" label="Niveau" />
      <DataTable.NumberCol source="proficiency" label="Barre (%)" />
    </DataTable>
  </OrderedList>
);

const LanguageForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Langue" validate={required()} />
    <TextInput source="level" label="Niveau affiché" helperText="Ex. Maternelle, B2" validate={required()} />
    <NumberInput source="proficiency" label="Remplissage de la barre (%)" min={0} max={100} validate={required()} />
    <PositionInput />
  </SimpleForm>
);

const KeyFigureList = () => (
  <OrderedList>
    <DataTable>
      <DataTable.NumberCol source="position" label="#" />
      <DataTable.NumberCol source="value" label="Valeur" />
      <DataTable.Col source="suffix" label="Suffixe" />
      <DataTable.Col source="label" label="Libellé" />
    </DataTable>
  </OrderedList>
);

const KeyFigureForm = () => (
  <SimpleForm>
    <NumberInput source="value" label="Valeur" min={0} validate={required()} />
    <TextInput source="suffix" label="Suffixe" helperText="Ex. « + » ou « ans » (avec l’espace si besoin)" />
    <TextInput source="label" label="Libellé" multiline validate={required()} />
    <PositionInput />
  </SimpleForm>
);

export const keyFigures = {
  name: "key-figures",
  options: { label: "Chiffres clés" },
  icon: InsightsIcon,
  recordRepresentation: "label",
  ...crudViews(KeyFigureList, KeyFigureForm),
};

export const languages = {
  name: "languages",
  options: { label: "Langues" },
  icon: TranslateIcon,
  recordRepresentation: "name",
  ...crudViews(LanguageList, LanguageForm),
};

export const interests = {
  name: "interests",
  options: { label: "Centres d’intérêt" },
  icon: EmojiEventsIcon,
  recordRepresentation: "label",
  ...crudViews(LabelWithEmojiList, LabelWithEmojiForm),
};

export const licenses = {
  name: "licenses",
  options: { label: "Permis" },
  icon: TwoWheelerIcon,
  recordRepresentation: "label",
  ...crudViews(LabelWithEmojiList, LabelWithEmojiForm),
};
