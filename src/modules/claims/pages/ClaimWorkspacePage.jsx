import {
  ArrowBack,
  Assessment,
  Build,
  Calculate,
  Description,
  Devices,
  PhotoCamera,
  Save,
  Science
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Tab,
  Tabs,
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
  priorityColor,
  stageColor
} from "../../../utils/claimFormatters";

import {
  usePersistentState
} from "../../../hooks/usePersistentState";

import {
  buildClaimEngine
} from "../engine/buildClaimEngine";

import OverviewPanel from "../components/OverviewPanel";
import AssessmentPanel from "../components/AssessmentPanel";
import TestingPanel from "../components/TestingPanel";
import EquipmentPanel from "../components/EquipmentPanel";
import EvidencePanel from "../components/EvidencePanel";
import BoqPanel from "../components/BoqPanel";
import ReportPanel from "../components/ReportPanel";

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
    key: "evidence",
    label: "Evidence",
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

function normaliseAssessment(value) {
  return {
    ...emptyAssessment,
    ...(value || {})
  };
}

function normaliseArray(value) {
  return Array.isArray(value)
    ? value
    : [];
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

  const safeClaimDetails =
    claimDetails || {};

  const safeAssessment =
    normaliseAssessment(
      assessment
    );

  const safeTests =
    normaliseArray(tests);

  const safeEquipment =
    normaliseArray(equipment);

  const safeEvidence =
    normaliseArray(evidence);

  const safeBoq =
    normaliseArray(boq);

  const engine = useMemo(
    () =>
      buildClaimEngine({
        assessment:
          safeAssessment,
        tests:
          safeTests,
        equipment:
          safeEquipment,
        evidence:
          safeEvidence,
        boq:
          safeBoq
      }),
    [
      safeAssessment,
      safeTests,
      safeEquipment,
      safeEvidence,
      safeBoq
    ]
  );

  useEffect(() => {
    if (!claim) {
      return;
    }

    setClaimDetails(
      (current) => ({
        ...claim,
        ...(current || {})
      })
    );
  }, [
    claim,
    setClaimDetails
  ]);

  useEffect(() => {
    if (!safeClaimDetails?.id) {
      return undefined;
    }

    setSaveStatus("Saving");

    const timeout =
      window.setTimeout(() => {
        updateClaim(
          safeClaimDetails.id,
          {
            ...safeClaimDetails,
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

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    safeClaimDetails,
    engine.totalIncludingVat,
    engine.reportReady
  ]);

  if (!claim) {
    return (
      <Box
        sx={{
          p: {
            xs: 2,
            md: 3
          }
        }}
      >
        <Alert severity="error">
          The requested claim could not be found.
        </Alert>

        <Button
          sx={{
            mt: 2
          }}
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <OverviewPanel
            claimDetails={
              safeClaimDetails
            }
            setClaimDetails={
              setClaimDetails
            }
            engine={engine}
          />
        );

      case "assessment":
        return (
          <AssessmentPanel
            claimDetails={
              safeClaimDetails
            }
            assessment={
              safeAssessment
            }
            setAssessment={
              setAssessment
            }
          />
        );

      case "testing":
        return (
          <TestingPanel
            claimDetails={
              safeClaimDetails
            }
            tests={
              safeTests
            }
            setTests={
              setTests
            }
          />
        );

      case "equipment":
        return (
          <EquipmentPanel
            equipment={
              safeEquipment
            }
            setEquipment={
              setEquipment
            }
          />
        );

      case "evidence":
        return (
          <EvidencePanel
            evidence={
              safeEvidence
            }
            setEvidence={
              setEvidence
            }
          />
        );

      case "boq":
        return (
          <BoqPanel
            boq={
              safeBoq
            }
            setBoq={
              setBoq
            }
          />
        );

      case "reports":
        return (
          <ReportPanel
            engine={engine}
            claimDetails={
              safeClaimDetails
            }
            assessment={
              safeAssessment
            }
            equipment={
              safeEquipment
            }
            tests={
              safeTests
            }
            evidence={
              safeEvidence
            }
            boq={
              safeBoq
            }
          />
        );

      default:
        return (
          <OverviewPanel
            claimDetails={
              safeClaimDetails
            }
            setClaimDetails={
              setClaimDetails
            }
            engine={engine}
          />
        );
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

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800
            }}
          >
            {safeClaimDetails.claim ||
              "Claim Workspace"}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            {safeClaimDetails.insured ||
              "Insured not captured"}

            {" · "}

            {safeClaimDetails.insurer ||
              "Insurer not captured"}

            {" · "}

            {safeClaimDetails.peril ||
              "Peril not captured"}
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
              safeClaimDetails.stage ||
              "New Instruction"
            }
            color={stageColor(
              safeClaimDetails.stage
            )}
          />

          <Chip
            label={
              safeClaimDetails.priority ||
              "Medium"
            }
            color={priorityColor(
              safeClaimDetails.priority
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
          ) => {
            setActiveSection(value);
          }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
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