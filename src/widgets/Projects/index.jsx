/* eslint-disable react/prop-types */

import { ListItemButton, ListItemText, Collapse, Typography, List, Box } from '@mui/material'
import { AccountBox, ListOutlined, ListAltOutlined, ArrowDropUp, ArrowDropDown } from '@mui/icons-material'
import { useState } from 'react'

import './projects.scss'

// Компонент для отображения листового узла (без children)
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

// Компонент для отображения узла с ветвями (имеет children)
const BranchComponent = ({ branch, indent }) => {
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

// Универсальный компонент для отображения узла (либо ветвь, либо лист)
const NodeComponent = ({ node, indent = 0 }) => (
	<div>
		{node.children && node.children.length > 0 ? (
			<BranchComponent branch={node} indent={indent} />
		) : (
			<LeafComponent leaf={node} indent={indent} />
		)}
	</div>
)

// Главный компонент для отображения иерархии проектов
export const ProjectComponent = ({ project }) => (
	<Box>
		<List>
			{(Array.isArray(project) ? project : []).map((node, index) => (
				<NodeComponent node={node} key={index} />
			))}
		</List>
	</Box>
)
