import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
	const { data } = await axios.get('http://localhost:3000/projects')
	return data
})

export const postProjects = createAsyncThunk('projects/postProjects', async updatedData => {
	const { data } = await axios.post('http://localhost:3000/projects', updatedData)
	return data
})

const initialState = {
	projectsOld: {
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
			//получение проектов
			.addCase(fetchProjects.pending, state => {
				state.projectsOld.items = []
				state.projectsOld.status = 'loading'
			})
			.addCase(fetchProjects.fulfilled, (state, action) => {
				state.projectsOld.items = action.payload
				state.projectsOld.status = 'loaded'
			})
			.addCase(fetchProjects.rejected, state => {
				state.projectsOld.items = []
				state.projectsOld.status = 'error'
			})
			//добавление проекта
			.addCase(postProjects.pending, state => {
				state.projectsOld.items = []
				state.projectsOld.status = 'loading'
			})
			.addCase(postProjects.fulfilled, (state, action) => {
				state.projectsOld.items = action.payload
				state.projectsOld.status = 'loaded'
			})
			.addCase(postProjects.rejected, state => {
				state.projectsOld.items = []
				state.projectsOld.status = 'error'
			})
	},
})

export const projectReducer = projectSlice.reducer
