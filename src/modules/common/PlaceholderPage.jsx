import {
  Box,
  Card,
  CardContent,
  Typography
} from "@mui/material";

export default function PlaceholderPage({ title }) {
  return (
    <Box
      sx={{
        padding: {
          xs: 2,
          md: 4
        }
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: 2
        }}
      >
        {title}
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">
            {title} Module
          </Typography>

          <Typography color="text.secondary">
            The enterprise module shell is active and ready
            for the next Build 012 delivery.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
