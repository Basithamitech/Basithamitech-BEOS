import {
  Article,
  PictureAsPdf,
  Description,
  SmartToy
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography
} from "@mui/material";

function ActionButton({
  icon,
  title,
  description,
  onClick,
  disabled
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            {icon}

            <Typography
              variant="h6"
              fontWeight={700}
            >
              {title}
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>

          <Button
            variant="contained"
            disabled={disabled}
            onClick={onClick}
          >
            Open
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ReportPanel({
  engine,
  claimDetails,
  assessment,
  equipment,
  tests,
  evidence,
  boq
}) {

  const reportSummary = {
    equipment:
      equipment?.length || 0,

    tests:
      tests?.length || 0,

    evidence:
      evidence?.length || 0,

    boq:
      boq?.length || 0
  };

  return (

    <Stack spacing={3}>

      <Card>

        <CardContent>

          <Stack spacing={2}>

            <Typography variant="h5">
              Basithami Report Centre
            </Typography>

            <Typography
              color="text.secondary"
            >
              Generate insurer-ready reports,
              quotations and technical
              documentation directly from
              the claim workspace.
            </Typography>

            <Divider />

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
            >

              <Chip
                label={`Readiness ${engine.readiness}%`}
                color={
                  engine.readiness >= 90
                    ? "success"
                    : "warning"
                }
              />

              <Chip
                label={`${reportSummary.equipment} Equipment`}
              />

              <Chip
                label={`${reportSummary.tests} Tests`}
              />

              <Chip
                label={`${reportSummary.evidence} Evidence`}
              />

              <Chip
                label={`${reportSummary.boq} BOQ Items`}
              />

            </Stack>

          </Stack>

        </CardContent>

      </Card>

      <Alert severity="info">

        These buttons are placeholders for
        the Build 013 document generation
        engine.

      </Alert>

      <Box

        sx={{

          display:"grid",

          gridTemplateColumns:{
            xs:"1fr",
            md:"repeat(2,1fr)"
          },

          gap:2

        }}

      >

        <ActionButton

          icon={<Article color="primary"/>}

          title="Insurance Report"

          description="Generate the complete Basithami V3 insurance report."

          onClick={()=>
            console.log(
              "Insurance Report",
              claimDetails
            )
          }

        />

        <ActionButton

          icon={<Description color="primary"/>}

          title="App Report"

          description="Generate the 1000-character mobile app report."

          onClick={()=>
            console.log(
              "App Report"
            )
          }

        />

        <ActionButton

          icon={<PictureAsPdf color="primary"/>}

          title="Quotation / BOQ"

          description="Generate professional quotation and BOQ."

          onClick={()=>
            console.log(
              "Quotation"
            )
          }

        />

        <ActionButton

          icon={<SmartToy color="primary"/>}

          title="AI Technical Opinion"

          description="Generate a structured technical opinion using the captured assessment."

          onClick={()=>
            console.log(
              assessment
            )
          }

        />

      </Box>

      <Card>

        <CardContent>

          <Typography
            variant="h6"
            gutterBottom
          >
            Claim Summary
          </Typography>

          <Divider sx={{mb:2}}/>

          <Stack spacing={1}>

            <Typography>

              <strong>Claim:</strong>{" "}
              {claimDetails.claim || "-"}

            </Typography>

            <Typography>

              <strong>Insured:</strong>{" "}
              {claimDetails.insured || "-"}

            </Typography>

            <Typography>

              <strong>Peril:</strong>{" "}
              {claimDetails.peril || "-"}

            </Typography>

            <Typography>

              <strong>Assessment Outcome:</strong>{" "}
              {assessment.outcome || "-"}

            </Typography>

            <Typography>

              <strong>Technical Recommendation:</strong>{" "}
              {assessment.recommendation || "-"}

            </Typography>

          </Stack>

        </CardContent>

      </Card>

    </Stack>

  );

}