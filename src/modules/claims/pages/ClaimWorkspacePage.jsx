import {
  Add,
  ArrowBack,
  Assessment,
  Build,
  Calculate,
  CheckCircle,
  DeleteOutline,
  Description,
  Devices,
  ErrorOutline,
  PhotoCamera,
  Science,
  Save
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getClaimById,
  updateClaim
} from "../../../services/claimRepository";

import {
  money,
  priorityColor,
  stageColor
} from "../../../utils/claimFormatters";

import {
  usePersistentState
} from "../../../hooks/usePersistentState";

import {
  buildClaimEngine
} from "../engine/buildClaimEngine";

const workspaceSections = [
  {
    key: "overview",
    label: "Overview",
    icon: <Assessment fontSize="small" />
  },
  {
    key: "assessment",
    label: "Assessment",
    icon: <Build fontSize="small" />
  },
  {
    key: "testing",
    label: "Testing",
    icon: <Science fontSize="small" />
  },
  {
    key: "equipment",
    label: "Equipment",
    icon: <Devices fontSize="small" />
  },
  {
    key: "photos",
    label: "Photos",
    icon: <PhotoCamera fontSize="small" />
  },
  {
    key: "boq",
    label: "BOQ",
    icon: <Calculate fontSize="small" />
  },
  {
    key: "reports",
    label: "Reports",
    icon: <Description fontSize="small" />
  }
];

const emptyAssessment = {
  background: "",
  insuredVersion: "",
  inspectionScope: "",
  findings: "",
  testsSummary: "",
  cause: "",
  opinion: "",
  recommendation: "",
  outcome: "Pending",
  limitations: ""
};

const emptyTest = {
  id: "",
  test: "",
  instrument: "",
  expected: "",
  actual: "",
  status: "Pending",
  notes: ""
};

const emptyEquipment = {
  id: "",
  category: "",
  description: "",
  make: "",
  model: "",
  serial: "",
  serialStatus: "Available",
  condition: "",
  decision: "Pending",
  notes: ""
};

const emptyEvidence = {
  id: "",
  title: "",
  description: "",
  category: "General",
  includeInReport: true
};

const emptyBoqItem = {
  id: "",
  description: "",
  unit: "Ea",
  quantity: 1,
  rate: 0,
  scope: "Replacement",
  authorised: false
};

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function SectionCard({
  title,
  subtitle,
  action,
  children
}) {
  return (
    <Card>
      <CardContent>
        <Stack
          direction={{
            xs: "column",
            md: "row"
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center"
          }}
          spacing={2}
        >
          <Box>
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
          </Box>

          {action}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {children}
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  buttonLabel,
  onClick
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        textAlign: "center",
        borderStyle: "dashed"
      }}
    >
      <Typography variant="h6">
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 1,
          mb: 2
        }}
      >
        {description}
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onClick}
      >
        {buttonLabel}
      </Button>
    </Paper>
  );
}

