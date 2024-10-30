import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchStaff = createAsyncThunk('staff/fetchStaff', async () => {
	const { data } = await axios.get('http://localhost:3000/staff')
	return data
})

export const postStaff = createAsyncThunk('staff/postStaff', async updatedData => {
	const { data } = await axios.post('http://localhost:3000/staff', updatedData)
	return data
})

export const deleteStaff = createAsyncThunk('staff/deleteStaff', async id => {
	const { data } = await axios.delete(`http://localhost:3000/staff/${id}`)
	return data
})

export const patchStaff = createAsyncThunk('staff/patchStaff', async updatedData => {
	const { data } = await axios.patch(`http://localhost:3000/staff/${updatedData.id}`, updatedData)
	return data
})

const initialState = {
	staff: {
		items: [],
		status: 'loading',
	},
	staffUpdate: {
		value: 0,
	},
}

const staffSlice = createSlice({
	name: 'staff',
	initialState,
	reducers: {
		increment(state) {
			state.staffUpdate.value++
		},
	},
	extraReducers: builder => {
		builder
			//получение всех сотрудников
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
			//добавление сотрудника
			.addCase(postStaff.pending, state => {
				state.staff.items = []
				state.staff.status = 'loading'
			})
			.addCase(postStaff.fulfilled, (state, action) => {
				state.staff.items = action.payload
				state.staff.status = 'loaded'
			})
			.addCase(postStaff.rejected, state => {
				state.staff.items = []
				state.staff.status = 'error'
			})
			//редактирование сотрудника
			.addCase(patchStaff.pending, state => {
				state.staff.items = []
				state.staff.status = 'loading'
			})
			.addCase(patchStaff.fulfilled, (state, action) => {
				state.staff.items = action.payload
				state.staffUpdate.value++
				state.staff.status = 'loaded'
			})
			.addCase(patchStaff.rejected, state => {
				state.staff.items = []
				state.staff.status = 'error'
			})
			//Удаление сотрудника
			.addCase(deleteStaff.pending, state => {
				state.staffUpdate.value++
				state.staff.status = 'delete'
			})
			.addCase(deleteStaff.rejected, state => {
				state.staff.items = []
				state.staff.status = 'error delete'
			})
	},
})

export const { increment } = staffSlice.actions

export const staffReducer = staffSlice.reducer
