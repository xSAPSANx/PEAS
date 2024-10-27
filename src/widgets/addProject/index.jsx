/* eslint-disable react/prop-types */

import { useState } from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
	Box,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
} from '@mui/material'

// Компонент для рекурсивного отображения проектов и подпроектов
const renderProjects = (projects, parentIndex = '') => {
	return projects.flatMap((project, index) => {
		const currentValue = `${parentIndex}${index}`
		const items = [
			<MenuItem key={currentValue} value={currentValue}>
				{`${'--'.repeat(parentIndex.length / 2)} ${project.projectName}`} {/* Добавляем отступы для вложенности */}
			</MenuItem>,
		]

		// Проверяем наличие подпроектов и рекурсивно вызываем renderProjects для них
		if (project.children && project.children.length > 0) {
			items.push(...renderProjects(project.children, currentValue + '-'))
		}

		return items // Возвращаем массив элементов
	})
}

// Модальное окно для создания проекта или подпроекта
const ProjectModal = ({ isOpen, onClose, onCreate, projects }) => {
	const [projectName, setProjectName] = useState('')
	const [staffNum, setStaffNum] = useState('')
	const [parentProject, setParentProject] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		if (projectName && staffNum) {
			const newProject = { projectName, staffNum, children: [] }
			onCreate(newProject, parentProject)
			setProjectName('')
			setStaffNum('')
			setParentProject('')
		}
	}

	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>Создать новый проект или подпроект</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin='dense'
					label='Название проекта'
					type='text'
					fullWidth
					variant='outlined'
					value={projectName}
					onChange={e => setProjectName(e.target.value)}
					required
				/>
				<TextField
					margin='dense'
					label='Количество сотрудников'
					type='number'
					fullWidth
					variant='outlined'
					value={staffNum}
					onChange={e => setStaffNum(e.target.value)}
					required
				/>
				<FormControl fullWidth margin='dense'>
					<InputLabel id='parent-project-label'>Родительский проект</InputLabel>
					<Select
						labelId='parent-project-label'
						value={parentProject}
						onChange={e => setParentProject(e.target.value)}
						displayEmpty
					>
						<MenuItem value=''>
							<em>Нет</em>
						</MenuItem>
						{renderProjects(projects)} {/* Рендерим проекты и подпроекты */}
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='primary'>
					Закрыть
				</Button>
				<Button onClick={handleSubmit} color='primary'>
					Создать
				</Button>
			</DialogActions>
		</Dialog>
	)
}

// Основной компонент ProjectManager
const ProjectManager = () => {
	const [projects, setProjects] = useState([])
	const [isModalOpen, setModalOpen] = useState(false)

	const handleCreate = (newProject, parentIdentifier) => {
		const parentIndex = parentIdentifier ? parentIdentifier.split('-')[0] : null
		const childIndex = parentIdentifier ? parentIdentifier.split('-')[1] : null

		if (parentIndex === null) {
			// Если родительский проект не выбран, добавляем новый проект на верхнем уровне
			setProjects(prevProjects => [...prevProjects, { ...newProject, children: [] }])
		} else {
			// Если выбран родительский проект или подпроект, добавляем его в children
			setProjects(prevProjects => {
				const updatedProjects = [...prevProjects]
				if (childIndex !== undefined) {
					// Добавляем новый проект в children существующего подпроекта
					updatedProjects[parentIndex].children[childIndex].children.push(newProject)
				} else {
					// Добавляем новый проект в children выбранного проекта
					updatedProjects[parentIndex].children.push(newProject)
				}
				return updatedProjects
			})
		}
		console.log([...projects, newProject]) // Выводим обновленную структуру в консоль
	}

	return (
		<Box p={2}>
			<Button variant='contained' color='primary' onClick={() => setModalOpen(true)}>
				Создать проект
			</Button>
			<ProjectModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
				onCreate={handleCreate}
				projects={projects}
			/>
			<Box mt={2}>
				<Typography variant='h6'>Список проектов:</Typography>
				<pre>{JSON.stringify(projects, null, 2)}</pre>
			</Box>
		</Box>
	)
}

export default ProjectManager
