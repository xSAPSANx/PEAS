/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Box,
	MenuItem,
	Select,
	FormControl,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { postStaff, increment } from '../../pages/Staff/model/staffSlice'
import { patchProjects } from '../../pages/Home/model/projectSlice'

const flattenProjects = projects => {
	const flattened = []
	const traverse = project => {
		if (project && project.projectName) {
			flattened.push(project.projectName)
			if (project.children && project.children.length) {
				project.children.forEach(child => traverse(child))
			}
		}
	}
	if (Array.isArray(projects)) {
		projects.forEach(project => traverse(project))
	} else if (projects && typeof projects === 'object') {
		traverse(projects)
	} else {
		console.warn('Projects is not an array or object:', projects)
		return []
	}
	return flattened
}

const findProjectByName = (projects, projectName) => {
	if (!projects) return null
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

const StaffModal = ({ isOpen, onClose, projects = [], onCreate }) => {
	const [fullName, setFullName] = useState('')
	const [grade, setGrade] = useState('')
	const [projectName, setProjectName] = useState('')

	const flattenedProjects = flattenProjects(projects || [])

	const handleSubmit = e => {
		e.preventDefault()
		if (fullName && grade && projectName) {
			const newStaff = {
				FullName: fullName,
				Grade: grade,
				ProjectName: projectName,
				id: Math.random().toString(36).substr(2, 9),
			}
			onCreate(newStaff)
			setFullName('')
			setGrade('')
			setProjectName('')
			onClose()
		} else {
			alert('Пожалуйста, заполните все поля.')
		}
	}

	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>Добавить нового сотрудника</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin='dense'
					label='ФИО'
					type='text'
					fullWidth
					variant='outlined'
					value={fullName}
					onChange={e => setFullName(e.target.value)}
					required
				/>
				<FormControl fullWidth margin='dense'>
					<Select value={grade} onChange={e => setGrade(e.target.value)} displayEmpty variant='outlined'>
						<MenuItem value=''>
							<em>Выберите уровень</em>
						</MenuItem>
						<MenuItem value='Junior'>Junior</MenuItem>
						<MenuItem value='Middle'>Middle</MenuItem>
						<MenuItem value='Senior'>Senior</MenuItem>
					</Select>
				</FormControl>
				<FormControl fullWidth margin='dense'>
					<Select value={projectName} onChange={e => setProjectName(e.target.value)} displayEmpty variant='outlined'>
						<MenuItem value=''>
							<em>Выберите проект</em>
						</MenuItem>
						{flattenedProjects.map((name, index) => (
							<MenuItem key={index} value={name}>
								{name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='primary'>
					Закрыть
				</Button>
				<Button onClick={handleSubmit} color='primary'>
					Добавить
				</Button>
			</DialogActions>
		</Dialog>
	)
}

const StaffManager = ({ projects }) => {
	const [isModalOpen, setModalOpen] = useState(false)
	const dispatch = useDispatch()

	const handleCreate = newStaff => {
		dispatch(postStaff(newStaff))
		dispatch(increment())

		// Находим проект и обновляем его
		const project = findProjectByName(projects, newStaff.ProjectName)
		if (project) {
			const updatedProject = {
				...project,
				staff: [...(project.staff || []), newStaff],
			}
			dispatch(patchProjects(updatedProject))
		} else {
			console.warn('Проект не найден:', newStaff.ProjectName)
		}
	}

	return (
		<Box p={2}>
			<Button variant='contained' color='primary' onClick={() => setModalOpen(true)}>
				Добавить сотрудника
			</Button>
			<StaffModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
				projects={projects}
				onCreate={handleCreate}
			/>
		</Box>
	)
}

export default StaffManager
