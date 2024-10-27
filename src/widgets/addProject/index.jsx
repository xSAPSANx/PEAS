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
	InputLabel,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { postProjects } from '../../pages/Home/model/projectSlice'

const renderProjects = (projects, parentIndex = '') => {
	return projects.flatMap((project, index) => {
		const currentValue = `${parentIndex}${index}`
		const items = [
			<MenuItem key={currentValue} value={project.projectName} name={project.projectName}>
				{`${'--'.repeat(parentIndex.length / 2)} ${project.projectName}`}
			</MenuItem>,
		]

		if (project.children && project.children.length > 0) {
			items.push(...renderProjects(project.children, currentValue + '-'))
		}

		return items
	})
}

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
						{renderProjects(projects)}
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

const ProjectManager = () => {
	const [projects, setProjects] = useState([])
	const [isModalOpen, setModalOpen] = useState(false)

	const findAndAddChild = (projects, targetName, newProject) => {
		for (let project of projects) {
			if (project.projectName === targetName) {
				project.children.push(newProject)
				return true
			}
			if (project.children.length > 0) {
				const found = findAndAddChild(project.children, targetName, newProject)
				if (found) return true
			}
		}
		return false
	}

	const handleCreate = (newProject, parentName) => {
		if (!parentName) {
			setProjects(prevProjects => [...prevProjects, newProject])
			return
		}

		const updatedProjects = JSON.parse(JSON.stringify(projects))
		const projectAdded = findAndAddChild(updatedProjects, parentName, newProject)

		if (projectAdded) {
			setProjects(updatedProjects)
		} else {
			console.error('Parent project not found')
		}
	}

	const dispatch = useDispatch()
	const clickClose = state => {
		setModalOpen(state)
		if (projects.length === 0) {
			return
		} else {
			dispatch(postProjects(projects[0]))
		}
	}

	return (
		<Box p={2}>
			<Button variant='contained' color='primary' onClick={() => setModalOpen(true)}>
				Создать проект
			</Button>
			<ProjectModal
				isOpen={isModalOpen}
				onClose={() => clickClose(false)}
				onCreate={handleCreate}
				projects={projects}
			/>
		</Box>
	)
}

export default ProjectManager
