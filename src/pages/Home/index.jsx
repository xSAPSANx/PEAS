import { useState, useEffect } from 'react'
import axios from 'axios'

import { ProjectComponent } from '../../widgets/Projects'
import './ui/Home.scss'

export const Home = () => {
	const [projects, setProjects] = useState([])
	useEffect(() => {
		axios.get('http://localhost:3000/project').then(response => {
			setProjects(response.data)
		})
	}, [])
	return (
		<div className='blockProjects'>
			<ProjectComponent project={projects} />
		</div>
	)
}
