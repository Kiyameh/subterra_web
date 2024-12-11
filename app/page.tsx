import WelcomeSection from '@/app/(landing)/welcome-section'
import AboutSection from '@/app/(landing)/about-section'
import HowToSection from '@/app/(landing)/how-to-section'
import InstancesSection from '@/app/(landing)/instances-section'
import GroupsSection from '@/app/(landing)/groups-section'
import Footer from '@/app/(landing)/Footer'

import DesktopNav from '@/components/navigation/nav-desktop'
import MobileNav from '@/components/navigation/nav-mobile'
import FloatingAccountControls from '@/components/account/floating-account-controls'

//* Constantes:
const sections = [
  {label: 'Inicio', id: 'welcome-section'},
  {label: '¿Qué es?', id: 'about-section'},
  {label: 'Empezar', id: 'start-section'},
  {label: 'Instancias', id: 'instances-section'},
  {label: 'Grupos', id: 'groups-section'},
]

export default function HomePage() {
  return (
    <>
      <nav className="hidden md:block">
        <DesktopNav sections={sections} />
      </nav>
      <nav className="block md:hidden">
        <MobileNav sections={sections} />
      </nav>
      <nav className="fixed top-6 right-6 z-50 md:bottom-6 md:top-auto">
        <FloatingAccountControls />
      </nav>
      <main>
        <WelcomeSection />
        <AboutSection />
        <HowToSection />
        <InstancesSection />
        <GroupsSection />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}
