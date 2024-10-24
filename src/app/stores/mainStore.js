import { configureStore } from '@reduxjs/toolkit'
import { projectReducer } from '../../pages/Home/model/projectSlice'

export const mainStore = configureStore({
	reducer: {
		project: projectReducer,
	},
})
