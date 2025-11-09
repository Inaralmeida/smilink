import { useState } from "react";
import { Autocomplete, TextField, Chip, Box, Typography } from "@mui/material";

type SeletorTagsProps = {
  label: string;
  opcoes: string[];
  valores: string[];
  onChange: (valores: string[]) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
};

/**
 * Componente de seleção com tags (Autocomplete)
 * Permite buscar e adicionar múltiplos itens como tags
 */
const SeletorTags = ({
  label,
  opcoes,
  valores,
  onChange,
  placeholder = "Digite para buscar...",
  error = false,
  helperText,
}: SeletorTagsProps) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <Autocomplete
      multiple
      options={opcoes}
      value={valores}
      onChange={(_, novosValores) => {
        onChange(novosValores);
      }}
      inputValue={inputValue}
      onInputChange={(_, novoInputValue) => {
        setInputValue(novoInputValue);
      }}
      filterSelectedOptions
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
              "& fieldset": {
                borderColor: error ? "#d32f2f" : "#E7F2F4",
              },
              "&:hover fieldset": {
                borderColor: error ? "#d32f2f" : "#037F8C",
              },
              "&.Mui-focused fieldset": {
                borderColor: error ? "#d32f2f" : "#037F8C",
              },
            },
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            label={option}
            sx={{
              backgroundColor: "#037F8C",
              color: "#fff",
              "& .MuiChip-deleteIcon": {
                color: "#fff",
                "&:hover": {
                  color: "#E7F2F4",
                },
              },
            }}
          />
        ))
      }
      sx={{
        "& .MuiAutocomplete-inputRoot": {
          padding: "4px 8px",
        },
      }}
    />
  );
};

export default SeletorTags;
