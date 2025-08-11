import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Your Profile</h2>
        <div className="text-left space-y-3">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.uid}</p>
        </div>

        <button
          onClick={logout}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
