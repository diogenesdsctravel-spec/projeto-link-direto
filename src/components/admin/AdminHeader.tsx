export function AdminHeader({ user, supabase }: { user: any; supabase: any }) {
    return (
        <div className="bg-white border-b px-6 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">Painel de Cotações</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <button
                        className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
                        onClick={async () => {
                            await supabase.auth.signOut();
                            location.reload();
                        }}
                    >
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}

