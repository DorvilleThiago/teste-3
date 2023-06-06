import { CapacitorHttp, HttpResponse } from '@capacitor/core';

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
              
            const options = {
                url: 'http://thiagodorville.ddns.net:25565/create',
                data: formData,
            };
            const response: HttpResponse = await CapacitorHttp.post(options);
            return response.data
        } catch (err) { 
            return false
        }
    }