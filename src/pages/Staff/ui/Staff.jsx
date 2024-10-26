import { AgGridReact } from 'ag-grid-react'
import '../lib/ag-grid.css'
import '../lib/ag-theme-quartz.css'
import axios from 'axios'
import { useEffect, useState } from 'react'

const StaffTab = () => {
	const [rowData, setRowData] = useState([])
	// const [projects, setProjects] = useState([])
	const [colDefs, setColDefs] = useState([
		{ field: 'FullName', width: 300 },
		{ field: 'Grade' },
		{
			field: 'ProjectName',
			cellEditor: 'agSelectCellEditor',
			cellEditorParams: {
				values: ['Яндекс', 'СТЦ'],
			},
		},
	])

	// console.log(projects)

	useEffect(() => {
		axios.get('http://localhost:3000/staff').then(response => {
			setRowData(response.data)
			return response
		})
		// .then(response => {
		// 	setProjects(
		// 		response.data.map(item => {
		// 			return item.ProjectName
		// 		})
		// 	)
		// })
	}, [])

	return (
		<div className='ag-theme-quartz' style={{ height: 1080 }}>
			<AgGridReact rowData={rowData} columnDefs={colDefs} />
		</div>
	)
}

export default StaffTab
