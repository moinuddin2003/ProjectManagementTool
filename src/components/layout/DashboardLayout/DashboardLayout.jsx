"use client"
import Header from "../Header/Header"
import Sidebar from "../Sidebar/Sidebar"
import Footer from "../Footer/Footer"

const MobileMenuOverlay = ({ showMobileMenu, setShowMobileMenu }) => {
  if (!showMobileMenu) return null

  return <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setShowMobileMenu(false)}></div>
}

const DashboardLayout = ({ children, showMobileMenu, setShowMobileMenu, selectedNav, onNavClick, navItems }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <Header showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
      <div className="flex">
        <Sidebar
          showMobileMenu={showMobileMenu}
          selectedNav={selectedNav}
          onNavClick={onNavClick}
          navItems={navItems}
        />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
      <MobileMenuOverlay showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
      <Footer />
    </div>
  )
}

export default DashboardLayout
