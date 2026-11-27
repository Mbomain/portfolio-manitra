import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Card, CardActionArea, CardContent, Skeleton, Typography } from "@mui/material";
import { createElement, type ComponentType } from "react";
import { Title, useGetIdentity, useGetList, useRedirect } from "react-admin";
import { PUBLIC_SITE_URL } from "../config";
import { resources } from "../resources";
import { CvCard } from "./CvCard";

type ResourceSummary = { name: string; options: { label: string }; icon: ComponentType };

const ONE_ITEM = { pagination: { page: 1, perPage: 1 } };

const ResourceCard = ({ name, options, icon }: ResourceSummary) => {
  const { total, isPending } = useGetList(name, ONE_ITEM);
  const redirect = useRedirect();
  return (
    <Card variant="outlined">
      <CardActionArea onClick={() => redirect("list", name)} sx={{ p: 1 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ color: "primary.main", display: "grid", placeItems: "center" }}>
            {createElement(icon)}
          </Box>
          <Box>
            <Typography variant="h5">{isPending ? <Skeleton width={32} /> : total}</Typography>
            <Typography color="text.secondary">{options.label}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const Dashboard = () => {
  const { identity } = useGetIdentity();
  return (
    <Box sx={{ py: 3 }}>
      <Title title="Tableau de bord" />
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "end", justifyContent: "space-between", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4">Salut {identity?.fullName ?? ""} 👋</Typography>
          <Typography color="text.secondary">
            Chaque modification ici apparaît directement sur le portfolio.
          </Typography>
        </Box>
        <Button variant="contained" href={PUBLIC_SITE_URL} target="_blank" rel="noopener" endIcon={<OpenInNewIcon />}>
          Voir le site
        </Button>
      </Box>
      <CvCard />
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {resources.map((resource) => (
          <ResourceCard key={resource.name} {...resource} />
        ))}
      </Box>
    </Box>
  );
};
