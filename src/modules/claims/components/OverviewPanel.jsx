import {
  Box,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";

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

export default function OverviewPanel({
  claimDetails,
  setClaimDetails,
  engine
}) {
  const updateClaimField =
    (field) =>
    (event) => {
      setClaimDetails({
        ...claimDetails,
        [field]: event.target.value
      });
    };

  return (
    <Stack spacing={2}>
      <SectionCard
        title="Claim Overview"
        subtitle="Canonical claim information used throughout the assessment, BOQ and report."
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)"
            },
            gap: 2
          }}
        >
          <TextField
            label="Claim Number"
            value={
              claimDetails.claim || ""
            }
            onChange={
              updateClaimField("claim")
            }
          />

          <TextField
            label="Insured"
            value={
              claimDetails.insured || ""
            }
            onChange={
              updateClaimField("insured")
            }
          />

          <TextField
            label="Insurer"
            value={
              claimDetails.insurer || ""
            }
            onChange={
              updateClaimField("insurer")
            }
          />

          <TextField
            label="Policy Number"
            value={
              claimDetails.policy || ""
            }
            onChange={
              updateClaimField("policy")
            }
          />

          <TextField
            label="Reported Peril"
            value={
              claimDetails.peril || ""
            }
            onChange={
              updateClaimField("peril")
            }
          />

          <TextField
            select
            label="Workflow Stage"
            value={
              claimDetails.stage ||
              "New Instruction"
            }
            onChange={
              updateClaimField("stage")
            }
          >
            {[
              "New Instruction",
              "Inspection Scheduled",
              "Assessment in Progress",
              "Testing Required",
              "Report Review",
              "Awaiting Insurer",
              "Authorised",
              "Repudiated",
              "Completed"
            ].map((stage) => (
              <MenuItem
                key={stage}
                value={stage}
              >
                {stage}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            value={
              claimDetails.priority ||
              "Medium"
            }
            onChange={
              updateClaimField("priority")
            }
          >
            {[
              "Critical",
              "High",
              "Medium",
              "Low"
            ].map((priority) => (
              <MenuItem
                key={priority}
                value={priority}
              >
                {priority}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Assessor"
            value={
              claimDetails.assessor || ""
            }
            onChange={
              updateClaimField("assessor")
            }
          />

          <TextField
            label="Technician"
            value={
              claimDetails.technician || ""
            }
            onChange={
              updateClaimField("technician")
            }
          />

          <TextField
            label="Risk Address"
            value={
              claimDetails.location || ""
            }
            onChange={
              updateClaimField("location")
            }
          />

          <TextField
            label="Telephone"
            value={
              claimDetails.phone || ""
            }
            onChange={
              updateClaimField("phone")
            }
          />

          <TextField
            label="Email"
            value={
              claimDetails.email || ""
            }
            onChange={
              updateClaimField("email")
            }
          />

          <TextField
            type="date"
            label="Due Date"
            value={
              claimDetails.dueDate || ""
            }
            onChange={
              updateClaimField("dueDate")
            }
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            label="SLA Status"
            value={
              claimDetails.sla || ""
            }
            onChange={
              updateClaimField("sla")
            }
          />

          <TextField
            label="Invoice Status"
            value={
              claimDetails.invoiceStatus ||
              ""
            }
            onChange={
              updateClaimField(
                "invoiceStatus"
              )
            }
          />
        </Box>
      </SectionCard>

      <SectionCard
        title="Workspace Progress"
        subtitle="Overall completion calculated from assessment, testing, equipment, evidence and BOQ controls."
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography>
              Report readiness
            </Typography>

            <Typography
              sx={{
                fontWeight: 900
              }}
            >
              {engine.readiness}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={engine.readiness}
            sx={{
              height: 10,
              borderRadius: 10
            }}
          />
        </Stack>
      </SectionCard>
    </Stack>
  );
}