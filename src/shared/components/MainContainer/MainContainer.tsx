import { type ReactNode } from "react";

const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
};

export default MainContainer;
