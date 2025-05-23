
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'


// import css
// import 'sweetalert2/dist/sweetalert2.min.css'
// import 'sweetalert2/dist/sweetalert2.min.js'
import '@/assets/dist/css/tailwind.css'
import '@/assets/dist/css/custom-animation.css'

// import '@/assets/dist/libs/jquery/dist/jquery.min.js'
import '@/assets/dist/libs/simplebar/dist/simplebar.min.js'

import '@/assets/dist/js/app-style-switcher.js'
import '@/assets/dist/js/app.init.js'
import '@/assets/dist/js/app.min.js'
import '@/assets/dist/js/custom.js'
import '@/assets/dist/js/sidebarmenu.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)