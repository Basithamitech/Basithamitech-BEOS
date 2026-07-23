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

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

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

export default function EquipmentPanel({
  equipment,
  setEquipment
}) {
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
      equipment.map((item) =>
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

  return (
    <SectionCard
      title="Equipment Register"
      subtitle="Record every assessed appliance, system component and technical decision."
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
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderStyle: "dashed"
          }}
        >
          <Typography variant="h6">
            No equipment recorded
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              mb: 2
            }}
          >
            Add each appliance, system component or damaged item assessed on this claim.
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addEquipment}
          >
            Add First Equipment Item
          </Button>
        </Paper>
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
                    value={
                      item.category || ""
                    }
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
                    value={
                      item.description || ""
                    }
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
                    value={
                      item.make || ""
                    }
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
                    value={
                      item.model || ""
                    }
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
                    value={
                      item.serial || ""
                    }
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
                      item.serialStatus ||
                      "Available"
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
                    multiline
                    minRows={2}
                    label="Observed Condition"
                    value={
                      item.condition || ""
                    }
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
                    value={
                      item.decision ||
                      "Pending"
                    }
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
                    ].map((decision) => (
                      <MenuItem
                        key={decision}
                        value={decision}
                      >
                        {decision}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    multiline
                    minRows={2}
                    label="Technical Notes"
                    value={
                      item.notes || ""
                    }
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
}