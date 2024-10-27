import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchStaff = createAsyncThunk('project/fetchStaff', async () => {
	const { data } = await axios.get('http://localhost:3000/staff')
	return data
})

const initialState = {
	staff: {
		items: [],
		status: 'loading',
	},
}

const staffSlice = createSlice({
	name: 'staff',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchStaff.pending, state => {
				state.staff.items = []
				state.staff.status = 'loading'
			})
			.addCase(fetchStaff.fulfilled, (state, action) => {
				state.staff.items = action.payload
				state.staff.status = 'loaded'
			})
			.addCase(fetchStaff.rejected, state => {
				state.staff.items = []
				state.staff.status = 'error'
			})
	},
})

export const staffReducer = staffSlice.reducer
