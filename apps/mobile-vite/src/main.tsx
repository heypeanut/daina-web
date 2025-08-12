import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { TamaguiProvider } from '@tamagui/core'
import { router } from './router'
import { queryClient } from './lib/react-query/client'
import config from '../tamagui.config'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TamaguiProvider config={config}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster position="bottom-center" />
        </QueryClientProvider>
      </HelmetProvider>
    </TamaguiProvider>
  </React.StrictMode>,
)