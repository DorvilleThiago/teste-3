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
            fotos.forEach((foto, index) => {
                const file = new File([foto.blob], `foto${index + 1}.jpg`, { type: 'image/jpeg' });
                formData.append(`foto${index + 1}`, file);
              });

            const response = await fetch('http://localhost:9000/create', {
            method: 'POST',
            body: formData,
            });
        
            return await response.json();
        } catch (err) { 
            return false
        }
    }