export default function ClaimWorkspacePage() {
  const {
    id
  } = useParams();

  const navigate = useNavigate();

  const claim = useMemo(
    () => getClaimById(id),
    [id]
  );

  const [
    activeSection,
    setActiveSection
  ] = useState("overview");

  const [
    claimDetails,
    setClaimDetails
  ] = usePersistentState(
    `beos012-claim-details-${id}`,
    claim || {}
  );

  const [
    assessment,
    setAssessment
  ] = usePersistentState(
    `beos012-assessment-${id}`,
    emptyAssessment
  );

  const [
    tests,
    setTests
  ] = usePersistentState(
    `beos012-tests-${id}`,
    []
  );

  const [
    equipment,
    setEquipment
  ] = usePersistentState(
    `beos012-equipment-${id}`,
    []
  );

  const [
    evidence,
    setEvidence
  ] = usePersistentState(
    `beos012-evidence-${id}`,
    []
  );

  const [
    boq,
    setBoq
  ] = usePersistentState(
    `beos012-boq-${id}`,
    []
  );

  const [
    saveStatus,
    setSaveStatus
  ] = useState("Saved");

  const engine = useMemo(
    () =>
      buildClaimEngine({
        assessment,
        tests,
        equipment,
        evidence,
        boq
      }),
    [
      assessment,
      tests,
      equipment,
      evidence,
      boq
    ]
  );

  useEffect(() => {
    if (!claim) {
      return;
    }

    setClaimDetails(
      (current) => ({
        ...claim,
        ...current
      })
    );
  }, [claim]);

  useEffect(() => {
    if (!claimDetails?.id) {
      return;
    }

    setSaveStatus("Saving");

    const timeout = setTimeout(() => {
      updateClaim(
        claimDetails.id,
        {
          ...claimDetails,
          value:
            engine.totalIncludingVat,
          reportStatus:
            engine.reportReady
              ? "Ready for generation"
              : "Draft in progress"
        }
      );

      setSaveStatus("Saved");
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    claimDetails,
    engine.totalIncludingVat,
    engine.reportReady
  ]);

  if (!claim) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          The requested claim could not be found.
        </Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/claims")
          }
        >
          Return to Claims Register
        </Button>
      </Box>
    );
  }

  const updateClaimField =
    (field) =>
    (event) => {
      setClaimDetails({
        ...claimDetails,
        [field]: event.target.value
      });
    };

  const updateAssessment =
    (field) =>
    (event) => {
      setAssessment({
        ...assessment,
        [field]: event.target.value
      });
    };

  const addTest = () => {
    setTests([
      ...tests,
      {
        ...emptyTest,
        id: createId("test")
      }
    ]);
  };

  const updateTest = (
    testId,
    field,
    value
  ) => {
    setTests(
      tests.map(
        (test) =>
          test.id === testId
            ? {
                ...test,
                [field]: value
              }
            : test
      )
    );
  };

  const removeTest = (testId) => {
    setTests(
      tests.filter(
        (test) =>
          test.id !== testId
      )
    );
  };

  const addEquipment = () => {
    setEquipment([
      ...equipment,
      {
        ...emptyEquipment,
        id: createId("equipment")
      }
    ]);
  };

  const updateEquipment = (
    equipmentId,
    field,
    value
  ) => {
    setEquipment(
      equipment.map(
        (item) =>
          item.id === equipmentId
            ? {
                ...item,
                [field]: value
              }
            : item
      )
    );
  };

  const removeEquipment = (
    equipmentId
  ) => {
    setEquipment(
      equipment.filter(
        (item) =>
          item.id !== equipmentId
      )
    );
  };

  const addEvidence = () => {
    setEvidence([
      ...evidence,
      {
        ...emptyEvidence,
        id: createId("evidence")
      }
    ]);
  };

  const updateEvidence = (
    evidenceId,
    field,
    value
  ) => {
    setEvidence(
      evidence.map(
        (item) =>
          item.id === evidenceId
            ? {
                ...item,
                [field]: value
              }
            : item
      )
    );
  };

  const removeEvidence = (
    evidenceId
  ) => {
    setEvidence(
      evidence.filter(
        (item) =>
          item.id !== evidenceId
      )
    );
  };

  const addBoqItem = () => {
    setBoq([
      ...boq,
      {
        ...emptyBoqItem,
        id: createId("boq")
      }
    ]);
  };

  const updateBoqItem = (
    itemId,
    field,
    value
  ) => {
    setBoq(
      boq.map(
        (item) =>
          item.id === itemId
            ? {
                ...item,
                [field]: value
              }
            : item
      )
    );
  };

  const removeBoqItem = (
    itemId
  ) => {
    setBoq(
      boq.filter(
        (item) =>
          item.id !== itemId
      )
    );
  };

  const renderOverview = () => (
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
            ].map(
              (stage) => (
                <MenuItem
                  key={stage}
                  value={stage}
                >
                  {stage}
                </MenuItem>
              )
            )}
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
            ].map(
              (priority) => (
                <MenuItem
                  key={priority}
                  value={priority}
                >
                  {priority}
                </MenuItem>
              )
            )}
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

  const renderAssessment = () => (
    <SectionCard
      title="Technical Assessment"
      subtitle="Record the complete assessment logic before generating the insurer report."
    >
      <Stack spacing={2}>
        <TextField
          multiline
          minRows={3}
          label="Background and Instruction"
          value={assessment.background}
          onChange={
            updateAssessment("background")
          }
        />

        <TextField
          multiline
          minRows={3}
          label="Insured's Version"
          value={
            assessment.insuredVersion
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
            assessment.inspectionScope
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
          value={assessment.findings}
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
            assessment.testsSummary
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
          value={assessment.cause}
          onChange={
            updateAssessment("cause")
          }
        />

        <TextField
          multiline
          minRows={4}
          label="Technical Opinion"
          value={assessment.opinion}
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
            assessment.recommendation
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
          value={assessment.outcome}
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
          ].map(
            (outcome) => (
              <MenuItem
                key={outcome}
                value={outcome}
              >
                {outcome}
              </MenuItem>
            )
          )}
        </TextField>

        <TextField
          multiline
          minRows={3}
          label="Assessment Limitations"
          value={assessment.limitations}
          onChange={
            updateAssessment(
              "limitations"
            )
          }
        />
      </Stack>
    </SectionCard>
  );

  const renderTesting = () => (
    <SectionCard
      title="Testing Register"
      subtitle="Capture actual measurements and functional test results."
      action={
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addTest}
        >
          Add Test
        </Button>
      }
    >
      {tests.length === 0 ? (
        <EmptyState
          title="No tests recorded"
          description="Add the technical tests performed during inspection or fault finding."
          buttonLabel="Add First Test"
          onClick={addTest}
        />
      ) : (
        <Stack spacing={2}>
          {tests.map(
            (test, index) => (
              <Paper
                key={test.id}
                variant="outlined"
                sx={{
                  p: 2
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    mb: 2
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 900
                    }}
                  >
                    Test {index + 1}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() =>
                      removeTest(test.id)
                    }
                  >
                    <DeleteOutline />
                  </IconButton>
                </Stack>

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
                    label="Test Description"
                    value={test.test}
                    onChange={(event) =>
                      updateTest(
                        test.id,
                        "test",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    label="Instrument"
                    value={test.instrument}
                    onChange={(event) =>
                      updateTest(
                        test.id,
                        "instrument",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    select
                    label="Status"
                    value={test.status}
                    onChange={(event) =>
                      updateTest(
                        test.id,
                        "status",
                        event.target.value
                      )
                    }
                  >
                    {[
                      "Pending",
                      "Pass",
                      "Fail",
                      "Not Applicable"
                    ].map(
                      (status) => (
                        <MenuItem
                          key={status}
                          value={status}
                        >
                          {status}
                        </MenuItem>
                      )
                    )}
                  </TextField>

                  <TextField
                    label="Expected Result"
                    value={test.expected}
                    onChange={(event) =>
                      updateTest(
                        test.id,
                        "expected",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    label="Actual Result"
                    value={test.actual}
                    onChange={(event) =>
                      updateTest(
                        test.id,
                        "actual",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    label="Notes"
                    value={test.notes}
                    onChange={(event) =>
                      updateTest(
                        test.id,
                        "notes",
                        event.target.value
                      )
                    }
                  />
                </Box>
              </Paper>
            )
          )}
        </Stack>
      )}
    </SectionCard>
  );

  const renderEquipment = () => (
    <SectionCard
      title="Equipment Register"
      subtitle="Record every assessed item and its technical decision."
      action={
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addEquipment}
        >
          Add Equipment
        </Button>
      }
    >
      {equipment.length === 0 ? (
        <EmptyState
          title="No equipment recorded"
          description="Add each appliance, system component or damaged item assessed on this claim."
          buttonLabel="Add First Equipment Item"
          onClick={addEquipment}
        />
      ) : (
        <Stack spacing={2}>
          {equipment.map(
            (item, index) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    mb: 2
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 900
                    }}
                  >
                    Equipment {index + 1}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() =>
                      removeEquipment(
                        item.id
                      )
                    }
                  >
                    <DeleteOutline />
                  </IconButton>
                </Stack>

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
                    label="Category"
                    value={item.category}
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "category",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    label="Description"
                    value={item.description}
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "description",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    label="Make"
                    value={item.make}
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "make",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    label="Model"
                    value={item.model}
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "model",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    label="Serial Number"
                    value={item.serial}
                    disabled={
                      item.serialStatus ===
                      "Not available"
                    }
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "serial",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    select
                    label="Serial Status"
                    value={
                      item.serialStatus
                    }
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "serialStatus",
                        event.target.value
                      )
                    }
                  >
                    {[
                      "Available",
                      "Not available"
                    ].map(
                      (status) => (
                        <MenuItem
                          key={status}
                          value={status}
                        >
                          {status}
                        </MenuItem>
                      )
                    )}
                  </TextField>

                  <TextField
                    label="Observed Condition"
                    value={item.condition}
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "condition",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    select
                    label="Technical Decision"
                    value={item.decision}
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "decision",
                        event.target.value
                      )
                    }
                  >
                    {[
                      "Pending",
                      "No Damage",
                      "Repair",
                      "Replace",
                      "Test Further",
                      "Maintenance",
                      "Exclude",
                      "Insurer Decision"
                    ].map(
                      (decision) => (
                        <MenuItem
                          key={decision}
                          value={decision}
                        >
                          {decision}
                        </MenuItem>
                      )
                    )}
                  </TextField>

                  <TextField
                    label="Notes"
                    value={item.notes}
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "notes",
                        event.target.value
                      )
                    }
                  />
                </Box>
              </Paper>
            )
          )}
        </Stack>
      )}
    </SectionCard>
  );

  const renderPhotos = () => (
    <SectionCard
      title="Evidence and Photos Register"
      subtitle="This version records evidence metadata. File upload will be connected in the document milestone."
      action={
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addEvidence}
        >
          Add Evidence
        </Button>
      }
    >
      {evidence.length === 0 ? (
        <EmptyState
          title="No evidence recorded"
          description="Add photographs, job cards, test screenshots or supporting documents."
          buttonLabel="Add First Evidence Item"
          onClick={addEvidence}
        />
      ) : (
        <Stack spacing={2}>
          {evidence.map(
            (item, index) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    mb: 2
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 900
                    }}
                  >
                    Evidence {index + 1}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() =>
                      removeEvidence(
                        item.id
                      )
                    }
                  >
                    <DeleteOutline />
                  </IconButton>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "1fr 1fr"
                    },
                    gap: 2
                  }}
                >
                  <TextField
                    label="Evidence Title"
                    value={item.title}
                    onChange={(event) =>
                      updateEvidence(
                        item.id,
                        "title",
                        event.target.value
                      )
                    }
                  />

                  <TextField
                    select
                    label="Category"
                    value={item.category}
                    onChange={(event) =>
                      updateEvidence(
                        item.id,
                        "category",
                        event.target.value
                      )
                    }
                  >
                    {[
                      "General",
                      "Overview",
                      "Damage",
                      "Testing",
                      "Equipment",
                      "Installation",
                      "Compliance",
                      "Documentation"
                    ].map(
                      (category) => (
                        <MenuItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </MenuItem>
                      )
                    )}
                  </TextField>

                  <TextField
                    multiline
                    minRows={2}
                    label="Description"
                    value={
                      item.description
                    }
                    onChange={(event) =>
                      updateEvidence(
                        item.id,
                        "description",
                        event.target.value
                      )
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          item.includeInReport
                        }
                        onChange={(
                          event
                        ) =>
                          updateEvidence(
                            item.id,
                            "includeInReport",
                            event.target
                              .checked
                          )
                        }
                      />
                    }
                    label="Include in final report"
                  />
                </Box>
              </Paper>
            )
          )}
        </Stack>
      )}
    </SectionCard>
  );

  const renderBoq = () => (
    <Stack spacing={2}>
      <SectionCard
        title="Bill of Quantities"
        subtitle="Rates are VAT exclusive. VAT is calculated automatically at 15%."
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addBoqItem}
          >
            Add BOQ Item
          </Button>
        }
      >
        {boq.length === 0 ? (
          <EmptyState
            title="No BOQ items recorded"
            description="Add authorised, recommended or insurer-decision items."
            buttonLabel="Add First BOQ Item"
            onClick={addBoqItem}
          />
        ) : (
          <Stack spacing={2}>
            {boq.map(
              (item, index) => {
                const amount =
                  Number(
                    item.quantity || 0
                  ) *
                  Number(
                    item.rate || 0
                  );

                return (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{
                      p: 2
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        mb: 2
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 900
                        }}
                      >
                        Item {index + 1}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Chip
                          label={money(amount)}
                          size="small"
                        />

                        <IconButton
                          color="error"
                          onClick={() =>
                            removeBoqItem(
                              item.id
                            )
                          }
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          md:
                            "2fr 0.7fr 0.7fr 1fr 1fr"
                        },
                        gap: 2
                      }}
                    >
                      <TextField
                        label="Description"
                        value={
                          item.description
                        }
                        onChange={(
                          event
                        ) =>
                          updateBoqItem(
                            item.id,
                            "description",
                            event.target
                              .value
                          )
                        }
                      />

                      <TextField
                        label="Unit"
                        value={item.unit}
                        onChange={(
                          event
                        ) =>
                          updateBoqItem(
                            item.id,
                            "unit",
                            event.target
                              .value
                          )
                        }
                      />

                      <TextField
                        type="number"
                        label="Quantity"
                        value={
                          item.quantity
                        }
                        inputProps={{
                          min: 0,
                          step: 0.01
                        }}
                        onChange={(
                          event
                        ) =>
                          updateBoqItem(
                            item.id,
                            "quantity",
                            event.target
                              .value
                          )
                        }
                      />

                      <TextField
                        type="number"
                        label="Rate Excl. VAT"
                        value={item.rate}
                        inputProps={{
                          min: 0,
                          step: 0.01
                        }}
                        onChange={(
                          event
                        ) =>
                          updateBoqItem(
                            item.id,
                            "rate",
                            event.target
                              .value
                          )
                        }
                      />

                      <TextField
                        select
                        label="Scope"
                        value={item.scope}
                        onChange={(
                          event
                        ) =>
                          updateBoqItem(
                            item.id,
                            "scope",
                            event.target
                              .value
                          )
                        }
                      >
                        {[
                          "Repair",
                          "Replacement",
                          "Labour",
                          "Testing",
                          "Compliance",
                          "Additional",
                          "Insurer Decision",
                          "Excluded"
                        ].map(
                          (scope) => (
                            <MenuItem
                              key={scope}
                              value={scope}
                            >
                              {scope}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    </Box>

                    <FormControlLabel
                      sx={{
                        mt: 1
                      }}
                      control={
                        <Switch
                          checked={
                            item.authorised
                          }
                          onChange={(
                            event
                          ) =>
                            updateBoqItem(
                              item.id,
                              "authorised",
                              event.target
                                .checked
                            )
                          }
                        />
                      }
                      label="Previously authorised item"
                    />
                  </Paper>
                );
              }
            )}
          </Stack>
        )}
      </SectionCard>

      <Card>
        <CardContent>
          <Typography variant="h6">
            Quantum Summary
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography>
                Subtotal excluding VAT
              </Typography>

              <Typography
                sx={{
                  fontWeight: 900
                }}
              >
                {money(
                  engine.subtotalExcludingVat
                )}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography>
                VAT at 15%
              </Typography>

              <Typography
                sx={{
                  fontWeight: 900
                }}
              >
                {money(engine.vat)}
              </Typography>
            </Stack>

            <Divider />

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography variant="h6">
                Total including VAT
              </Typography>

              <Typography variant="h6">
                {money(
                  engine.totalIncludingVat
                )}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderReports = () => (
    <Stack spacing={2}>
      <SectionCard
        title="Report Readiness"
        subtitle="BEOS validates the technical and commercial record before report generation."
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography variant="h5">
              {engine.readiness}% Complete
            </Typography>

            <Chip
              icon={
                engine.reportReady ? (
                  <CheckCircle />
                ) : (
                  <ErrorOutline />
                )
              }
              label={
                engine.reportReady
                  ? "Report Ready"
                  : "Controls Outstanding"
              }
              color={
                engine.reportReady
                  ? "success"
                  : "warning"
              }
            />
          </Stack>

          <LinearProgress
            variant="determinate"
            value={engine.readiness}
            sx={{
              height: 12,
              borderRadius: 10
            }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr"
              },
              gap: 1.5
            }}
          >
            {engine.checks.map(
              (check) => (
                <Paper
                  key={check.key}
                  variant="outlined"
                  sx={{
                    p: 1.5
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800
                        }}
                      >
                        {check.label}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {check.target}
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      label={
                        check.complete
                          ? "Complete"
                          : "Required"
                      }
                      color={
                        check.complete
                          ? "success"
                          : "default"
                      }
                    />
                  </Stack>
                </Paper>
              )
            )}
          </Box>
        </Stack>
      </SectionCard>

      {engine.contradictions.length >
      0 ? (
        <SectionCard
          title="Technical Contradictions"
          subtitle="These issues should be resolved before the report is issued."
        >
          <Stack spacing={1}>
            {engine.contradictions.map(
              (issue) => (
                <Alert
                  key={issue.code}
                  severity="warning"
                >
                  {issue.message}
                </Alert>
              )
            )}
          </Stack>
        </SectionCard>
      ) : (
        <Alert severity="success">
          No technical contradictions have
          been detected.
        </Alert>
      )}

      <SectionCard
        title="Report Generation"
        subtitle="Document generation will be connected during the Report Engine milestone."
      >
        <Stack
          direction={{
            xs: "column",
            md: "row"
          }}
          spacing={2}
        >
          <Button
            variant="contained"
            disabled={!engine.reportReady}
            startIcon={<Description />}
          >
            Generate Basithami V3 Report
          </Button>

          <Button
            variant="outlined"
            disabled={!engine.reportReady}
          >
            Generate App Summary
          </Button>

          <Button
            variant="outlined"
            disabled={!engine.reportReady}
          >
            Export BOQ
          </Button>
        </Stack>
      </SectionCard>
    </Stack>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();

      case "assessment":
        return renderAssessment();

      case "testing":
        return renderTesting();

      case "equipment":
        return renderEquipment();

      case "photos":
        return renderPhotos();

      case "boq":
        return renderBoq();

      case "reports":
        return renderReports();

      default:
        return renderOverview();
    }
  };

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3
        }
      }}
    >
      <Stack
        direction={{
          xs: "column",
          lg: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          lg: "center"
        }}
        spacing={2}
      >
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate("/claims")
            }
            sx={{
              mb: 1
            }}
          >
            Claims Register
          </Button>

          <Typography variant="h4">
            {claimDetails.claim}
          </Typography>

          <Typography color="text.secondary">
            {claimDetails.insured} ·{" "}
            {claimDetails.insurer} ·{" "}
            {claimDetails.peril}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            label={
              claimDetails.stage ||
              "New Instruction"
            }
            color={stageColor(
              claimDetails.stage
            )}
          />

          <Chip
            label={
              claimDetails.priority ||
              "Medium"
            }
            color={priorityColor(
              claimDetails.priority
            )}
          />

          <Chip
            icon={<Save />}
            label={saveStatus}
            color={
              saveStatus === "Saved"
                ? "success"
                : "default"
            }
          />

          <Chip
            label={`${engine.readiness}% Ready`}
            color={
              engine.reportReady
                ? "success"
                : "warning"
            }
          />
        </Stack>
      </Stack>

      <Card
        sx={{
          mt: 3
        }}
      >
        <Tabs
          value={activeSection}
          onChange={(
            event,
            value
          ) =>
            setActiveSection(value)
          }
          variant="scrollable"
          scrollButtons="auto"
        >
          {workspaceSections.map(
            (section) => (
              <Tab
                key={section.key}
                value={section.key}
                icon={section.icon}
                iconPosition="start"
                label={section.label}
              />
            )
          )}
        </Tabs>
      </Card>

      <Box
        sx={{
          mt: 2
        }}
      >
        {renderActiveSection()}
      </Box>
    </Box>
  );
}