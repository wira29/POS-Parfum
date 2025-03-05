import { router } from "@/core/router"
import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { getToken } from "./core/helpers/TokenHandle"
import { useAuthStore } from "./core/stores/AuthStore"

import $ from "jquery"

window.$ = $;
window.jQuery = $;

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
