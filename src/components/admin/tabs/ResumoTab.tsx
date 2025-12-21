type Props = {
    resumo: any
}

export function ResumoTab({ resumo }: Props) {
    return (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(resumo, null, 2)}
        </pre>
    )
}
