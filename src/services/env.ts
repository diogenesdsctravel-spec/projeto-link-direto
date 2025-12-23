type AppEnv = "mock" | "real"

export function getAppEnv(): AppEnv {
    const raw = String(import.meta.env.VITE_APP_ENV ?? "mock").toLowerCase()
    return raw === "real" ? "real" : "mock"
}
