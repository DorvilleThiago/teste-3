export async function Send(nome: string, numero: number, detalhes: string) {
    try {
        const response = await fetch('http://143.198.101.34:9000/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome,
                quantidade: numero,
                detalhes
            })
        })
        return await response.json()
    } catch (err) { 
        return false
    }
}