import { Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar'
import { Toaster } from '@/components/ui/toaster'

function Dashboard() {
  return (
    <div dir="rtl" lang="ar" className={`relative h-screen p-[20px] overflow-hidden flex gap-x-[20px]`}>
        <SideBar/>
          <main className={`hide-scrollbar h-full w-full`}>
              <Outlet/>
          </main>
        <Toaster />
    </div>
  )
}

export default Dashboard