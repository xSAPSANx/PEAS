import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { fetchProjects } from '../Home/model/projectSlice'
import { fetchStaff } from '../../pages/Staff/model/staffSlice'
import StaffTab from '../../widgets/staffTab'
import StaffManager from '../../widgets/addStaff'

const Staff = () => {
	const dispatch = useDispatch()
	const { projectsOld, projectsUpdate } = useSelector(state => state.projects)
	const { staff, staffUpdate } = useSelector(state => state.staff)

	useEffect(() => {
		dispatch(fetchProjects())
	}, [dispatch, projectsUpdate])

	useEffect(() => {
		dispatch(fetchStaff())
	}, [dispatch, staffUpdate])
	return (
		<div>
			<StaffManager projects={projectsOld.items} />
			<StaffTab staff={staff} projects={projectsOld.items} />
		</div>
	)
}

export default Staff
