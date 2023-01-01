import { QueryClient, QueryClientProvider } from 'react-query'
import AppNavigation from './navigation'
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  )
}
