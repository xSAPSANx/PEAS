import { AgGridReact } from 'ag-grid-react'
import '../Staff/lib/ag-grid.css'
import '../Staff/lib/ag-theme-quartz.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchStaff } from './model/staffSlice'

const StaffTab = () => {
	const dispatch = useDispatch()
	const { staff } = useSelector(state => state.staff)

	const [colDefs, setColDefs] = useState([
		{ field: 'FullName', width: 300 },
		{ field: 'Grade' },
		{ field: 'ProjectName' },
	])

	useEffect(() => {
		dispatch(fetchStaff())
	}, [])

	return (
		<div className='ag-theme-quartz' style={{ height: 1080 }}>
			<AgGridReact rowData={staff.items} columnDefs={colDefs} />
		</div>
	)
}

export default StaffTab
