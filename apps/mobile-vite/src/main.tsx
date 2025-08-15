import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { TamaguiProvider } from '@tamagui/core'
import { router } from './router'
import { ReactQueryProvider } from './lib/react-query/provider'
import config from '../tamagui.config'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TamaguiProvider config={config}>
      <HelmetProvider>
        <ReactQueryProvider>
          <RouterProvider router={router} />
          <Toaster position="bottom-center" />
        </ReactQueryProvider>
      </HelmetProvider>
    </TamaguiProvider>
  </React.StrictMode>,
)