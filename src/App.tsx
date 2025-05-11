import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { SiteHeader } from "@/components/SiteHeader"
import Overview from "@/pages/Overview"
// import Campaigns from "@/pages/Campaigns"
// import CreateCampaign from "@/pages/CreateCampaign"

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader title="Chart" />
          <div className="flex flex-1 flex-col overflow-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              {/* <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/create-campaign" element={<CreateCampaign />} /> */}
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  )
}

export default App
