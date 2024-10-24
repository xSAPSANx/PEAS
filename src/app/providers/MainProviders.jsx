import { Provider } from 'react-redux'

import { mainStore } from '../stores'

export const MainProviders = () => {
	return <Provider store={mainStore}></Provider>
}
