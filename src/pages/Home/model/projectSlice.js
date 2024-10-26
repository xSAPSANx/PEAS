import { createSlice } from '@reduxjs/toolkit'

//import axios from '../../axios'

const initialState = {
	project: false,
}

const projectSlice = createSlice({
	name: 'project',
	initialState,
	reducers: {
		setProject(state, action) {
			state.project = action.payload
		},
	},
})

export const { setProject } = projectSlice.actions

export const projectReducer = projectSlice.reducer
