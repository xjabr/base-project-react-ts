import React from 'react'

import { useAuth } from './Context/auth-context'

import AuthenticatedApp from './Components/authenticated-app'
import UnauthenticatedApp from './Components/unathenticated-app'

const App = () => {
    const auth = useAuth()
    return auth.isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export default App