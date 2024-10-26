import { ListItemButton, ListItemText, Collapse } from '@mui/material'
import {
	AccountBox,
	InboxOutlined,
	ListOutlined,
	ListAltOutlined,
	StarBorderOutlined,
	ArrowDropUp,
	ArrowDropDown,
} from '@mui/icons-material'
import { useState } from 'react'

export const Project = () => {
	const [open, setOpen] = useState(false)

	const handleClick = () => {
		setOpen(!open)
	}

	return (
		<div className='project'>
			<ListItemButton id='test' onClick={handleClick}>
				<ListOutlined>
					<InboxOutlined />
				</ListOutlined>
				<ListItemText primary='Проект' />
				<p className='numberEmp'>
					12 <AccountBox />
				</p>
				{open ? <ArrowDropUp /> : <ArrowDropDown />}
			</ListItemButton>
			<Collapse in={open} timeout='auto' unmountOnExit>
				<ListItemButton sx={{ pl: 4 }}>
					<ListAltOutlined>
						<StarBorderOutlined />
					</ListAltOutlined>
					<ListItemText primary='Подпроект 1' />
				</ListItemButton>
			</Collapse>
			<Collapse in={open} timeout='auto' unmountOnExit>
				<ListItemButton sx={{ pl: 4 }}>
					<ListAltOutlined>
						<StarBorderOutlined />
					</ListAltOutlined>
					<ListItemText primary='Подпроект 2' />
				</ListItemButton>
			</Collapse>
		</div>
	)
}
