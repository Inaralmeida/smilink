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

export const PhoneTextField = (props: ControlledInputProps) => {
  return (
    <MaskedTextField
      {...props}
      mask="(00) 00000-0000"
      label={props.label || "Telefone"}
    />
  );
};
