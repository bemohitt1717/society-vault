import { Outlet } from 'react-router-dom';
import Sidebar from '../../../../components/ui/Sidebar';
import Header from '../../../../components/ui/Header';
import useDashboardLayout from '../hooks/useDashboardLayout';

const DashboardLayout = () => {
  const {
    sidebarOpen,
    mobileSidebarOpen,
    title,
    subtitle,
    closeMobileSidebar,
    toggleSidebar,
    toggleMobileSidebar,
    triggerAddIncome,
    triggerAddExpense,
    requestAddIncome,
    requestAddExpense,
  } = useDashboardLayout();

  return (
    <div className="flex h-screen overflow-hidden bg-[#16161a]">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 cursor-pointer bg-black/50 z-30 lg:hidden"
            onClick={closeMobileSidebar}
          />
          <div className="fixed left-0 top-0 h-full z-40 lg:hidden">
            <Sidebar isOpen={true} />
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
          onAddIncome={requestAddIncome}
          onAddExpense={requestAddExpense}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ triggerAddIncome, triggerAddExpense }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
