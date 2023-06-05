interface Foto {
    url: string;
    blob: Blob;
}

    export async function Send(nome: string, numero: number, detalhes: string, fotos: Foto[]) {
        console.log(nome, numero, detalhes, fotos)
        console.log(fotos[0].blob)
        try {
            
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('quantidade', numero.toString());
            formData.append('detalhes', detalhes);

            fotos.forEach((foto) => {
                const file = new File([foto.blob], 'mergedFoto.jpg', { type: 'image/jpeg' });
                formData.append('mergedFoto', file);
              });
              
            
            const response = await fetch('https://5d38-200-170-138-241.ngrok-free.app/create', {
            method: 'POST',
            body: formData,
            });
            return await response.json();
        } catch (err) { 
            return false
        }
    }