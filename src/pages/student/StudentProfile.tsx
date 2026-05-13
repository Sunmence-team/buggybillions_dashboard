import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import SetupPasswordModal from "../../components/modal/SetupPasswordModal";

interface InfoTileProps {
  label: string;
  value: string | null | undefined;
}

const InfoTile: React.FC<InfoTileProps> = ({ label, value }) => (
  <div className="rounded-lg p-4 sm:p-5 shadow-sm border border-gray-100 bg-white">
    <p className="text-xs sm:text-sm text-gray-500">{label}</p>
    <p className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold text-gray-900 break-words overflow-hidden">{value || "—"}</p>
  </div>
);

const StudentProfile: React.FC = () => {
  const { user } = useUser();
  const [isSetupPasswordOpen, setIsSetupPasswordOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
        <div className="rounded-lg border border-gray-200 bg-white px-8 py-10 shadow-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  const nameParts = user?.fullname?.split(" ") || [];
  const firstInitial = nameParts?.[0]?.[0] || "";
  const lastInitial = nameParts?.[1]?.[0] || "";
  const stackTitle = user?.stack_relation?.title || "—";
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student";

  const profileTiles = [
    { label: "Student ID", value: user.bug_id },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.mobile },
    { label: "Username", value: user.username },
    { label: "Stack", value: stackTitle },
    { label: "Department", value: user.department },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="mx-auto w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:text-left text-center">
              <div className="flex shrink-0 h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-purple text-3xl sm:text-4xl font-bold text-white shadow-lg shadow-purple/20">
                {`${firstInitial}${lastInitial}`}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.24em] text-purple-700">Student Profile</p>
                <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">{user.fullname || "Student"}</h1>
                <p className="mt-1 text-sm sm:text-base text-gray-500 capitalize">{roleLabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 w-full lg:w-auto">
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <p className="text-xs sm:text-sm text-gray-500">Stack</p>
                <p className="mt-2 text-base sm:text-lg font-semibold text-slate-900 capitalize">{stackTitle}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <p className="text-xs sm:text-sm text-gray-500">Department</p>
                <p className="mt-2 text-base sm:text-lg font-semibold text-slate-900 capitalize">{user.department || "—"}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <p className="text-xs sm:text-sm text-gray-500">Student ID</p>
                <p className="mt-2 text-base sm:text-lg font-semibold text-slate-900">{user.bug_id || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-12">


          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-lg p-4 sm:p-6 shadow-sm border border-gray-50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {profileTiles.slice(0, 4).map((tile) => (
                  <InfoTile key={tile.label} label={tile.label} value={tile.value} />
                ))}
              </div>
            </div>

            <div className="rounded-lg p-4 sm:p-6 shadow-sm border border-gray-50 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Details</h3>
                <div className="space-y-4">
                  <InfoTile label="Full Name" value={user.fullname} />
                  <InfoTile label="Username" value={user.username} />
                  <InfoTile label="Role" value={roleLabel} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Security</h3>
                <div className="rounded-lg border border-gray-100 bg-slate-50 p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Update your password to keep your account secure. If this is your first time logging in, please set up your new password.
                  </p>
                  <button
                    onClick={() => setIsSetupPasswordOpen(true)}
                    className="px-4 py-2 bg-purple text-white text-sm font-medium rounded-lg hover:bg-purple/90 transition-colors w-full sm:w-auto"
                  >
                    Set Up / Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SetupPasswordModal 
        isOpen={isSetupPasswordOpen} 
        onClose={() => setIsSetupPasswordOpen(false)} 
      />
    </div>
  );
};

export default StudentProfile;