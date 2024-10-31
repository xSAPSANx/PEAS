import { useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import '../staffTab/lib/ag-grid.css'
import '../staffTab/lib/ag-theme-quartz.css'

export const ProjectTab = staff => {
	const [rowData, setRowData] = useState([
		{
			id: '045h84hl3',
			FullName: 'Жуков Антон Антонович',
			Grade: 'Junior',
			ProjectName: 'test',
		},
		{
			id: 'lsmfmphq7',
			FullName: 'Polina',
			Grade: 'Middle',
			ProjectName: 'Telegtam',
		},
		{
			id: 'h2yivr7yi',
			FullName: 'qqqq',
			Grade: 'Junior',
			ProjectName: 'Frontend ',
		},
		{
			id: 'fxd7nnl82',
			FullName: 'tttt',
			Grade: 'Middle',
			ProjectName: 'Frontend ',
		},
	])
	const [colDefs] = useState([
		{ field: 'FullName', headerName: 'ФИО', width: 300 },
		{ field: 'Grade', width: 100 },
		{ field: 'ProjectName', headerName: 'Название проекта', width: 295 },
		{ field: 'id', headerName: 'ID', width: 300, hide: true },
	])

	//const rowData = useMemo(() => (Array.isArray(staff.items) ? staff.items : []), [staff.items])

	return (
		<>
			<div className='ag-theme-quartz' style={{ height: 500, width: 700, marginTop: 18 }}>
				<AgGridReact
					rowData={rowData}
					columnDefs={colDefs}
					paginationPageSize={10}
					paginationPageSizeSelector={[10, 20]}
				/>
			</div>
		</>
	)
}
