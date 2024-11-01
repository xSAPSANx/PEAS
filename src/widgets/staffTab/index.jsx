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
	Alert,
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

const canAddStaffToProject = (projects, projectName) => {
	for (const project of projects) {
		if (project.projectName === projectName) {
			const currentStaffCount = (project.staff || []).length
			const maxStaffNum = project.maxStaffNum || Infinity
			return currentStaffCount < maxStaffNum
		}

		if (project.children && project.children.length > 0) {
			const canAdd = canAddStaffToProject(project.children, projectName)
			if (canAdd) {
				return true
			}
		}
	}
	return false
}

const updateProjects = (projects, projectName, staffMember, action) => {
	let updatedProject = null

	const updatedProjects = projects.map(project => {
		let newProject = { ...project }

		if (project.projectName === projectName) {
			if (action === 'add') {
				const staffIds = (project.staff || []).map(member => member.id)
				if (!staffIds.includes(staffMember.id)) {
					newProject.staff = [...(project.staff || []), staffMember]
				}
			} else if (action === 'remove') {
				newProject.staff = (project.staff || []).filter(member => member.id !== staffMember.id)
			} else if (action === 'update') {
				newProject.staff = (project.staff || []).map(member => (member.id === staffMember.id ? staffMember : member))
			}
			updatedProject = newProject
		}

		if (project.children && project.children.length > 0) {
			const result = updateProjects(project.children, projectName, staffMember, action)
			newProject.children = result.updatedProjects
			if (result.updatedProject) {
				updatedProject = { ...newProject }
			}
		}

		return newProject
	})

	return { updatedProjects, updatedProject }
}

const StaffTab = ({ staff, projects }) => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false)
	const [errorOpen, setErrorOpen] = useState(false)
	const [editData, setEditData] = useState({ FullName: '', Grade: '', ProjectName: '', id: '' })
	const [originalProjectName, setOriginalProjectName] = useState('')

	const handleOpen = data => {
		setEditData(data)
		setOriginalProjectName(data.ProjectName)
		setOpen(true)
	}

	const handleClose = () => setOpen(false)
	const handleErrorClose = () => setErrorOpen(false)

	const handleSave = () => {
		let updatedProjects = [...projects]

		if (editData.ProjectName !== originalProjectName) {
			const canAdd = canAddStaffToProject(projects, editData.ProjectName)

			if (!canAdd) {
				setErrorOpen(true)
				return
			}

			const { updatedProjects: tempProjects, updatedProject: removedProject } = updateProjects(
				updatedProjects,
				originalProjectName,
				editData,
				'remove'
			)
			updatedProjects = tempProjects

			if (removedProject) {
				dispatch(patchProjects(removedProject))
			}

			const { updatedProjects: finalProjects, updatedProject: addedProject } = updateProjects(
				updatedProjects,
				editData.ProjectName,
				editData,
				'add'
			)
			updatedProjects = finalProjects

			if (addedProject) {
				dispatch(patchProjects(addedProject))
			}
		} else {
			const { updatedProjects: finalProjects, updatedProject } = updateProjects(
				updatedProjects,
				editData.ProjectName,
				editData,
				'update'
			)
			updatedProjects = finalProjects

			if (updatedProject) {
				dispatch(patchProjects(updatedProject))
			}
		}

		dispatch(patchStaff(editData))

		handleClose()
	}

	const handleDelete = data => {
		dispatch(deleteStaff(data.id))

		let updatedProjects = [...projects]
		const { updatedProjects: finalProjects, updatedProject } = updateProjects(
			updatedProjects,
			data.ProjectName,
			data,
			'remove'
		)
		updatedProjects = finalProjects

		if (updatedProject) {
			dispatch(patchProjects(updatedProject))
		}
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
			<IconButton onClick={() => handleDelete(params.data)} sx={{ marginLeft: 3 }}>
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
				<AgGridReact rowData={rowData} columnDefs={colDefs} />
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

			<Dialog open={errorOpen} onClose={handleErrorClose}>
				<DialogTitle>Ошибка</DialogTitle>
				<DialogContent>
					<Alert severity='error'>В проекте достигнут лимит сотрудников</Alert>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleErrorClose} color='primary'>
						Ок
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default StaffTab
