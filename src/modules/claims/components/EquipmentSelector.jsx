import { MenuItem, TextField } from "@mui/material";
import {
  getCategories,
  getManufacturers,
  getModels
} from "../equipmentDatabase";

export default function EquipmentSelector({
  item,
  updateEquipment
}) {
  const categories = getCategories();

  const manufacturers = item.category
    ? getManufacturers(item.category)
    : [];

  const models =
    item.category && item.make
      ? getModels(item.category, item.make)
      : [];

  return (
    <>
      <TextField
        select
        label="Category"
        value={item.category}
        onChange={(e) =>
          updateEquipment(item.id, "category", e.target.value)
        }
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Manufacturer"
        value={item.make}
        onChange={(e) =>
          updateEquipment(item.id, "make", e.target.value)
        }
      >
        {manufacturers.map((manufacturer) => (
          <MenuItem key={manufacturer} value={manufacturer}>
            {manufacturer}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Model"
        value={item.model}
        onChange={(e) =>
          updateEquipment(item.id, "model", e.target.value)
        }
      >
        {models.map((equipment) => (
          <MenuItem
            key={equipment.id}
            value={equipment.model}
          >
            {equipment.model}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}