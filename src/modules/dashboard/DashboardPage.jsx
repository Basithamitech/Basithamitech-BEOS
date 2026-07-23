import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography
} from "@mui/material";

import { BUILD_LABEL } from "../../app/config";

export default function DashboardPage() {
  return (
    <Box
      sx={{
        padding: {
          xs: 2,
          md: 4
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap"
        }}
      >
        <Box>
          <Typography variant="h4">
            Executive Command Centre
          </Typography>

          <Typography color="text.secondary">
            Claims, evidence quality, technical delivery,
            commercial exposure and operational control.
          </Typography>
        </Box>

        <Chip
          label={BUILD_LABEL}
          color="primary"
          sx={{
            fontWeight: 900
          }}
        />
      </Box>

      <Box
        sx={{
          marginTop: 3,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 2
        }}
      >
        {[
          ["Open Claims", "42", "8 awaiting assessment"],
          ["Reports Due", "11", "3 due today"],
          ["Financial Exposure", "R 1.84m", "Across active claims"],
          ["Critical Actions", "5", "Management attention"]
        ].map(([label, value, note]) => (
          <Card key={label}>
            <CardContent>
              <Typography
                variant="overline"
                color="text.secondary"
              >
                {label}
              </Typography>

              <Typography variant="h4">
                {value}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {note}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card
        sx={{
          marginTop: 3
        }}
      >
        <CardContent>
          <Typography variant="h6">
            Milestone 1 Foundation
          </Typography>

          <Typography color="text.secondary">
            The new modular application shell, routing,
            navigation and shared theme are active.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
