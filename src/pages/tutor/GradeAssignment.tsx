import { useState, useEffect } from "react";
import api from "../../helpers/api";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";

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

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tetiary">Grade Assignment</h1>
        <p className="text-gray-500">View and grade student submissions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">All Assignments ({assignments.length})</h2>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No assignments found</p>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-[#ECFFFC] rounded-xl">
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap rounded-l-xl">Assignment</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Course</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Lesson</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Grade</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr 
                    key={assignment.id || index} 
                    className={`h-12 border-b border-black/10 hover:bg-gray-50 transition ${selectedAssignment?.id === assignment.id ? 'bg-purple/5' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="font-semibold text-purple">{assignment.assignment_name}</div>
                      <div className="text-gray-500 text-xs max-w-xs truncate">{assignment.assignment_description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="font-medium">{assignment.user?.fullname || assignment.user?.username}</div>
                      <div className="text-gray-500 text-xs">{assignment.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">{assignment.course?.title || "-"}</td>
                    <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">
                      {assignment.weekly_lesson?.day} - {assignment.weekly_lesson?.topic}
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">{assignment.student_class?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {assignment.grade !== null ? (
                        <span className="font-semibold text-purple">{assignment.grade}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <button
                        onClick={() => selectAssignment(assignment)}
                        className="px-3 py-1.5 bg-purple/10 text-purple rounded-lg text-xs font-medium hover:bg-purple/20 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAssignment && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-tetiary">Grade Selected Assignment</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAssignment.status)}`}>
              {selectedAssignment.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Assignment Name</p>
              <p className="font-semibold text-purple">{selectedAssignment.assignment_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700">{selectedAssignment.assignment_description || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium">{selectedAssignment.user?.fullname || selectedAssignment.user?.username}</p>
              <p className="text-sm text-gray-500">{selectedAssignment.user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Course</p>
              <p className="font-medium">{selectedAssignment.course?.title}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Lesson</p>
              <p className="font-medium">{selectedAssignment.weekly_lesson?.day} - {selectedAssignment.weekly_lesson?.topic}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Class</p>
              <p className="font-medium">{selectedAssignment.student_class?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-gray-700">{new Date(selectedAssignment.created_at).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Current Grade</p>
              <p className="font-semibold">{selectedAssignment.grade ?? "Not graded"}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5 mt-5">
            <h3 className="font-semibold mb-3 text-gray-800">Submit Grade</h3>
            <div className="flex gap-3 max-w-md">
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                min="0"
                max="100"
                disabled={selectedAssignment?.grade !== null && selectedAssignment?.grade !== undefined}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter grade (0-100)"
              />
              <button
                type="button"
                onClick={handleSubmitGrade}
                disabled={submitting || (selectedAssignment?.grade !== null && selectedAssignment?.grade !== undefined)}
                className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : selectedAssignment?.grade !== null && selectedAssignment?.grade !== undefined ? "Graded" : "Submit Grade"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeAssignment;
