import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchProjects } from './model/projectSlice'
import { ProjectComponent } from '../../widgets/Projects'
import ProjectManager from '../../widgets/addProject'
import './ui/Home.scss'

export const Home = () => {
	const dispatch = useDispatch()
	const { projects } = useSelector(state => state.projects)

	useEffect(() => {
		dispatch(fetchProjects())
	}, [])
	return (
		<div className='blockProjects'>
			<ProjectComponent project={projects.items} />
			<ProjectManager />
		</div>
	)
}
