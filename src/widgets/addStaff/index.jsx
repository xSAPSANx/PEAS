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
	Alert,
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

// Функция для проверки возможности добавления сотрудника в проект
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

// Обновлённая функция updateProjects, возвращающая изменённый проект и индексный путь
const updateProjects = (projects, projectName, staffMember, path = []) => {
	let updatedProject = null
	let updatedIndex = null

	const updatedProjects = projects.map((project, index) => {
		let newProject = { ...project }
		const currentPath = [...path, index]

		// Если название проекта совпадает, обновляем массив staff
		if (project.projectName === projectName) {
			const staffIds = (project.staff || []).map(member => member.id)
			if (!staffIds.includes(staffMember.id)) {
				newProject.staff = [...(project.staff || []), staffMember]
			}
			updatedProject = newProject
			updatedIndex = currentPath
		}

		// Рекурсивно обновляем детей
		if (project.children && project.children.length > 0) {
			const result = updateProjects(project.children, projectName, staffMember, currentPath)
			newProject.children = result.updatedProjects
			if (result.updatedProject) {
				updatedProject = result.updatedProject
				updatedIndex = result.updatedIndex
			}
		}

		return newProject
	})

	return { updatedProjects, updatedProject, updatedIndex }
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
	const [errorOpen, setErrorOpen] = useState(false) // Состояние для управления модальным окном ошибки
	const dispatch = useDispatch()

	const handleCreate = newStaff => {
		// Проверяем возможность добавления сотрудника в выбранный проект
		const canAdd = canAddStaffToProject(projects, newStaff.ProjectName)

		if (!canAdd) {
			// Если лимит достигнут, показываем сообщение об ошибке и выходим
			setErrorOpen(true)
			return
		}

		// Создаем копию проектов, чтобы не мутировать исходные данные
		let updatedProjects = [...projects]

		// Обновляем проекты, добавляя нового сотрудника и получаем изменённый проект и его индексный путь
		const { updatedProjects: tempProjects, updatedProject } = updateProjects(
			updatedProjects,
			newStaff.ProjectName,
			newStaff
		)
		updatedProjects = tempProjects

		// Отправляем измененный проект на сервер (передаем только измененный проект и его индексный путь)
		if (updatedProject) {
			dispatch(patchProjects(updatedProject))
		}

		// Добавляем сотрудника в список сотрудников
		dispatch(postStaff(newStaff))
		dispatch(increment())
	}

	const handleErrorClose = () => setErrorOpen(false) // Функция для закрытия окна ошибки

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

			{/* Модальное окно ошибки */}
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
		</Box>
	)
}

export default StaffManager
