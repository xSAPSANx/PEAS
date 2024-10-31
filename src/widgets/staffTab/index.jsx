/* eslint-disable react/prop-types */
import { AgGridReact } from 'ag-grid-react'
import '../staffTab/lib/ag-grid.css'
import '../staffTab/lib/ag-theme-quartz.css'
import {
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Select,
	MenuItem,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { deleteStaff, patchStaff } from '../../pages/Staff/model/staffSlice'
import { patchProjects } from '../../pages/Home/model/projectSlice'

const flattenProjects = projects => {
	const flattened = []
	const traverse = project => {
		flattened.push(project.projectName)
		if (project.children && project.children.length) {
			project.children.forEach(child => traverse(child))
		}
	}
	if (Array.isArray(projects)) {
		projects.forEach(project => traverse(project))
	}
	return flattened
}

const findProjectByName = (projects, projectName) => {
	for (const project of projects) {
		if (project.projectName === projectName) {
			return project
		}
		if (project.children) {
			const found = findProjectByName(project.children, projectName)
			if (found) return found
		}
	}
	return null
}

const StaffTab = ({ staff, projects }) => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false)
	const [editData, setEditData] = useState({ FullName: '', Grade: '', ProjectName: '', id: '' })
	const [originalProjectName, setOriginalProjectName] = useState('')

	const handleOpen = data => {
		setEditData(data)
		setOriginalProjectName(data.ProjectName)
		setOpen(true)
	}

	const handleClose = () => setOpen(false)

	const handleSave = () => {
		if (editData.ProjectName !== originalProjectName) {
			// Удаляем сотрудника из старого проекта
			const oldProject = findProjectByName(projects, originalProjectName)
			if (oldProject) {
				const updatedOldProject = {
					id: oldProject.id,
					...oldProject,
					staff: oldProject.staff.filter(member => member.id !== editData.id),
				}
				dispatch(patchProjects(updatedOldProject))
			}

			// Добавляем сотрудника в новый проект
			const newProject = findProjectByName(projects, editData.ProjectName)
			if (newProject) {
				const updatedNewProject = {
					id: newProject.id,
					...newProject,
					staff: [...(newProject.staff || []), editData],
				}
				dispatch(patchProjects(updatedNewProject))
			}
		}

		// Обновляем данные сотрудника
		dispatch(patchStaff(editData))
		handleClose()
	}

	const handleChange = e => {
		const { name, value } = e.target
		setEditData(prev => ({ ...prev, [name]: value }))
	}

	const flattenedProjects = flattenProjects(projects || [])

	const cellButtons = params => (
		<div style={{ marginLeft: 5 }}>
			<IconButton onClick={() => handleOpen(params.data)}>
				<EditIcon sx={{ fontSize: 16 }} />
			</IconButton>
			<IconButton onClick={() => dispatch(deleteStaff(params.data.id))} sx={{ marginLeft: 3 }}>
				<DeleteIcon sx={{ fontSize: 16, color: '#DC143C' }} />
			</IconButton>
		</div>
	)

	const [colDefs] = useState([
		{ field: 'FullName', headerName: 'ФИО', width: 300 },
		{ field: 'Grade', width: 150 },
		{ field: 'ProjectName', headerName: 'Название проекта', width: 250 },
		{
			field: 'Settings',
			headerName: 'Настройки',
			width: 120,
			cellRenderer: cellButtons,
		},
		{ field: 'id', headerName: 'ID', width: 300, hide: true },
	])

	const rowData = useMemo(() => (Array.isArray(staff.items) ? staff.items : []), [staff.items])

	return (
		<>
			<div className='ag-theme-quartz' style={{ height: 800 }}>
				<AgGridReact
					rowData={rowData}
					columnDefs={colDefs}
					paginationPageSize={10}
					paginationPageSizeSelector={[10, 20]}
				/>
			</div>

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Редактировать сотрудника</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin='dense'
						label='ФИО'
						name='FullName'
						type='text'
						fullWidth
						variant='outlined'
						value={editData.FullName}
						onChange={handleChange}
					/>
					<Select
						margin='dense'
						name='Grade'
						fullWidth
						variant='outlined'
						value={editData.Grade}
						onChange={handleChange}
					>
						<MenuItem value='Junior'>Junior</MenuItem>
						<MenuItem value='Middle'>Middle</MenuItem>
						<MenuItem value='Senior'>Senior</MenuItem>
					</Select>
					<Select
						margin='dense'
						name='ProjectName'
						fullWidth
						variant='outlined'
						value={editData.ProjectName}
						onChange={handleChange}
						renderValue={selected => selected}
					>
						{flattenedProjects.map((name, index) => (
							<MenuItem key={index} value={name}>
								{name}
							</MenuItem>
						))}
					</Select>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						Отмена
					</Button>
					<Button onClick={handleSave} color='primary'>
						Сохранить
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default StaffTab
