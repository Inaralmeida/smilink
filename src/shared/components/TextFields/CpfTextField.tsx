/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TextFieldProps } from "@mui/material";
import { type Control } from "react-hook-form";
import { MaskedTextField } from "./MaskedTextField";

type ControlledInputProps = Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "onBlur"
> & {
  name: string;
  control: Control<any>;
};

export const CpfTextField = (props: ControlledInputProps) => {
  return (
    <MaskedTextField
      {...props}
      mask="000.000.000-00"
      label={props.label || "CPF"}
    />
  );
};
