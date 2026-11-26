import jsonServerProvider from "ra-data-json-server";
import { fetchUtils } from "react-admin";
import { API_URL } from "../config";
import { session } from "./session";

/** Sends the admin's token along with every request, when there is one. */
export const authorizedFetch = (url: string, options: fetchUtils.Options = {}) => {
  const current = session.current();
  return fetchUtils.fetchJson(url, {
    ...options,
    user: { authenticated: Boolean(current), token: `Bearer ${current?.token}` },
  });
};

export const dataProvider = jsonServerProvider(API_URL, authorizedFetch);
