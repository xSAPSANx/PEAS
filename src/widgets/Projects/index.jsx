/* eslint-disable react/prop-types */

import { ListItemButton, ListItemText, Collapse, Typography, List, Box, IconButton } from '@mui/material'
import { AccountBox, ListOutlined, ListAltOutlined, ArrowDropUp, ArrowDropDown, Delete } from '@mui/icons-material'
import { useState } from 'react'

import './projects.scss'

const LeafComponent = ({ leaf, indent }) => (
	<ListItemButton sx={{ pl: indent }}>
		<ListAltOutlined sx={{ mr: 1 }} />
		<ListItemText
			primary={
				<Typography className={'typograph'} variant='body1' display='flex' alignItems='center' marginRight={3.2}>
					{leaf.projectName}
					<span className={'staff-number'}>
						{leaf.staffNum} <AccountBox sx={{ ml: 1 }} />
					</span>
				</Typography>
			}
		/>
	</ListItemButton>
)

const BranchComponent = ({ branch, indent, onDelete }) => {
	const [open, setOpen] = useState(false)

	const handleClick = () => {
		setOpen(!open)
	}

	return (
		<div className={open ? 'project-container branch-open' : 'project-container'}>
			<ListItemButton onClick={branch.children.length > 0 ? handleClick : null} sx={{ pl: indent }}>
				<ListOutlined sx={{ mr: 1 }} />
				<ListItemText
					primary={
						<Typography className={'typograph'} variant='body1' display='flex' alignItems='center'>
							{branch.projectName}
							<span className={'staff-number'}>
								{branch.staffNum} <AccountBox sx={{ ml: 1 }} />
							</span>
						</Typography>
					}
				/>
				{branch.id && indent === 0 && (
					<IconButton onClick={() => onDelete(branch.id)} sx={{ color: '#DC143C' }}>
						{' '}
						{/* Light red color */}
						<Delete />
					</IconButton>
				)}
				{branch.children.length > 0 && (open ? <ArrowDropUp /> : <ArrowDropDown />)}
			</ListItemButton>
			{branch.children.length > 0 && (
				<Collapse in={open} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{branch.children.map((childNode, index) => (
							<NodeComponent node={childNode} key={index} indent={indent + 3} />
						))}
					</List>
				</Collapse>
			)}
		</div>
	)
}

const NodeComponent = ({ node, indent = 0, onDelete }) => (
	<div>
		{node.children && node.children.length > 0 ? (
			<BranchComponent branch={node} indent={indent} onDelete={onDelete} />
		) : (
			<LeafComponent leaf={node} indent={indent} />
		)}
	</div>
)

export const ProjectComponent = ({ project, onDelete }) => (
	<Box>
		<List>
			{(Array.isArray(project) ? project : []).map((node, index) => (
				<NodeComponent node={node} key={index} onDelete={onDelete} />
			))}
		</List>
	</Box>
)
