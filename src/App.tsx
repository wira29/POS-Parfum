import { RouterProvider } from "react-router-dom"
import { router } from "@/core/router"
import { useAuthStore } from "./core/stores/AuthStore"
import { useEffect } from "react"
import { getToken } from "./core/helpers/TokenHandle"

function App() {
  const {isAuth, updateUser} = useAuthStore()

  useEffect(() => {
    if(getToken() && !isAuth) updateUser()
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App
