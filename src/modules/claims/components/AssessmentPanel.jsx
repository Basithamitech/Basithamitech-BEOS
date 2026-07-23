import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import {
  getPerilTemplate
} from "../engine/perilTemplates";

function SectionCard({
  title,
  subtitle,
  children
}) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="h6">
            {title}
          </Typography>

          {subtitle ? (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {subtitle}
            </Typography>
          ) : null}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {children}
      </CardContent>
    </Card>
  );
}

export default function AssessmentPanel({
  claimDetails,
  assessment,
  setAssessment
}) {
  const perilTemplate =
    getPerilTemplate(
      claimDetails?.peril || ""
    );

  const updateAssessment =
    (field) =>
    (event) => {
      setAssessment({
        ...assessment,
        [field]: event.target.value
      });
    };

  return (
    <Stack spacing={2}>
      <SectionCard
        title={`${perilTemplate.label} Assessment Guidance`}
        subtitle={`BEOS detected the reported peril as ${
          claimDetails?.peril ||
          "General Assessment"
        }.`}
      >
        <Alert severity="info">
          This guidance supports the assessment process but does not replace the assessor&apos;s technical judgement.
        </Alert>

        <Box
          component="ol"
          sx={{
            mb: 0,
            pl: 3
          }}
        >
          {perilTemplate.assessmentPrompts.map(
            (prompt) => (
              <Typography
                component="li"
                key={prompt}
                sx={{
                  mb: 1
                }}
              >
                {prompt}
              </Typography>
            )
          )}
        </Box>
      </SectionCard>

      <SectionCard
        title="Technical Assessment"
        subtitle="Record the full assessment logic before generating the insurer report."
      >
        <Stack spacing={2}>
          <TextField
            multiline
            minRows={3}
            label="Background and Instruction"
            value={
              assessment.background || ""
            }
            onChange={
              updateAssessment("background")
            }
          />

          <TextField
            multiline
            minRows={3}
            label="Insured's Version"
            value={
              assessment.insuredVersion || ""
            }
            onChange={
              updateAssessment(
                "insuredVersion"
              )
            }
          />

          <TextField
            multiline
            minRows={3}
            label="Inspection Scope"
            value={
              assessment.inspectionScope || ""
            }
            onChange={
              updateAssessment(
                "inspectionScope"
              )
            }
          />

          <TextField
            multiline
            minRows={5}
            label="Technical Findings"
            value={
              assessment.findings || ""
            }
            onChange={
              updateAssessment("findings")
            }
            required
          />

          <TextField
            multiline
            minRows={3}
            label="Testing Summary"
            value={
              assessment.testsSummary || ""
            }
            onChange={
              updateAssessment(
                "testsSummary"
              )
            }
          />

          <TextField
            multiline
            minRows={3}
            label="Cause of Damage"
            value={
              assessment.cause || ""
            }
            onChange={
              updateAssessment("cause")
            }
          />

          <TextField
            multiline
            minRows={4}
            label="Technical Opinion"
            value={
              assessment.opinion || ""
            }
            onChange={
              updateAssessment("opinion")
            }
            required
          />

          <TextField
            multiline
            minRows={4}
            label="Recommendation"
            value={
              assessment.recommendation || ""
            }
            onChange={
              updateAssessment(
                "recommendation"
              )
            }
            required
          />

          <TextField
            select
            label="Assessment Outcome"
            value={
              assessment.outcome ||
              "Pending"
            }
            onChange={
              updateAssessment("outcome")
            }
          >
            {[
              "Pending",
              "Approve",
              "Approve with Conditions",
              "Partial Approval",
              "Repudiate",
              "Further Testing Required",
              "Insurer Decision Required"
            ].map((outcome) => (
              <MenuItem
                key={outcome}
                value={outcome}
              >
                {outcome}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            multiline
            minRows={3}
            label="Assessment Limitations"
            value={
              assessment.limitations || ""
            }
            onChange={
              updateAssessment(
                "limitations"
              )
            }
          />
        </Stack>
      </SectionCard>
    </Stack>
  );
}