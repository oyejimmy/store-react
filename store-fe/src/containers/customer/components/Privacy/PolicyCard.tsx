// components/PolicyCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface PolicyCardProps {
  icon: SvgIconComponent;
  title: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const PolicyCard: React.FC<PolicyCardProps> = ({
  icon: Icon,
  title,
  children,
  sx = {},
}) => {
  return (
    <Card sx={sx}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Icon sx={{ mr: 2, color: "primary.main" }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1">{children}</Typography>
      </CardContent>
    </Card>
  );
};

export default PolicyCard;
