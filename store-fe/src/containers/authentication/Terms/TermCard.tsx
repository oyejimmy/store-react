// components/TermCard.tsx
import React from "react";
import { Card, CardContent, Box, Typography, SxProps, Theme } from "@mui/material";

interface TermCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const TermCard: React.FC<TermCardProps> = ({ icon, title, children, sx = {} }) => {
  return (
    <Card sx={sx}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {icon}
          <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TermCard;