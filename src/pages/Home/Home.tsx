import Dashboard from "../../module/dashboard/Dashboard";
import { getRole } from "../../service/http/storage";

const Home = () => {
  const role = getRole();
  return <Dashboard role={role} />;
};

export default Home;
