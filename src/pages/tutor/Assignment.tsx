import React from "react";
import { toast } from "sonner";
import api from "../../helpers/api";
import ReusableTable from "../../utility/ReusableTable";
import { useUser } from "../../context/UserContext";
import ActionCell from "../../utility/ActionCell";
import Modal from "../../components/modal/Modal";
import GradeForm from "../../components/forms/GradeForm";

const STORAGE_API_URL = import.meta.env.VITE_STORAGE_BASE_URL;

const Assignment = () => {
  const { user } = useUser()

  const [loading, setLoading] = React.useState(false)
  const [fetchData, setFetchData] = React.useState<any[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(10)
  const [totalItem, setTotalItem] = React.useState(10)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const [modal, setModal] = React.useState(false)
  const [selectedAssignmentId, setSelectedAssignmentId] = React.useState<number | null>(null)


  const columns = [
    {
      title: 'USER ID',
      render: (item: any) => item.user_id
    },
    {
      title: 'TITLE',
      render: (item: any) => item.assignment_name
    },
    {
      title: 'DESCRIPTION',
      render: (item: any) => item.assignment_description
    },
    {
      title: 'GRADE',
      render: (item: any) => <span
        className={`px-3 py-1 rounded-full text-xs font-medium
        ${item.grade < 50
            ? 'bg-red-100 text-red-700'
            : 'bg-purple-100 text-purple'
          }
      `}
      >
        {item.grade ?? "Not Graded"}
      </span>
    },
    {
      title: 'Status',
      render: (item: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
        ${item.status === 'submitted'
              ? 'bg-green-100 text-green-700'
              : 'bg-purple-100 text-purple'
            }
      `}
        >
          {item.status}
        </span>
      )
    },
    {
      title: 'ACTION',
      render: (item: any) => (
        <ActionCell
          rowId={item.user_id}
          onGrade={() => {
            setSelectedAssignmentId(item.id) // <-- store the assignment ID
            setModal(true)
          }}
          canView={true}
          disabled={item.status === 'graded'}
          onDownloadAttached={() => {
            const link = document.createElement('a');
            link.href = `${STORAGE_API_URL}/${item?.file_path}`;
            link.download = `${item?.fullname || 'student'}-assignment`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        />

      )
    }

  ]

  const fetchAssignment = async () => {
    const token = localStorage.getItem('token')
    if (!token) return;
    setLoading(true)
    try {
      const response = await api.get(`/api/tutors/${user?.id}/assignments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200 || response.status === 201) {
        console.log(response.data)
        setFetchData(response.data.assignments)
      }

    } catch (error: any) {
      const errMessage = error.response?.data?.message || error.message
      toast.error(errMessage)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (user?.id) {
      fetchAssignment()
    }
  }, [user?.id])

  const handleGradeSuccess = () => {
  fetchAssignment(); // refetch table data
  setModal(false);
};



  return (
    <>
      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-8 text-black ">
          Assignment
        </h2>

        <div className="mt-">
          <ReusableTable
            columns={columns}
            data={fetchData}
            isLoading={loading}
            error={null}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItem}
            setCurrentPage={setCurrentPage}
            hasSerialNo={true}
          />
        </div>

        {modal && (
          <Modal onClose={() => setModal(false)}>
            <GradeForm
              assignmentId={selectedAssignmentId!} 
              onClose={() => setModal(false)}
              onSuccess={handleGradeSuccess}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default Assignment;
