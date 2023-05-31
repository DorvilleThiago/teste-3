interface Foto {
    url: string;
    blob: string;
}

    export async function Send(nome: string, numero: number, detalhes: string, fotos: Foto[]) {
        console.log(nome, numero, detalhes, fotos)
        try {
             const response = await fetch('http://localhost:9000/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    quantidade: numero,
                    detalhes,
                    fotos
                })
            })
            return await response.json() 
        } catch (err) { 
            return false
        }
    }