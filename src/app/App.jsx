import { Routes, Route } from 'react-router-dom'

import './styles/App.scss'
import StaffTab from '../pages/Staff'
import { Home } from '../pages/Home'
import { Header } from '../widgets/Header'

function App() {
	return (
		<>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/StaffTab' element={<StaffTab />} />
			</Routes>
		</>
	)
}

export default App
