import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../components/LoginForm';
import RoleSelection from '../components/RoleSelection';
import ResidentSignupForm from '../components/ResidentSignupForm';
import ResidentRegistrationForm from '../components/ResidentRegistrationForm';
import useAuthPage from '../hooks/useAuthPage';
import logoImage from '../../../assets/logo.png';
import buildingImage from '../../../assets/building.jpg';

const AuthPage = () => {
  const {
    activeView,
    setActiveView,
    selectedRole,
    activeUser,
    isCheckingSession,
    restoreError,
    heading,
    subtitle,
    handleRoleSelection,
    handleBackToRoleSelection,
    handleAuthenticated,
    handleResidentRegistration,
    handleResidentProfileComplete,
    handleSignOutFromProfileSetup,
  } = useAuthPage();

  // Framer Motion variants for smooth transitions
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="flex flex-row min-h-screen bg-[#16161a]">
      {/* Left Panel - Form Section (40% width) - CENTERED */}
      <div className={`w-full ${activeView === 'residentDetails' ? '' : 'md:w-[40%]'} flex flex-col justify-center items-center px-8 md:px-12 py-10 bg-[#16161a]`}>
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-10">
              <img 
                src={logoImage} 
                alt="SocietyVault Logo" 
                className="h-9 w-auto"
              />
              <span className="text-[#fffffe] text-xl font-semibold">SocietyVault</span>
            </div>
            
            {/* Dynamic Heading and Subtitle with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-[#fffffe] mb-2">
                  {heading}
                </h1>
                <p className="text-sm text-[#94a1b2]">
                  {subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form Area with Smooth Framer Motion Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isCheckingSession && (
                <p className="text-sm text-[#94a1b2]">Checking your session...</p>
              )}
              {!isCheckingSession && restoreError && (
                <p role="alert" className="mb-4 rounded-lg border border-[#75464a] bg-[#392629] px-3 py-2.5 text-sm text-[#f0b2b4]">
                  {restoreError}
                </p>
              )}
              {!isCheckingSession && activeView === 'roleSelection' && (
                <RoleSelection onSelectRole={handleRoleSelection} />
              )}
              {!isCheckingSession && activeView === 'login' && (
                <LoginForm
                  onSwitchToSignup={() => setActiveView('residentSignup')}
                  onBack={handleBackToRoleSelection}
                  selectedRole={selectedRole}
                  onAuthenticated={handleAuthenticated}
                />
              )}
              {!isCheckingSession && activeView === 'residentSignup' && (
                <ResidentSignupForm
                  onRegistered={handleResidentRegistration}
                  onBack={() => setActiveView('login')}
                  onSwitchToLogin={() => setActiveView('login')}
                />
              )}
              {!isCheckingSession && activeView === 'residentDetails' && (
                <ResidentRegistrationForm
                  account={activeUser}
                  onComplete={handleResidentProfileComplete}
                  onSignOut={handleSignOutFromProfileSetup}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel - Image Section (60% width, hidden on mobile) */}
      {activeView !== 'residentDetails' && <div className="relative hidden md:flex md:w-[60%] items-center justify-center p-8">
        <svg aria-hidden="true" className="absolute h-0 w-0" focusable="false">
          <defs>
            <clipPath id="society-vault-image-shape" clipPathUnits="objectBoundingBox">
              <path d="M 0.28 0 C 0.21 0 0.20 0.06 0.18 0.13 C 0.16 0.19 0.11 0.19 0.06 0.20 C 0.02 0.21 0 0.25 0 0.31 L 0 0.85 C 0 0.94 0.07 1 0.16 1 L 0.80 1 C 0.82 1 0.83 0.99 0.84 0.97 C 0.85 0.93 0.87 0.90 0.92 0.90 C 0.97 0.90 1 0.86 1 0.81 L 1 0.10 C 1 0.04 0.96 0 0.90 0 Z" />
            </clipPath>
          </defs>
        </svg>
        {/* Image Container with Exact Custom Shape - 75-80% height */}
        <div 
          className="relative w-full h-[80%] shadow-2xl"
          style={{
            clipPath: 'url(#society-vault-image-shape)'
          }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${buildingImage})` }}
          />
          
          {/* Dark Overlay Gradient */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(to bottom, rgba(22, 22, 26, 0.2) 0%, rgba(22, 22, 26, 0.6) 100%)'
            }}
          />

          {/* Tagline Text - TOP RIGHT */}
          <div className="absolute top-8 right-8 left-8 z-10 text-right">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              Financial clarity for<br />
              <span className="text-[#7f5af0]">every resident.</span>
            </h2>
            <p className="text-xs text-[#94a1b2]">
              Transparent fund management for modern housing societies.
            </p>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default AuthPage;
