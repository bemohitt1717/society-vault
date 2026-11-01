import { Calendar, Clock, Wrench } from 'lucide-react';

const UpcomingMaintenanceCard = ({ maintenanceList }) => {

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <section className="overflow-hidden rounded-xl border border-[#303136] bg-[#1a1a1e]" aria-labelledby="upcoming-maintenance-title">
      <div className="flex items-center gap-3 border-b border-[#303136] px-4 py-3.5 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#7f5af0]/12 text-[#a78bfa]">
          <Wrench aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          <h2 id="upcoming-maintenance-title" className="text-base font-semibold text-[#f4f4f5]">Upcoming maintenance</h2>
          <p className="mt-0.5 text-xs text-[#aeb4bf]">Society scheduled activities</p>
        </div>
      </div>

      {!maintenanceList || maintenanceList.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-[#aeb4bf]">
          No upcoming maintenance scheduled.
        </p>
      ) : (
        <ul className="divide-y divide-[#2b2d31]">
          {maintenanceList.map((item) => (
            <li key={item.id} className="px-4 py-4 transition-colors duration-150 hover:bg-[#202124] sm:px-5">
              <h3 className="text-sm font-semibold text-[#f4f4f5]">{item.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#b8bec8]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar aria-hidden="true" className="h-3.5 w-3.5 text-[#a78bfa]" />
                  {formatDate(item.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock aria-hidden="true" className="h-3.5 w-3.5 text-[#a78bfa]" />
                  {item.time}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#aeb4bf]">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UpcomingMaintenanceCard;
