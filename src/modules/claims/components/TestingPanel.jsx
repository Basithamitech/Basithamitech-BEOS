import {
  Add,
  DeleteOutline
} from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import {
  createTestsFromPeril,
  getPerilTemplate
} from "../engine/perilTemplates";

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const emptyTest = {
  id: "",
  test: "",
  instrument: "",
  expected: "",
  actual: "",
  status: "Pending",
  notes: ""
};

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

export default function TestingPanel({
  claimDetails,
  tests,
  setTests
}) {
  const perilTemplate =
    getPerilTemplate(
      claimDetails?.peril || ""
    );

  const addTest = () => {
    setTests([
      ...tests,
      {
        ...emptyTest,
        id: createId("test")
      }
    ]);
  };

  const loadRecommendedTests = () => {
    const recommendedTests =
      createTestsFromPeril(
        claimDetails?.peril || ""
      );

    const existingTestNames = new Set(
      tests.map((test) =>
        String(test.test || "")
          .trim()
          .toLowerCase()
      )
    );

    const missingTests =
      recommendedTests.filter(
        (test) =>
          !existingTestNames.has(
            String(test.test || "")
              .trim()
              .toLowerCase()
          )
      );

    if (missingTests.length === 0) {
      return;
    }

    setTests([
      ...tests,
      ...missingTests
    ]);
  };

  const updateTest = (
    testId,
    field,
    value
  ) => {
    setTests(
      tests.map((test) =>
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

  return (
    <SectionCard
      title="Testing Register"
      subtitle={`Capture actual measurements and functional test results. Recommended workflow: ${perilTemplate.label}.`}
      action={
        <Stack
          direction={{
            xs: "column",
            sm: "row"
          }}
          spacing={1}
        >
          <Button
            variant="outlined"
            onClick={loadRecommendedTests}
          >
            Load Recommended Tests
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addTest}
          >
            Add Test
          </Button>
        </Stack>
      }
    >
      {tests.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderStyle: "dashed"
          }}
        >
          <Typography variant="h6">
            No tests recorded
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              mb: 2
            }}
          >
            Load the recommended{" "}
            {perilTemplate.label.toLowerCase()}{" "}
            checklist or add an individual test.
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            justifyContent="center"
            spacing={1}
          >
            <Button
              variant="contained"
              onClick={loadRecommendedTests}
            >
              Load Recommended Tests
            </Button>

            <Button
              variant="outlined"
              onClick={addTest}
            >
              Add Individual Test
            </Button>
          </Stack>
        </Paper>
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
                    value={
                      test.test || ""
                    }
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
                    value={
                      test.instrument || ""
                    }
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
                    value={
                      test.status ||
                      "Pending"
                    }
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
                    ].map((status) => (
                      <MenuItem
                        key={status}
                        value={status}
                      >
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Expected Result"
                    value={
                      test.expected || ""
                    }
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
                    value={
                      test.actual || ""
                    }
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
                    value={
                      test.notes || ""
                    }
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
}