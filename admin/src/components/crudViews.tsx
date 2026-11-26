import type { ComponentType } from "react";
import { Create, Edit } from "react-admin";

/** The list, edit and create screens of a resource, all built on the same form. */
export const crudViews = (List: ComponentType, Form: ComponentType) => ({
  list: List,
  edit: () => (
    <Edit mutationMode="pessimistic">
      <Form />
    </Edit>
  ),
  create: () => (
    <Create redirect="list">
      <Form />
    </Create>
  ),
});
