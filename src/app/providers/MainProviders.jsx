import { Provider } from 'react-redux'

import { mainStore } from '../stores'
import App from '../App'

export const MainProviders = () => {
	return (
		<Provider store={mainStore}>
			<App />
		</Provider>
	)
}
