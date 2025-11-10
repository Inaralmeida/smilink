/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type TextFieldProps,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { type Control } from "react-hook-form";
import { MaskedTextField } from "./MaskedTextField";

type CepTextFieldProps = Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "onBlur"
> & {
  name: string;
  control: Control<any>;
  loading?: boolean;
};

export const CepTextField = ({ loading, ...props }: CepTextFieldProps) => {
  return (
    <MaskedTextField
      {...props}
      mask="00000-000"
      label={props.label || "CEP"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {loading && <CircularProgress size={20} />}
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
    />
  );
};
