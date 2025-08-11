import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // Optional: enforce password rule check
    const passwordRules = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };

    const allPassed = Object.values(passwordRules).every(Boolean);
    if (!allPassed) {
      setError("Password must meet all strength requirements.");
      return;
    }

    try {
      setLoading(true);
      await register(email, password);
      navigate("/"); // Redirect after success
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Create Account
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-4 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* ✅ Live password validation list */}
            <ul className="text-xs mt-2 space-y-1">
              <li className={password.length >= 8 ? "text-green-600" : "text-red-600"}>
                • At least 8 characters
              </li>
              <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-600"}>
                • 1 uppercase letter
              </li>
              <li className={/\d/.test(password) ? "text-green-600" : "text-red-600"}>
                • 1 number
              </li>
              <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-red-600"}>
                • 1 special symbol (e.g. !@#$)
              </li>
            </ul>
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border px-4 py-2 rounded"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
