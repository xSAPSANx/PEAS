import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchProjects } from './model/projectSlice'
import { ProjectComponent } from '../../widgets/Projects'
import { ProjectTab } from '../../widgets/projectTab'
import ProjectManager from '../../widgets/addProject'
import './ui/Home.scss'

export const Home = () => {
	const dispatch = useDispatch()
	const { projectsOld, projectsUpdate, ProjectHidden, projectClickID } = useSelector(state => state.projects)

	useEffect(() => {
		dispatch(fetchProjects())
	}, [dispatch, projectsUpdate])

	return (
		<div style={{ display: 'flex' }}>
			<div className='blockProjects'>
				<ProjectManager />
				<ProjectComponent project={projectsOld.items} />
			</div>
			<div>{ProjectHidden.value && <ProjectTab projects={projectsOld} lastClick={projectClickID} />}</div>
		</div>
	)
}
