import { configureStore } from '@reduxjs/toolkit'
import { projectReducer } from '../../pages/Home/model/projectSlice'
import { staffReducer } from '../../pages/Staff/model/staffSlice'

export const mainStore = configureStore({
	reducer: {
		projects: projectReducer,
		staff: staffReducer,
	},
})
