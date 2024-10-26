import { ListItemButton, ListItemText, Collapse, Typography, List, Box } from '@mui/material'
import { AccountBox, ListOutlined, ListAltOutlined, ArrowDropUp, ArrowDropDown } from '@mui/icons-material'
import { useState } from 'react'

import './projects.scss'
/* eslint-disable react/prop-types */

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
							{branch.branchName}
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

const NodeComponent = ({ node, indent = 0 }) => (
	<div>
		{node.currentValue.map((item, index) =>
			item.projectName ? (
				<LeafComponent leaf={item} key={index} indent={indent} />
			) : (
				<BranchComponent branch={item} key={index} indent={indent} />
			)
		)}
		{node.next && <NodeComponent node={node.next} indent={indent} />}
	</div>
)

export const ProjectComponent = ({ project }) => (
	<Box>
		<List>
			{project?.map((node, index) => (
				<NodeComponent node={node} key={index} />
			))}
		</List>
	</Box>
)
