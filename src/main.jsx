import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MainProviders } from './app/providers'

import './index.css'
import App from './app/App'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<MainProviders>
			<App />
		</MainProviders>
	</StrictMode>
)
