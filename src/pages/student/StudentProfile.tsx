import React from "react";
import { useUser } from "../../context/UserContext"; // make sure the path is correct

/* =======================
   Read-Only Input Component
======================= */
interface ReadOnlyInputProps {
  label: string;
  value: string | null | undefined;
}

const ReadOnlyInput: React.FC<ReadOnlyInputProps> = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="w-full px-3 py-2 rounded-lg bg-purple/30 border border-transparent">
      {value || "—"}
    </div>
  </div>
);

const StudentProfile: React.FC = () => {
  const { user } = useUser(); // Get user from context
  const splitedFirstName = user?.fullname.split(" ")?.[0]
  const splitedLastName = user?.fullname.split(" ")?.[1]

  const splitedFirstLetterOfFirstName = splitedFirstName?.trim()[0]
  const splitedFirstLetterOfLastName = splitedLastName?.trim()[0]
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }


  return (
    <div className=" bg-white flex justify-center px-4 py-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-center mb-8">
          Your Profile
        </h1>

        {/* Profile Pic + Name + Stack */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-28 h-28 rounded-full bg-purple flex items-center justify-center text-white text-3xl font-semibold">
             {`${splitedFirstLetterOfFirstName}${splitedFirstLetterOfLastName ? splitedFirstLetterOfLastName : ""}`}
          </div>

          <h2 className="mt-4 text-[20px] font-bold text-purple/90">{user.fullname || "—"}</h2>

          <p className="text-[16px] text-black capitalize">{user.stack || "—"}</p>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReadOnlyInput label="Full Name" value={user.fullname} />
            <ReadOnlyInput label="Email" value={user.email} />
            <ReadOnlyInput label="Phone Number" value={user.mobile} />
            <ReadOnlyInput label="Username" value={user.username} />
            <ReadOnlyInput label="Stack" value={user.stack} />
            <ReadOnlyInput label="Department" value={user.department} />
            <ReadOnlyInput label="Bug ID" value={user.bug_id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
