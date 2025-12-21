type Tab = "cliente" | "destino" | "voos" | "hotel" | "transfers" | "experiencias" | "financeiro" | "resumo";

const tabs: { id: Tab; label: string }[] = [
    { id: "cliente", label: "Cliente" },
    { id: "destino", label: "Destino" },
    { id: "voos", label: "Voos" },
    { id: "hotel", label: "Hotel" },
    { id: "transfers", label: "Transfers" },
    { id: "experiencias", label: "Experiências" },
    { id: "financeiro", label: "Financeiro" },
    { id: "resumo", label: "Resumo" },
];

export function AdminTabs({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
    return (
        <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab.id
                            ? "text-[#09077d] border-b-2 border-[#09077d] bg-[#09077d]/5"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
