import React, { useEffect, useState } from "react";
import OverviewCards from "../../components/cards/OverviewCards";
import { HiOutlineIdentification } from "react-icons/hi";
import { formatterUtility } from "../../helpers/formatterUtility";
import api from "../../helpers/api";

const AdminOverview: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTutors, setTotalTutors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [studentsRes, tutorsRes] = await Promise.all([
          api.get("/api/all_students"),
          api.get("/api/all_tutors"),
        ]);

        const students = studentsRes.data.students || studentsRes.data || [];
        const tutors = tutorsRes.data.tutors || tutorsRes.data || [];

        setTotalStudents(students.length);
        setTotalTutors(tutors.length);
      } catch (error) {
        console.error("Failed to fetch counts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <OverviewCards
          icon={<HiOutlineIdentification size={"30px"} />}
          label="Total Students"
          value={formatterUtility(loading ? 0 : totalStudents)}
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />

        <OverviewCards
          icon={<HiOutlineIdentification size={"30px"} />}
          label="Total Tutors"
          value={formatterUtility(loading ? 0 : totalTutors)}
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />
      </div>
    </div>
  );
};

export default AdminOverview;
