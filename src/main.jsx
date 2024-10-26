import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MainProviders } from './app/providers'
import { BrowserRouter } from 'react-router-dom'

import './index.scss'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<MainProviders />
		</BrowserRouter>
	</StrictMode>
)
