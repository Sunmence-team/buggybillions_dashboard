import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../helpers/api.tsx";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";
import { Skeleton, TableSkeleton, CardSkeleton } from "../../components/ui/Skeleton";

interface AssignmentDetail {
  id: number;
  student_class_id: number;
  user_id: number;
  weekly_lesson_id: number;
  course_id: string;
  assignment_name: string;
  assignment_description: string;
  file_path: string;
  status: string;
  grade: string | null;
  created_at: string;
  user: {
    id: number;
    fullname: string;
    username: string;
    email: string;
  };
  weekly_lesson: {
    id: number;
    day: string;
    topic: string;
  };
  course: {
    id: string;
    title: string;
  };
  student_class: {
    id: number;
    name: string;
  };
}

const GradeAssignment = () => {
  const { token } = useUser();
  const [assignments, setAssignments] = useState<AssignmentDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentDetail | null>(null);
  const [grade, setGrade] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [token]);

  const fetchAssignments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/api/assignments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data?.assignments || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const selectAssignment = (assignment: AssignmentDetail) => {
    setSelectedAssignment(assignment);
    setGrade(assignment.grade?.toString() || "");
  };

  const handleSubmitGrade = async () => {
    if (!token || !selectedAssignment) return;
    if (grade === "") {
      toast.error("Please enter a grade");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/api/assignments/${selectedAssignment.id}/grade`, 
        { grade: parseInt(grade) },
        { headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Grade submitted successfully!");
      
      const updatedAssignments = assignments.map(a => 
        a.id === selectedAssignment.id ? { ...a, grade: grade, status: "graded" } : a
      );
      setAssignments(updatedAssignments);
      setSelectedAssignment({ ...selectedAssignment, grade: grade, status: "graded" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit grade");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "bg-yellow-100 text-yellow-700";
      case "submitted": return "bg-blue-100 text-blue-700";
      case "graded": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const isGraded = selectedAssignment?.grade !== null && selectedAssignment?.grade !== undefined;

  return (
    <div className="w-full space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-tetiary">Grade Assignment</h1>
        <p className="text-gray-500 mt-1">Review and grade student submissions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          All Assignments ({assignments.length})
        </h2>

        {loading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : assignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No assignments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-[#ECFFFC]">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-l-xl">Assignment</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lesson</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignments.map((assignment, index) => (
                  <motion.tr
                    key={assignment.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`hover:bg-gray-50 transition-colors ${selectedAssignment?.id === assignment.id ? 'bg-purple/5' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-purple">{assignment.assignment_name}</div>
                      <div className="text-gray-500 text-xs max-w-xs truncate mt-1">{assignment.assignment_description}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{assignment.user?.fullname || assignment.user?.username}</div>
                      <div className="text-gray-500 text-xs">{assignment.user?.email}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{assignment.course?.title || "-"}</td>
                    <td className="px-5 py-4 text-gray-500">
                      {assignment.weekly_lesson?.day} - {assignment.weekly_lesson?.topic}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{assignment.student_class?.name || "-"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {assignment.grade !== null ? (
                        <span className="font-semibold text-purple">{assignment.grade}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectAssignment(assignment)}
                        className="px-4 py-2 bg-purple/10 text-purple rounded-lg text-xs font-semibold hover:bg-purple/20 transition-colors"
                      >
                        View
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedAssignment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Assignment Details</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAssignment.status)}`}>
                {selectedAssignment.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Assignment Name</p>
                <p className="font-semibold text-purple text-lg">{selectedAssignment.assignment_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">{selectedAssignment.assignment_description || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-medium text-gray-900">{selectedAssignment.user?.fullname || selectedAssignment.user?.username}</p>
                <p className="text-sm text-gray-500">{selectedAssignment.user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-medium text-gray-900">{selectedAssignment.course?.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Lesson</p>
                <p className="font-medium text-gray-900">{selectedAssignment.weekly_lesson?.day} - {selectedAssignment.weekly_lesson?.topic}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium text-gray-900">{selectedAssignment.student_class?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-700">{new Date(selectedAssignment.created_at).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Current Grade</p>
                <p className="font-semibold text-lg">{selectedAssignment.grade ?? "Not graded"}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold mb-4 text-gray-900">Submit Grade</h3>
              <div className="flex gap-4 max-w-md">
                <input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  min="0"
                  max="100"
                  disabled={isGraded}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter grade (0-100)"
                />
                <motion.button
                  whileHover={{ scale: isGraded || submitting ? 1 : 1.02 }}
                  whileTap={{ scale: isGraded || submitting ? 1 : 0.98 }}
                  onClick={handleSubmitGrade}
                  disabled={submitting || isGraded}
                  className="px-8 py-3.5 bg-purple text-white font-semibold rounded-xl shadow-lg shadow-purple/25 hover:shadow-purple/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : isGraded ? (
                    "Graded"
                  ) : (
                    "Submit Grade"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GradeAssignment;
