import React, { useEffect, useState } from 'react';
import './AddComponent.css';
import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonModal, IonRow, IonTextarea, IonTitle, IonToolbar, } from '@ionic/react';
import { camera, flowerOutline, send, sync } from 'ionicons/icons';
import { Send } from '../services/Send';
import { Storage } from '@ionic/storage';
import { Camera, CameraResultType } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

function base64toBlob(base64:any) {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: 'image/jpeg' }); // Adjust the type if necessary
  }

function AddComponent() {
    
    const storage = new Storage();
    
    const [nome, setNome] = useState('');
    const [number, setNumber] = useState(0);
    const [detalhes, setDetalhes] = useState('');
    const [images, setImages] = useState<Foto[]>([]);

    const [modal, setModal] = useState(false);
    const [enviou, setEnviou] = useState(false);
    const [falhou, setFalhou] = useState(false);
    const [syncSucess, setSyncSucess] = useState(false);
    const [syncFail, setSyncFail] = useState(false);
    const [syncNoNeed, setSyncNoNeed] = useState(false);
    const [pendentes, setPendentes] = useState<Item[]>([]);

    interface Item {
        nome: string;
        quantidade: number;
        detalhes: string;
        fotos: Foto[];
    }

    interface Foto {
        url: string;
        blob: Blob;
    }
    
    const handleFileInputChange = async () => {
        if (images.length === 3) {
            console.log('número máximo de fotos atingido')
            return;
        }
        console.log('A')
        defineCustomElements();
        console.log('B')
        try {
          const image = await Camera.getPhoto({
            quality: 30,
            allowEditing: false,
            resultType: CameraResultType.Base64
          });
        console.log('C')
            if (image.base64String) {
                const blob = base64toBlob(image.base64String);
                console.log('Image: ' + blob)
                console.log('D')
                const url = URL.createObjectURL(blob)
                console.log('E')
                setImages(prevImages => [...prevImages, { blob, url }])
                console.log('F')
            }
            console.log('G')
        } catch (error) {
          console.error('Error capturing image:', error);
        }
      };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!nome || !number || images.length < 1 || !detalhes) {
            console.log(`tá faltando algum dos parâmetros`)
            return;
        }
        const response = await Send(nome, number, detalhes, images);
        console.log(response)
        if (response) {
            setEnviou(true)
        } else {
            await storage.create();
            let submits = await storage.get('pendente')
            if (submits == null) {
                submits = [{ nome, quantidade: number, detalhes }]
                await storage.set('pendente', submits)
            } else {
                submits.push({ nome, quantidade: number, detalhes })
                await storage.set('pendente', submits)
            }
            console.log(submits)
            setPendentes(submits)
            setFalhou(true);
        }
    };

    const getPendentes = async () => {
        await storage.create();
        let submits = await storage.get('pendente')
        if (submits == null) { submits = [] }
        setPendentes(submits)
    }

    const syncData = async () => {
        storage.create()
        const submits = await storage.get('pendente')
        if (submits == null || submits.length == 0) { 
            setSyncNoNeed(true)
            return;
        }
        for (const obj of pendentes) {
            const res = await Send(obj.nome, obj.quantidade, obj.detalhes, obj.fotos)
            if (!res) {
                setSyncFail(true)
                return;
            }
        }
        setPendentes([])
        await storage.set('pendente', [])
        setSyncSucess(true)
        return;
    }

    useEffect(() => {
      getPendentes()
    }, [])

    return (
        <IonGrid>
            <form onSubmit={handleSubmit}>
            <IonRow>
                <IonInput onIonInput={(e) => setNome(e.detail.value!)} label='Nome' labelPlacement='stacked' placeholder='Caneta' type='text'/>
                <IonInput onIonInput={(e) => setNumber(parseInt(e.detail.value!))} label='Quantidade' labelPlacement='stacked' placeholder='5' type='number' />
                <IonTextarea
                onIonInput={(e) => setDetalhes(e.detail.value!)}
                fill='solid'
                label='Detalhes'
                labelPlacement='stacked'
                placeholder='Apenas canetas azuis e de ponta fina...' />
                <IonButton style={{marginLeft: 10, marginTop: 12}} onClick={handleFileInputChange}> <IonIcon slot='start' icon={camera} /> Tirar Foto</IonButton>
                {images.length > 0
                && 
                <IonButton style={{marginLeft: 10, marginTop: 12}} onClick={() => setModal(true)} expand="block"> <IonIcon slot='start' icon={flowerOutline} /> Ver Fotos</IonButton>}
                </IonRow>
            <IonButton className='sendButtom' type='submit' shape='round'>
                <IonIcon slot='start' icon={send}/>
                Pedir
            </IonButton>
            <IonButton onClick={() => syncData()} className='sync' shape='round'>
                <IonIcon slot='start' icon={sync}/>
                Sincronizar
            </IonButton>
            </form>
            {pendentes.map((item, index) => (
                <li key={index}>
                    <IonCard color="tertiary">
                    <IonCardHeader>
                        <IonCardTitle>{item.nome}</IonCardTitle>
                        <IonCardSubtitle>x{item.quantidade}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>{item.detalhes}</IonCardContent>
                    </IonCard>
                </li>)
            )}
            <IonAlert
                isOpen={enviou}
                header="Deu certo!"
                subHeader="Menssagem"
                message="Sua solicitação foi enviada com sucesso!"
                buttons={['OK']}
                onDidDismiss={() => setEnviou(false)}
            />
            <IonAlert
                isOpen={falhou}
                header="Puts..."
                subHeader="Mensagem"
                message="Você não está contectado, mas quando estiver é só sincronizar!"
                buttons={['OK']}
                onDidDismiss={() => setFalhou(false)}
            />
            <IonAlert
                isOpen={syncSucess}
                header="Sincronizado!"
                subHeader="Mensagem"
                message="Seus dados foram sincronizados"
                buttons={['OK']}
                onDidDismiss={() => setSyncSucess(false)}
            />
            <IonAlert
                isOpen={syncFail}
                header="Deu ruim..."
                subHeader="Mensagem"
                message="Não foi possível sincronizar"
                buttons={['OK']}
                onDidDismiss={() => setSyncFail(false)}
            />
            <IonAlert
                isOpen={syncNoNeed}
                header="Nem precisa"
                subHeader="Mensagem"
                message="Você não tem pedidos para sincronizar!"
                buttons={['OK']}
                onDidDismiss={() => setSyncNoNeed(false)}
            />
            <IonModal isOpen={modal} onDidDismiss={() => setModal(false)}>
                <IonHeader>
                    <IonToolbar>
                    <IonTitle>Fotos</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setModal(false)}>Fechar</IonButton>
                    </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent scrollY={true}>
                    <ul style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, padding: 0}}>
                    {images.map((image, index) => (
                        <li style={{listStyleType: 'none', width: '90%'}} key={index}>
                        <IonImg src={image.url} alt={`Image ${index}`} />
                        </li>
                    ))}
                    </ul>
                </IonContent>
            </IonModal>
            
        </IonGrid>
        
    )
}
export default AddComponent;