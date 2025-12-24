import { Navigate, Route, Routes, useResolvedPath } from "react-router-dom"
import VendorHome from "../screens/vendor/VendorHome"
import QuoteIndex from "../screens/quote/QuoteIndex"
import QuoteVersion from "../screens/quote/QuoteVersion"
import TemplateFormEditor from "../screens/app/TemplateFormEditor"
import QuoteManager from "../screens/app/QuoteManager"
import TemplateSetup from "../screens/vendor/TemplateSetup"
import Diag from "../screens/Diag"

function NotFoundVendor() {
    const appPath = useResolvedPath("/app").pathname

    return (
        <div style={{ padding: 18, fontFamily: "system-ui" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                Página não encontrada
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                Verifique o link ou volte para a área do vendedor.
            </div>
            <div style={{ marginTop: 14 }}>
                <a href={appPath} style={{ color: "#111827", fontWeight: 700 }}>
                    Ir para a área do vendedor
                </a>
            </div>
        </div>
    )
}

function NotFoundPublic() {
    return (
        <div style={{ padding: 24, fontFamily: "system-ui", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
                Essa experiência não está mais disponível
            </div>
            <div style={{ marginTop: 12, fontSize: 15, color: "#6b7280" }}>
                Peça ao seu consultor uma versão atualizada da sua proposta ✨
            </div>
        </div>
    )
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/app" replace />} />

            <Route path="/diag" element={<Diag />} />

            {/* Área do vendedor */}
            <Route path="/app" element={<VendorHome />} />
            <Route path="/app/cotacao/:id" element={<QuoteManager />} />
            <Route path="/app/template-setup" element={<TemplateSetup />} />
            <Route path="/app/template/:destinationKey" element={<TemplateFormEditor />} />
            <Route path="/app/*" element={<NotFoundVendor />} />

            {/* Área pública (cliente) */}
            <Route path="/q/:publicId">
                <Route index element={<QuoteIndex />} />
                <Route path="v/:versionId" element={<QuoteVersion />} />
                <Route path="*" element={<NotFoundPublic />} />
            </Route>

            {/* fallback absoluto */}
            <Route path="*" element={<NotFoundVendor />} />
        </Routes>
    )
}
