
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#242629] border border-[#2e2f33] rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
