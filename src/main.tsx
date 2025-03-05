
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'


// import css
// import 'sweetalert2/dist/sweetalert2.min.css'
// import 'sweetalert2/dist/sweetalert2.min.js'
import '@/assets/dist/css/custom-style.css'
import '@/assets/dist/css/style.min.css'
import '@/assets/dist/libs/owl.carousel/dist/assets/owl.carousel.min.css'
import 'react-datepicker/dist/react-datepicker.css'

// import js
import '@/assets/dist/libs/bootstrap/dist/js/bootstrap.bundle.min.js'
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
