import { Project } from '../../widgets/Projects'
import './ui/Home.scss'

export const Home = () => {
	return (
		<div className='blockProjects'>
			<Project />
			<Project />
			<Project />
		</div>
	)
}
