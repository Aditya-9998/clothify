import { useAuth } from "../contexts/AuthContext";

const TestAuthStatus = () => {
  const { user } = useAuth(); // ✅ will now work safely

  return (
    <div>
      <h2>Test Auth Status</h2>
      <p>User: {user ? user.email : "❌ Not Logged In"}</p>
    </div>
  );
};

export default TestAuthStatus;
