import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchProjects } from './model/projectSlice'
import { ProjectComponent } from '../../widgets/Projects'
import ProjectManager from '../../widgets/addProject'
import './ui/Home.scss'

export const Home = () => {
	const dispatch = useDispatch()
	const { projectsOld, projectsUpdate } = useSelector(state => state.projects)

	useEffect(() => {
		dispatch(fetchProjects())
	}, [dispatch, projectsUpdate])
	return (
		<div className='blockProjects'>
			<ProjectManager />
			<ProjectComponent project={projectsOld.items} />
		</div>
	)
}
