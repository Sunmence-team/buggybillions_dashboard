import React from "react";
import { useUser } from "../../context/UserContext";

const TutorProfile: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-2 text-tetiary">Tutor Profile</h1>
      <p className="text-gray-500 mb-6">View your profile information</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <p className="text-lg font-medium mt-1">{user?.fullname || "—"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg mt-1">{user?.email || "—"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <p className="text-lg mt-1 capitalize">{user?.role || "—"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">User ID</label>
            <p className="text-lg mt-1">{user?.id || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;