/* eslint-disable react/prop-types */
import { useState } from 'react'
import { ListItemButton, ListItemText, Collapse, Typography, List, Box, IconButton, Button } from '@mui/material'
import { AccountBox, ArrowDropUp, ArrowDropDown, Delete as DeleteIcon } from '@mui/icons-material'
import { useDispatch } from 'react-redux'

import { deleteProjects, tabProjectHidden, projectClickID } from '../../pages/Home/model/projectSlice'
import './projects.scss'

const LeafComponent = ({ leaf, indent, isTopLevel }) => {
	const dispatch = useDispatch()

	const handleOpenModal = (event, id) => {
		event.stopPropagation()
		dispatch(projectClickID(id))
		dispatch(tabProjectHidden(true))
	}

	return (
		<>
			<ListItemButton sx={{ pl: indent }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						width: '100%',
						position: 'relative',
					}}
				>
					<Box sx={{ width: '24px', flexShrink: 0 }}></Box>

					<ListItemText
						primary={
							<Typography className={'typograph'} variant='body1' align='center' sx={{ flex: 1 }}>
								{leaf.projectName}
							</Typography>
						}
					/>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Button
							onClick={event => handleOpenModal(event, leaf.id)}
							size='small'
							variant='text'
							sx={{
								textTransform: 'none',
								borderRadius: '4px',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Typography variant='body2'>
									{leaf.staff.length} / {leaf.maxStaffNum}
								</Typography>
								<AccountBox sx={{ ml: 1 }} />
							</Box>
						</Button>
						{isTopLevel && leaf.id && (
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
				</Box>
			</ListItemButton>
		</>
	)
}

const BranchComponent = ({ branch, indent, isTopLevel }) => {
	const [open, setOpen] = useState(false)
	const dispatch = useDispatch()

	const handleClick = () => {
		setOpen(!open)
	}

	const handleOpenModal = (event, id) => {
		event.stopPropagation()
		dispatch(projectClickID(id))
		dispatch(tabProjectHidden(true))
	}

	return (
		<div className={open ? 'project-container branch-open' : 'project-container'}>
			<ListItemButton onClick={branch.children.length > 0 ? handleClick : null} sx={{ pl: indent }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						width: '100%',
						position: 'relative',
					}}
				>
					{branch.children.length > 0 ? (
						<Box sx={{ flexShrink: 0 }}>{open ? <ArrowDropUp /> : <ArrowDropDown />}</Box>
					) : (
						<Box sx={{ width: '24px', flexShrink: 0 }}></Box>
					)}

					<ListItemText
						primary={
							<Typography className={'typograph'} variant='body1' align='center' sx={{ flex: 1 }}>
								{branch.projectName}
							</Typography>
						}
					/>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Button
							onClick={event => handleOpenModal(event, branch.id)}
							size='small'
							variant='text'
							sx={{
								textTransform: 'none',
								borderRadius: '4px',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Typography variant='body2'>
									{branch.staff.length} / {branch.maxStaffNum}
								</Typography>
								<AccountBox sx={{ ml: 1 }} />
							</Box>
						</Button>
						{isTopLevel && branch.id && (
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
				</Box>
			</ListItemButton>
			{branch.children.length > 0 && (
				<Collapse in={open} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{branch.children.map((childNode, index) => (
							<NodeComponent node={childNode} key={index} indent={indent + 1} isTopLevel={false} />
						))}
					</List>
				</Collapse>
			)}
		</div>
	)
}

function NodeComponent({ node, indent = 0, isTopLevel = false }) {
	return (
		<div>
			{node.children && node.children.length > 0 ? (
				<BranchComponent branch={node} indent={indent} isTopLevel={isTopLevel} />
			) : (
				<LeafComponent leaf={node} indent={indent} isTopLevel={isTopLevel} />
			)}
		</div>
	)
}

export const ProjectComponent = ({ project }) => (
	<Box>
		<List>
			{(Array.isArray(project) ? project : []).map((node, index) => (
				<NodeComponent node={node} key={index} isTopLevel={true} />
			))}
		</List>
	</Box>
)
