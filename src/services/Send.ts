interface Foto {
    url: string;
    blob: Blob;
}

    export async function Send(nome: string, numero: number, detalhes: string, fotos: Foto[]) {
        console.log(nome, numero, detalhes, JSON.stringify(fotos))
        try {
            /* const response = await fetch('http://localhost:9000/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    quantidade: numero,
                    detalhes,
                    fotos: fotos
                })
            })
            return await response.json() */
            return {}
        } catch (err) { 
            return false
        }
    }