import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, trend, trendValue }) => {
  // Remove ₹ from value if present, we'll add it back in white
  const numericValue = value.replace('₹', '').replace(/,/g, '');
  const formattedValue = (Number(numericValue) || 0).toLocaleString('en-IN');

  return (
    <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
      {/* Main Value - Smaller and more compact */}
      <div className="space-y-1 md:space-y-2">
        <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] tracking-tight leading-none truncate">
          ₹{formattedValue}
        </h2>
        
        {/* Title - Better visibility with truncate */}
        <p className="text-[10px] md:text-xs text-[#8b8b90] font-medium truncate" title={title}>{title}</p>
      </div>

      {/* Trend Indicator - Compact */}
      {trend && (
        <div className="flex items-center gap-1 md:gap-2 mt-2 md:mt-3">
          {/* Icon in Circle */}
          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
            trend === 'up' 
              ? 'bg-[#8db5a2]/10' 
              : 'bg-[#c99393]/10'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#b8e8c6]" strokeWidth={2.5} />
            ) : (
              <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#f0b2b4]" strokeWidth={2.5} />
            )}
          </div>
          
          {/* Percentage */}
          <span className={`text-[10px] md:text-xs font-semibold ${
            trend === 'up' ? 'text-[#8db5a2]' : 'text-[#c99393]'
          }`}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
