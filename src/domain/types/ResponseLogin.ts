import type { TLoginFields } from "../fieldsForms/login";
import type { TUserProps } from "./users";

export type TResponseLogin = {
  type: TLoginFields | "success";
  message: string;
  user?: TUserProps;
};
