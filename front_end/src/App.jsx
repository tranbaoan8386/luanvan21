import { useContext, useEffect } from 'react'
import './App.css'
import routerElements from './routes/Router'
import { LocalStorageEventTarget } from './common/auth'
import { AppContext } from './contexts/App'
import Footer from './components/Footer/Footer' // 👈 Thêm dòng này

function App() {
  const routers = routerElements()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return <>{routers}</>
}


export default App
