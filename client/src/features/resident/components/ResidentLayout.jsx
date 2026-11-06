import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ResidentSidebar from './ResidentSidebar';
import Header from '../../../components/ui/Header';
import LoadingState from '../../../components/ui/LoadingState';
import useResidentLayout from '../hooks/useResidentLayout';

const ResidentLayout = () => {
  const {
    sidebarOpen,
    mobileSidebarOpen,
    title,
    subtitle,
    closeMobileSidebar,
    toggleSidebar,
    toggleMobileSidebar,
  } = useResidentLayout();

  return (
    <div className="flex h-screen overflow-hidden bg-[#16161a]">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <ResidentSidebar isOpen={sidebarOpen} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 cursor-pointer bg-black/50 z-30 lg:hidden"
            onClick={closeMobileSidebar}
          />
          <div className="fixed left-0 top-0 h-full z-40 lg:hidden">
            <ResidentSidebar isOpen={true} />
          </div>
        </>
      )}

      {/* Main Content — margin only on desktop */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-out ${
          sidebarOpen ? 'lg:ml-[200px]' : 'lg:ml-[56px]'
        }`}
      >
        <Header
          title={title}
          subtitle={subtitle}
          sidebarOpen={sidebarOpen}
          mobileSidebarOpen={mobileSidebarOpen}
          onToggleSidebar={toggleSidebar}
          onMobileToggle={toggleMobileSidebar}
          // No Quick Add actions for residents - hide the menu
          onAddIncome={null}
          onAddExpense={null}
          isResidentPortal={true}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Suspense fallback={<LoadingState fullPage label="Loading section..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default ResidentLayout;
