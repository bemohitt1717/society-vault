import { Save, UserRound } from 'lucide-react';
import useAdminProfile from '../hooks/useAdminProfile';

const AdminProfilePage = () => {
  const { name, email, isLoading, isSaving, error, success, handleChange, handleSubmit } = useAdminProfile();

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-[#a99af2]">Account</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#f4f4f5]">Administrator profile</h1>
        <p className="mt-2 text-sm leading-6 text-[#b8bac2]">
          Update the name shown in your dashboard and account menu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-[#303136] bg-[#1d1e22] p-5 sm:p-6">
        {isLoading ? (
          <p className="text-sm text-[#b8bac2]">Loading profile...</p>
        ) : (
          <>
            <label htmlFor="admin-profile-name" className="mb-2 block text-sm font-medium text-[#d9d9de]">
              Full name
            </label>
            <div className="relative max-w-lg">
              <UserRound aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9b9da7]" />
              <input
                id="admin-profile-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={handleChange}
                maxLength={120}
                required
                className="w-full rounded-lg border border-[#36373d] bg-[#17181b] py-3 pl-10 pr-3 text-sm text-[#f4f4f5] outline-none transition focus:border-[#9b85ee] focus:ring-2 focus:ring-[#9b85ee]/25"
              />
            </div>

            <div className="mt-5 max-w-lg">
              <span className="mb-2 block text-sm font-medium text-[#d9d9de]">Email address</span>
              <p className="rounded-lg border border-[#303136] bg-[#17181b] px-3 py-3 text-sm text-[#aeb0b9]">{email}</p>
            </div>
          </>
        )}

        {error && <p role="alert" className="mt-4 text-sm text-[#f0b2b4]">{error}</p>}
        {success && <p role="status" className="mt-4 text-sm text-[#a6d2b7]">{success}</p>}

        {!isLoading && (
          <button
            type="submit"
            disabled={isSaving}
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#7659d9] px-4 text-sm font-semibold text-white transition hover:bg-[#8368e2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9a8ff] disabled:cursor-wait disabled:opacity-60"
          >
            <Save aria-hidden="true" className="size-4" />
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        )}
      </form>
    </section>
  );
};

export default AdminProfilePage;
