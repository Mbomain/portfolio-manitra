import type { ReactNode } from "react";
import { List, NumberInput, type ListProps } from "react-admin";

/** Lists a resource the way the public site shows it: by display position. */
export const OrderedList = ({ children, ...props }: ListProps & { children: ReactNode }) => (
  <List sort={{ field: "position", order: "ASC" }} perPage={25} {...props}>
    {children}
  </List>
);

export const PositionInput = () => (
  <NumberInput
    source="position"
    label="Ordre d’affichage"
    min={0}
    defaultValue={0}
    helperText="Les plus petits numéros s’affichent en premier."
  />
);
