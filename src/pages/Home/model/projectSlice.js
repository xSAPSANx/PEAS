import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
	const { data } = await axios.get('http://localhost:3000/projects')
	return data
})

const initialState = {
	projects: {
		items: [],
		status: 'loading',
	},
}

const projectSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchProjects.pending, state => {
				state.projects.items = []
				state.projects.status = 'loading'
			})
			.addCase(fetchProjects.fulfilled, (state, action) => {
				state.projects.items = action.payload
				state.projects.status = 'loaded'
			})
			.addCase(fetchProjects.rejected, state => {
				state.projects.items = []
				state.projects.status = 'error'
			})
	},
})

export const projectReducer = projectSlice.reducer
