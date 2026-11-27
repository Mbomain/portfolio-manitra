import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Box, Button, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import { HttpError, useNotify } from "react-admin";
import { CV_DOWNLOAD_URL, cvFileProblem, getCvInfo, uploadCv, type CvInfo } from "../providers/cv";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" });

const describe = ({ fileName, size, updatedAt }: CvInfo) =>
  `${fileName} · ${Math.round(size / 1024)} Ko · mis à jour le ${dateFormat.format(new Date(updatedAt))}`;

const uploadErrorMessage = (error: unknown) => {
  if (error instanceof HttpError && error.status === 401) {
    return "Session expirée : reconnectez-vous pour envoyer le CV.";
  }
  if (error instanceof HttpError && error.status === 400) {
    return "Ce fichier n’est pas un PDF valide.";
  }
  return "L’envoi du CV a échoué. Réessayez dans un instant.";
};

/** Shows the CV visitors download from the site, and replaces it with a new PDF. */
export const CvCard = () => {
  const notify = useNotify();
  const [cv, setCv] = useState<CvInfo | null | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getCvInfo().then(setCv, () => setCv(null));
  }, []);

  const onFileChosen = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the same file be chosen again
    if (!file) return;
    const problem = cvFileProblem(file);
    if (problem) {
      notify(problem, { type: "warning" });
      return;
    }
    setUploading(true);
    try {
      setCv(await uploadCv(file));
      notify("CV mis à jour : le site propose maintenant cette version.", { type: "success" });
    } catch (error) {
      notify(uploadErrorMessage(error), { type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
        <Box sx={{ color: "primary.main", display: "grid", placeItems: "center" }}>
          <DescriptionIcon />
        </Box>
        <Box sx={{ flex: "1 1 260px" }}>
          <Typography variant="h6">CV</Typography>
          <Typography color="text.secondary">
            {cv === undefined ? (
              <Skeleton width={280} />
            ) : cv ? (
              describe(cv)
            ) : (
              "Aucun CV envoyé : le site propose encore celui intégré à son code."
            )}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {cv && (
            <Button href={CV_DOWNLOAD_URL} startIcon={<DownloadIcon />}>
              Télécharger
            </Button>
          )}
          <Button component="label" variant="contained" startIcon={<UploadFileIcon />} disabled={uploading}>
            {uploading ? "Envoi…" : "Remplacer le CV"}
            <input hidden type="file" accept="application/pdf,.pdf" onChange={onFileChosen} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
