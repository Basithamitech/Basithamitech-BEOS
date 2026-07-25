import {
  Add,
  DeleteOutline,
  ImageOutlined
} from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const emptyEvidence = {
  id: "",
  category: "General",
  title: "",
  description: "",
  fileName: "",
  fileType: "",
  previewUrl: "",
  capturedAt: "",
  capturedBy: "",
  location: "",
  relevance: "Supporting",
  includeInReport: true
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

function normaliseEvidenceItem(item) {
  return {
    ...emptyEvidence,
    ...item,
    includeInReport:
      item?.includeInReport !== false
  };
}

export default function EvidencePanel({
  evidence,
  setEvidence
}) {
  const safeEvidence = Array.isArray(evidence)
    ? evidence
    : [];

  const addEvidence = () => {
    setEvidence([
      ...safeEvidence,
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
      safeEvidence.map((item) =>
        item.id === evidenceId
          ? {
              ...normaliseEvidenceItem(item),
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
      safeEvidence.filter(
        (item) =>
          item.id !== evidenceId
      )
    );
  };

  const handleFileSelection = (
    evidenceId,
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl =
      file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "";

    setEvidence(
      safeEvidence.map((item) =>
        item.id === evidenceId
          ? {
              ...normaliseEvidenceItem(item),
              fileName: file.name,
              fileType:
                file.type ||
                "Unknown",
              previewUrl
            }
          : item
      )
    );

    event.target.value = "";
  };

  return (
    <SectionCard
      title="Evidence Register"
      subtitle="Record photographs, documents, test records and supporting material used in the technical assessment."
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
      {safeEvidence.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderStyle: "dashed"
          }}
        >
          <ImageOutlined
            sx={{
              fontSize: 48,
              color: "text.secondary"
            }}
          />

          <Typography
            variant="h6"
            sx={{
              mt: 1
            }}
          >
            No evidence recorded
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              mb: 2
            }}
          >
            Add site photographs, serial-number images, test readings, quotations or other claim evidence.
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addEvidence}
          >
            Add First Evidence Item
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {safeEvidence.map(
            (rawItem, index) => {
              const item =
                normaliseEvidenceItem(
                  rawItem
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
                    direction={{
                      xs: "column",
                      sm: "row"
                    }}
                    justifyContent="space-between"
                    alignItems={{
                      xs: "flex-start",
                      sm: "center"
                    }}
                    spacing={1}
                    sx={{
                      mb: 2
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 900
                        }}
                      >
                        Evidence {index + 1}
                      </Typography>

                      <Chip
                        size="small"
                        label={
                          item.includeInReport
                            ? "Report"
                            : "Internal only"
                        }
                        color={
                          item.includeInReport
                            ? "success"
                            : "default"
                        }
                        variant="outlined"
                      />
                    </Stack>

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
                        lg: item.previewUrl
                          ? "220px 1fr"
                          : "1fr"
                      },
                      gap: 2
                    }}
                  >
                    {item.previewUrl ? (
                      <Box
                        component="img"
                        src={item.previewUrl}
                        alt={
                          item.title ||
                          item.fileName ||
                          `Evidence ${index + 1}`
                        }
                        sx={{
                          width: "100%",
                          height: 220,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: 1,
                          borderColor:
                            "divider"
                        }}
                      />
                    ) : null}

                    <Stack spacing={2}>
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
                          select
                          label="Evidence Category"
                          value={
                            item.category ||
                            "General"
                          }
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
                            "Site Overview",
                            "Damage",
                            "Equipment",
                            "Serial Number",
                            "Testing",
                            "Electrical Reading",
                            "Installation",
                            "Resultant Damage",
                            "Quotation",
                            "Invoice",
                            "Report",
                            "Job Card",
                            "Correspondence"
                          ].map(
                            (category) => (
                              <MenuItem
                                key={
                                  category
                                }
                                value={
                                  category
                                }
                              >
                                {category}
                              </MenuItem>
                            )
                          )}
                        </TextField>

                        <TextField
                          label="Evidence Title"
                          value={
                            item.title || ""
                          }
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
                          label="Assessment Relevance"
                          value={
                            item.relevance ||
                            "Supporting"
                          }
                          onChange={(event) =>
                            updateEvidence(
                              item.id,
                              "relevance",
                              event.target.value
                            )
                          }
                        >
                          {[
                            "Critical",
                            "Supporting",
                            "Contextual",
                            "Administrative",
                            "Excluded"
                          ].map(
                            (relevance) => (
                              <MenuItem
                                key={
                                  relevance
                                }
                                value={
                                  relevance
                                }
                              >
                                {relevance}
                              </MenuItem>
                            )
                          )}
                        </TextField>

                        <TextField
                          label="Captured By"
                          value={
                            item.capturedBy ||
                            ""
                          }
                          onChange={(event) =>
                            updateEvidence(
                              item.id,
                              "capturedBy",
                              event.target.value
                            )
                          }
                        />

                        <TextField
                          type="datetime-local"
                          label="Captured Date and Time"
                          value={
                            item.capturedAt ||
                            ""
                          }
                          onChange={(event) =>
                            updateEvidence(
                              item.id,
                              "capturedAt",
                              event.target.value
                            )
                          }
                          InputLabelProps={{
                            shrink: true
                          }}
                        />

                        <TextField
                          label="Evidence Location"
                          value={
                            item.location || ""
                          }
                          onChange={(event) =>
                            updateEvidence(
                              item.id,
                              "location",
                              event.target.value
                            )
                          }
                        />
                      </Box>

                      <TextField
                        multiline
                        minRows={3}
                        label="Evidence Description"
                        value={
                          item.description || ""
                        }
                        onChange={(event) =>
                          updateEvidence(
                            item.id,
                            "description",
                            event.target.value
                          )
                        }
                      />

                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row"
                        }}
                        alignItems={{
                          xs: "stretch",
                          sm: "center"
                        }}
                        spacing={1}
                      >
                        <Button
                          component="label"
                          variant="outlined"
                        >
                          Select File
                          <input
                            hidden
                            type="file"
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                            onChange={(
                              event
                            ) =>
                              handleFileSelection(
                                item.id,
                                event
                              )
                            }
                          />
                        </Button>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            flex: 1
                          }}
                        >
                          {item.fileName ||
                            "No file selected"}
                        </Typography>

                        <TextField
                          select
                          label="Include in Report"
                          value={
                            item.includeInReport
                              ? "Yes"
                              : "No"
                          }
                          onChange={(event) =>
                            updateEvidence(
                              item.id,
                              "includeInReport",
                              event.target.value ===
                                "Yes"
                            )
                          }
                          sx={{
                            minWidth: 170
                          }}
                        >
                          <MenuItem value="Yes">
                            Yes
                          </MenuItem>

                          <MenuItem value="No">
                            No
                          </MenuItem>
                        </TextField>
                      </Stack>

                      {item.fileType ? (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          File type:{" "}
                          {item.fileType}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Box>
                </Paper>
              );
            }
          )}
        </Stack>
      )}
    </SectionCard>
  );
}