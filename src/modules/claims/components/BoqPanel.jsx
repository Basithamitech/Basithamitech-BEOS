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

const VAT_RATE = 0.15;

const emptyItem = {
  id: "",
  section: "Repairs",
  description: "",
  quantity: 1,
  unit: "Each",
  rate: 0
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

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {action}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {children}
      </CardContent>
    </Card>
  );
}

export default function BoqPanel({
  boq,
  setBoq
}) {

  const safeBoq = Array.isArray(boq)
    ? boq
    : [];

  const addItem = () => {
    setBoq([
      ...safeBoq,
      {
        ...emptyItem,
        id: createId("boq")
      }
    ]);
  };

  const updateItem = (
    id,
    field,
    value
  ) => {

    setBoq(
      safeBoq.map(item =>
        item.id === id
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    );

  };

  const removeItem = id => {

    setBoq(
      safeBoq.filter(
        item => item.id !== id
      )
    );

  };

  const subtotal =
    safeBoq.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0) *
          Number(item.rate || 0),
      0
    );

  const vat = subtotal * VAT_RATE;

  const total = subtotal + vat;

  return (
    <SectionCard
      title="Bill of Quantities"
      subtitle="Capture all approved repair, replacement and labour items."
      action={
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addItem}
        >
          Add Item
        </Button>
      }
    >
      {safeBoq.length === 0 ? (

        <Paper
          variant="outlined"
          sx={{
            p:4,
            textAlign:"center",
            borderStyle:"dashed"
          }}
        >

          <Typography variant="h6">
            No BOQ Items
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt:1,
              mb:2
            }}
          >
            Add labour, materials,
            replacement equipment and
            consumables.
          </Typography>

          <Button
            variant="contained"
            onClick={addItem}
          >
            Add First Item
          </Button>

        </Paper>

      ) : (

        <Stack spacing={2}>

          {safeBoq.map(
            (item,index)=>{

              const amount =
                Number(item.quantity||0) *
                Number(item.rate||0);

              return(

                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{p:2}}
                >

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{mb:2}}
                  >

                    <Typography
                      fontWeight={900}
                    >
                      Item {index+1}
                    </Typography>

                    <IconButton
                      color="error"
                      onClick={()=>
                        removeItem(item.id)
                      }
                    >
                      <DeleteOutline/>
                    </IconButton>

                  </Stack>

                  <Box
                    sx={{
                      display:"grid",
                      gridTemplateColumns:{
                        xs:"1fr",
                        md:"repeat(5,1fr)"
                      },
                      gap:2
                    }}
                  >

                    <TextField
                      label="Section"
                      value={item.section}
                      onChange={e=>
                        updateItem(
                          item.id,
                          "section",
                          e.target.value
                        )
                      }
                    />

                    <TextField
                      label="Description"
                      value={item.description}
                      onChange={e=>
                        updateItem(
                          item.id,
                          "description",
                          e.target.value
                        )
                      }
                    />

                    <TextField
                      type="number"
                      label="Qty"
                      value={item.quantity}
                      onChange={e=>
                        updateItem(
                          item.id,
                          "quantity",
                          e.target.value
                        )
                      }
                    />

                    <TextField
                      label="Unit"
                      value={item.unit}
                      onChange={e=>
                        updateItem(
                          item.id,
                          "unit",
                          e.target.value
                        )
                      }
                    />

                    <TextField
                      type="number"
                      label="Rate"
                      value={item.rate}
                      onChange={e=>
                        updateItem(
                          item.id,
                          "rate",
                          e.target.value
                        )
                      }
                    />

                  </Box>

                  <Typography
                    align="right"
                    sx={{
                      mt:2,
                      fontWeight:900
                    }}
                  >
                    Amount :
                    {" "}
                    R {amount.toFixed(2)}
                  </Typography>

                </Paper>

              );

            }
          )}

          <Divider/>

          <Stack
            alignItems="flex-end"
            spacing={1}
          >

            <Typography>
              Subtotal :
              {" "}
              R {subtotal.toFixed(2)}
            </Typography>

            <Typography>
              VAT :
              {" "}
              R {vat.toFixed(2)}
            </Typography>

            <Typography
              variant="h6"
              fontWeight={900}
            >
              Total :
              {" "}
              R {total.toFixed(2)}
            </Typography>

          </Stack>

        </Stack>

      )}

    </SectionCard>
  );

}