import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaBriefcase, FaIdBadge, FaBook, FaCode } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import SetupPasswordModal from "../../components/modal/SetupPasswordModal";

interface InfoTileProps {
  label: string;
  value: string | null | undefined;
  icon: React.ComponentType<{ className?: string }>;
}

const InfoTile: React.FC<InfoTileProps> = ({ label, value, icon: Icon }) => (
  <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <Icon className="text-purple text-lg" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    <p className="text-lg font-semibold text-gray-900 break-words overflow-hidden">{value || "—"}</p>
  </div>
);

const TutorProfile: React.FC = () => {
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
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Tutor";

  const profileTiles = [
    { label: "Email", value: user?.email, icon: FaEnvelope },
    { label: "Tutor ID", value: user?.bug_id, icon: FaIdBadge },
    { label: "Department", value: (user as any)?.department, icon: FaBook },
    { label: "Stack", value: stackTitle, icon: FaCode },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className=" px-8 py-10 sm:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple text-4xl font-bold text-white shadow-lg shadow-purple/20">
                {`${firstInitial}${lastInitial}`}
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-purple-700">Tutor Profile</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">{user?.fullname || "Tutor"}</h1>
                <p className="mt-1 text-gray-500 capitalize">{roleLabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500">Stack</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 capitalize">{stackTitle}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500">Department</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 capitalize">{(user as any)?.department || "—"}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500">Tutor ID</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user?.bug_id || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 sm:px-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">About</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                This is your tutor profile page. Review your professional details and account information in a clean, easy-to-read layout.
              </p>
            </div>
            
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-slate-50/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Professional Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {profileTiles.map((tile) => (
                  <InfoTile key={tile.label} label={tile.label} value={tile.value} icon={tile.icon} />
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-6 shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Details</h3>
                <div className="space-y-4">
                  <InfoTile label="Full Name" value={user?.fullname} icon={FaUser} />
                  <InfoTile label="Role" value={roleLabel} icon={FaBriefcase} />
                  <InfoTile label="Stack" value={stackTitle} icon={FaCode} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Security</h3>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
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

export default TutorProfile;

