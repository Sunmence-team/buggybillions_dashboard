import React from 'react'
import OverviewCards from '../../components/cards/OverviewCards'
import { HiOutlineIdentification } from 'react-icons/hi'
import { formatterUtility } from '../../helpers/formatterUtility'

const AdminOverview: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <OverviewCards
          icon={<HiOutlineIdentification size={"30px"} />}
          label="Total Students"
          value={formatterUtility(20)}
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />
        <OverviewCards
          icon={<HiOutlineIdentification size={"30px"} />}
          label="Total Tutors"
          value={formatterUtility(30)}
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />
      </div>
    </div>
  )
}

export default AdminOverview