import { HttpError } from "react-admin";
import { API_URL } from "../config";
import { authorizedFetch } from "./dataProvider";

export type CvInfo = { fileName: string; size: number; updatedAt: string };

export const MAX_CV_SIZE = 5 * 1024 * 1024;

/** Where visitors of the public site download the CV. */
export const CV_DOWNLOAD_URL = `${API_URL}/cv`;

/** The current CV, or null when none has been uploaded yet. */
export const getCvInfo = async (): Promise<CvInfo | null> => {
  try {
    const { json } = await authorizedFetch(`${API_URL}/cv/info`);
    return json as CvInfo;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

/** Why the file cannot be the CV, or null when it can. */
export const cvFileProblem = (file: File): string | null => {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Le CV doit être un fichier PDF.";
  }
  if (file.size > MAX_CV_SIZE) {
    return "Le CV ne doit pas dépasser 5 Mo.";
  }
  return null;
};

export const uploadCv = async (file: File): Promise<CvInfo> => {
  const body = new FormData();
  body.append("file", file);
  const { json } = await authorizedFetch(`${API_URL}/cv`, { method: "PUT", body });
  return json as CvInfo;
};
