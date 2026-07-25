import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";

import {
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createClaim,
  getClaims
} from "../../../services/claimRepository";

import {
  money,
  priorityColor,
  stageColor
} from "../../../utils/claimFormatters";

const blankClaim = {
  claim: "",
  insured: "",
  insurer: "",
  policy: "",
  peril: "",
  location: "",
  phone: "",
  email: "",
  priority: "Medium",
  assessor: "P Getyeza",
  technician: "Unassigned",
  dueDate: ""
};

export default function ClaimsRegisterPage() {
  const navigate = useNavigate();

  const [
    refreshKey,
    setRefreshKey
  ] = useState(0);

  const [
    query,
    setQuery
  ] = useState("");

  const [
    priorityFilter,
    setPriorityFilter
  ] = useState("All");

  const [
    insurerFilter,
    setInsurerFilter
  ] = useState("All");

  const [
    stageFilter,
    setStageFilter
  ] = useState("All");

  const [
    open,
    setOpen
  ] = useState(false);

  const [
    draft,
    setDraft
  ] = useState(blankClaim);

  const claims = useMemo(
    () => getClaims(),
    [refreshKey]
  );

  const insurers = [
    "All",
    ...new Set(
      claims.map(
        (claim) => claim.insurer
      )
    )
  ];

  const stages = [
    "All",
    ...new Set(
      claims.map(
        (claim) => claim.stage
      )
    )
  ];

  const visibleClaims = useMemo(() => {
    const search = query
      .trim()
      .toLowerCase();

    return claims.filter(
      (claim) => {
        const searchableText = [
          claim.claim,
          claim.insured,
          claim.insurer,
          claim.peril,
          claim.stage,
          claim.assessor,
          claim.technician
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          searchableText.includes(search);

        const matchesPriority =
          priorityFilter === "All" ||
          claim.priority === priorityFilter;

        const matchesInsurer =
          insurerFilter === "All" ||
          claim.insurer === insurerFilter;

        const matchesStage =
          stageFilter === "All" ||
          claim.stage === stageFilter;

        return (
          matchesSearch &&
          matchesPriority &&
          matchesInsurer &&
          matchesStage
        );
      }
    );
  }, [
    claims,
    query,
    priorityFilter,
    insurerFilter,
    stageFilter
  ]);

  const exposure = visibleClaims.reduce(
    (total, claim) =>
      total + Number(claim.value || 0),
    0
  );

  const updateDraft = (field) => (event) => {
    setDraft({
      ...draft,
      [field]: event.target.value
    });
  };

  const handleCreateClaim = () => {
    if (
      !draft.claim.trim() ||
      !draft.insured.trim() ||
      !draft.insurer.trim() ||
      !draft.peril.trim()
    ) {
      return;
    }

    const created = createClaim(draft);

    setDraft(blankClaim);
    setOpen(false);
    setRefreshKey(
      (value) => value + 1
    );

    navigate(
      `/claims/${created.id}`
    );
  };

  return (
    <Box
      sx={{
        padding: {
          xs: 2,
          md: 3
        }
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row"
        }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4">
            Enterprise Claims Register
          </Typography>

          <Typography color="text.secondary">
            Search, filter and open the complete enterprise
            claim workspace.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Register New Claim
        </Button>
      </Stack>

      <Box
        sx={{
          marginTop: 3,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 2
        }}
      >
        <Card>
          <CardContent>
            <Typography
              variant="overline"
              color="text.secondary"
            >
              Visible Claims
            </Typography>

            <Typography variant="h4">
              {visibleClaims.length}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="overline"
              color="text.secondary"
            >
              Visible Exposure
            </Typography>

            <Typography variant="h4">
              {money(exposure)}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="overline"
              color="text.secondary"
            >
              Critical Claims
            </Typography>

            <Typography variant="h4">
              {
                visibleClaims.filter(
                  (claim) =>
                    claim.priority === "Critical"
                ).length
              }
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card
        sx={{
          marginTop: 2
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr 1fr 1fr"
              },
              gap: 1.5
            }}
          >
            <TextField
              size="small"
              label="Search claims"
              value={query}
              onChange={
                (event) =>
                  setQuery(event.target.value)
              }
            />

            <Select
              size="small"
              value={priorityFilter}
              onChange={
                (event) =>
                  setPriorityFilter(
                    event.target.value
                  )
              }
            >
              {[
                "All",
                "Critical",
                "High",
                "Medium",
                "Low"
              ].map(
                (value) => (
                  <MenuItem
                    key={value}
                    value={value}
                  >
                    Priority: {value}
                  </MenuItem>
                )
              )}
            </Select>

            <Select
              size="small"
              value={insurerFilter}
              onChange={
                (event) =>
                  setInsurerFilter(
                    event.target.value
                  )
              }
            >
              {insurers.map(
                (value) => (
                  <MenuItem
                    key={value}
                    value={value}
                  >
                    Insurer: {value}
                  </MenuItem>
                )
              )}
            </Select>

            <Select
              size="small"
              value={stageFilter}
              onChange={
                (event) =>
                  setStageFilter(
                    event.target.value
                  )
              }
            >
              {stages.map(
                (value) => (
                  <MenuItem
                    key={value}
                    value={value}
                  >
                    Stage: {value}
                  </MenuItem>
                )
              )}
            </Select>
          </Box>

          <Box
            sx={{
              overflowX: "auto",
              marginTop: 2
            }}
          >
            <Table
              size="small"
              sx={{
                minWidth: 1180
              }}
            >
              <TableHead>
                <TableRow>
                  {[
                    "Claim",
                    "Insured",
                    "Insurer",
                    "Peril",
                    "Stage",
                    "Priority",
                    "Assessor",
                    "Technician",
                    "SLA",
                    "Report",
                    "Exposure"
                  ].map(
                    (heading) => (
                      <TableCell key={heading}>
                        {heading}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleClaims.map(
                  (claim) => (
                    <TableRow
                      key={claim.id}
                      hover
                      onClick={() =>
                        navigate(
                          `/claims/${claim.id}`
                        )
                      }
                      sx={{
                        cursor: "pointer"
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 900
                        }}
                      >
                        {claim.claim}
                      </TableCell>

                      <TableCell>
                        {claim.insured}
                      </TableCell>

                      <TableCell>
                        {claim.insurer}
                      </TableCell>

                      <TableCell>
                        {claim.peril}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={claim.stage}
                          color={
                            stageColor(
                              claim.stage
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={claim.priority}
                          color={
                            priorityColor(
                              claim.priority
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {claim.assessor}
                      </TableCell>

                      <TableCell>
                        {claim.technician}
                      </TableCell>

                      <TableCell>
                        {claim.sla}
                      </TableCell>

                      <TableCell>
                        {claim.reportStatus}
                      </TableCell>

                      <TableCell>
                        {money(claim.value)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Register New Claim
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              marginTop: 1,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr"
              },
              gap: 2
            }}
          >
            <TextField
              label="Claim number"
              value={draft.claim}
              onChange={updateDraft("claim")}
              required
            />

            <TextField
              label="Insured"
              value={draft.insured}
              onChange={updateDraft("insured")}
              required
            />

            <TextField
              label="Insurer"
              value={draft.insurer}
              onChange={updateDraft("insurer")}
              required
            />

            <TextField
              label="Policy number"
              value={draft.policy}
              onChange={updateDraft("policy")}
            />

            <TextField
              label="Reported peril"
              value={draft.peril}
              onChange={updateDraft("peril")}
              required
            />

            <TextField
              label="Risk address"
              value={draft.location}
              onChange={updateDraft("location")}
            />

            <TextField
              label="Contact number"
              value={draft.phone}
              onChange={updateDraft("phone")}
            />

            <TextField
              label="Email address"
              value={draft.email}
              onChange={updateDraft("email")}
            />

            <TextField
              select
              label="Priority"
              value={draft.priority}
              onChange={updateDraft("priority")}
            >
              {[
                "Critical",
                "High",
                "Medium",
                "Low"
              ].map(
                (value) => (
                  <MenuItem
                    key={value}
                    value={value}
                  >
                    {value}
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              label="Assessor"
              value={draft.assessor}
              onChange={updateDraft("assessor")}
            />

            <TextField
              label="Technician"
              value={draft.technician}
              onChange={updateDraft("technician")}
            />

            <TextField
              type="date"
              label="Due date"
              value={draft.dueDate}
              onChange={updateDraft("dueDate")}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={
              !draft.claim.trim() ||
              !draft.insured.trim() ||
              !draft.insurer.trim() ||
              !draft.peril.trim()
            }
            onClick={handleCreateClaim}
          >
            Create Claim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
