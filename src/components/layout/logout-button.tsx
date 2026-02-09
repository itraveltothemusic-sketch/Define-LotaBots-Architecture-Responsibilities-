export function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="post">
      <button
        type="submit"
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
      >
        Sign out
      </button>
    </form>
  );
}
