import { Theme as MuiTheme } from "@mui/material/styles";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends MuiTheme {
    __brand?: "mui-theme";
  }
}
