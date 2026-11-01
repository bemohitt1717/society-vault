import { getResidentProfile } from '../data/residentProfileStorage';

const DetailRow = ({ label, value }) => (
  <div className="grid gap-1 border-b border-[#303136] py-4 last:border-b-0 sm:grid-cols-[minmax(120px,0.7fr)_minmax(0,1.3fr)] sm:gap-6">
    <dt className="text-sm text-[#aeb0b9]">{label}</dt>
    <dd className="min-w-0 break-words text-sm font-medium text-[#eeedf1]">{value || 'Not provided'}</dd>
  </div>
);

const MyProfilePage = () => {
  const profile = getResidentProfile();
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.5fr)] lg:gap-6">
        <section className="rounded-2xl border border-[#303136] bg-[#1a1a1e] p-5 md:p-6">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#7659d9]/20 text-lg font-semibold text-[#c8baff]"
            >
              {initials || 'R'}
            </div>
            <div className="min-w-0">
              <h2 className="break-words text-lg font-semibold text-[#f4f3f6]">{profile.name}</h2>
              <p className="mt-1 text-sm text-[#b8bac2]">
                {profile.flatNo ? `Flat ${profile.flatNo}` : 'Resident'}
                {profile.wing ? ` · Block ${profile.wing}` : ''}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-[#303136] pt-5">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#aeb0b9]">Resident account</p>
            <p className="mt-2 break-all text-sm leading-6 text-[#dedde3]">{profile.email || 'Email not provided'}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#303136] bg-[#1a1a1e] px-5 py-2 md:px-6">
          <div className="border-b border-[#303136] py-4">
            <h2 className="text-base font-semibold text-[#f4f3f6]">Profile details</h2>
            <p className="mt-1 text-sm text-[#aeb0b9]">Your contact and apartment information.</p>
          </div>

          <dl>
            <DetailRow label="Full name" value={profile.name} />
            <DetailRow label="Email address" value={profile.email} />
            <DetailRow label="Phone number" value={profile.phone} />
            <DetailRow label="Flat number" value={profile.flatNo} />
            <DetailRow label="Block" value={profile.wing} />
          </dl>
        </section>
      </div>
    </div>
  );
};

export default MyProfilePage;
