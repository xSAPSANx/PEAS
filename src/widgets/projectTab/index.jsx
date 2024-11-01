/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import '../staffTab/lib/ag-grid.css'
import '../staffTab/lib/ag-theme-quartz.css'

export const ProjectTab = ({ projects, lastClick }) => {
	const selectedProject = useMemo(() => {
		const findProjectById = (projectList, id) => {
			for (const project of projectList) {
				if (project.id === id) return project
				if (project.children) {
					const found = findProjectById(project.children, id)
					if (found) return found
				}
			}
			return null
		}
		return findProjectById(projects.items, lastClick?.id)
	}, [projects, lastClick])

	const [colDefs] = useState([
		{ field: 'FullName', headerName: 'ФИО', width: 300 },
		{ field: 'Grade', width: 100 },
		{ field: 'ProjectName', headerName: 'Название проекта', width: 295 },
		{ field: 'id', headerName: 'ID', width: 300, hide: true },
	])

	const rowData = useMemo(() => selectedProject?.staff || [], [selectedProject])

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
