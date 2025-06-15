import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default Unauthorized;
