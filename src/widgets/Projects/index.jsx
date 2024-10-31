/* eslint-disable react/prop-types */
import { useState } from 'react'
import { ListItemButton, ListItemText, Collapse, Typography, List, Box, IconButton, Button } from '@mui/material'
import { AccountBox, ArrowDropUp, ArrowDropDown, Delete as DeleteIcon } from '@mui/icons-material'
import { useDispatch } from 'react-redux'

import { deleteProjects, tabProjectHidden, projectClickID } from '../../pages/Home/model/projectSlice' // Импортируем tabProjectHidden
import './projects.scss'

const LeafComponent = ({ leaf, indent }) => {
	const dispatch = useDispatch() // Получаем dispatch из React Redux

	const handleOpenModal = (event, id) => {
		event.stopPropagation()
		dispatch(projectClickID(id))
		dispatch(tabProjectHidden(true)) // <-- dispatch для изменения состояния отображения таблицы на "true"
	}

	return (
		<>
			<ListItemButton sx={{ pl: indent, display: 'flex', alignItems: 'center' }}>
				<ListItemText
					primary={
						<Typography className={'typograph'} variant='body1'>
							{leaf.projectName}
						</Typography>
					}
				/>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Button
						onClick={event => handleOpenModal(event, leaf.id)} // Используем функцию для открытия модального окна и изменения состояния
						sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
					>
						<span className={'staff-number'}>
							{leaf.staff.length} / {leaf.maxStaffNum} <AccountBox sx={{ ml: 1 }} />
						</span>
					</Button>
					{leaf.id && (
						<IconButton
							onClick={event => {
								event.stopPropagation()
								dispatch(deleteProjects(leaf.id))
							}}
							sx={{ color: '#DC143C', ml: 1 }}
						>
							<DeleteIcon />
						</IconButton>
					)}
				</Box>
			</ListItemButton>
		</>
	)
}

const BranchComponent = ({ branch, indent }) => {
	const [open, setOpen] = useState(false)
	const dispatch = useDispatch() // Получаем dispatch из React Redux

	const handleClick = () => {
		setOpen(!open)
	}

	const handleOpenModal = (event, id) => {
		event.stopPropagation()
		dispatch(projectClickID(id))
		dispatch(tabProjectHidden(true)) // <-- dispatch для изменения состояния отображения таблицы на "true"
	}

	return (
		<div className={open ? 'project-container branch-open' : 'project-container'}>
			<ListItemButton onClick={branch.children.length > 0 ? handleClick : null}>
				<Box>{branch.children.length > 0 && (open ? <ArrowDropUp /> : <ArrowDropDown />)}</Box>
				<ListItemText
					primary={
						<Typography className={'typograph'} variant='body1'>
							{branch.projectName}
						</Typography>
					}
				/>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Button
						onClick={event => handleOpenModal(event, branch.id)} // Используем функцию для открытия модального окна и изменения состояния
						sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
					>
						<span className={'staff-number'}>
							{branch.staff.length} / {branch.maxStaffNum} <AccountBox sx={{ ml: 1 }} />
						</span>
					</Button>
					{branch.id && (
						<IconButton
							onClick={event => {
								event.stopPropagation()
								dispatch(deleteProjects(branch.id))
							}}
							sx={{ color: '#DC143C', ml: 1 }}
						>
							<DeleteIcon />
						</IconButton>
					)}
				</Box>
			</ListItemButton>
			{branch.children.length > 0 && (
				<Collapse in={open} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{branch.children.map((childNode, index) => (
							<NodeComponent node={childNode} key={index} indent={indent + 1} />
						))}
					</List>
				</Collapse>
			)}
		</div>
	)
}

function NodeComponent({ node, indent = 0 }) {
	return (
		<div>
			{node.children && node.children.length > 0 ? (
				<BranchComponent branch={node} indent={indent} />
			) : (
				<LeafComponent leaf={node} indent={indent} />
			)}
		</div>
	)
}

export const ProjectComponent = ({ project }) => (
	<Box>
		<List>
			{(Array.isArray(project) ? project : []).map((node, index) => (
				<NodeComponent node={node} key={index} />
			))}
		</List>
	</Box>
)
