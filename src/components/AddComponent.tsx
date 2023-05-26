import React, { useState } from 'react';
import './AddComponent.css';
import { IonAlert, IonButton, IonCol, IonGrid, IonIcon, IonInput, IonRow, IonText, IonTextarea } from '@ionic/react';
import { send } from 'ionicons/icons';
import { Send } from '../services/Send';

function AddComponent(props: any) {
    
    const [nome, setNome] = useState('');
    const [number, setNumber] = useState(0);
    const [detalhes, setDetalhes] = useState('');

    const [enviou, setEnviou] = useState(false);
    const [falhou, setFalhou] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await Send(nome, number, detalhes);
        console.log(response)
        if (!response) {
            setFalhou(true)
        }
        setEnviou(true)
    };

    return (
        <IonGrid>
            <form onSubmit={handleSubmit}>
            <IonRow>
                <IonInput onIonChange={(e) => setNome(e.detail.value!)} label='Nome' labelPlacement='stacked' placeholder='Caneta' type='text'/>
                <IonInput onIonChange={(e) => setNumber(parseInt(e.detail.value!))} label='Quantidade' labelPlacement='stacked' placeholder='5' type='number' />
                    <IonTextarea
                    onIonChange={(e) => setDetalhes(e.detail.value!)}
                    fill='solid'
                    label='Detalhes'
                    labelPlacement='stacked'
                    placeholder='Apenas canetas azuis e de ponta fina...' />
            </IonRow>
            <IonButton type='submit' shape='round'>
                <IonIcon slot='start' icon={send}/>
                Pedir
            </IonButton>
            </form>
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
                subHeader="Menssagem"
                message="Você não está contectado, mas quando estiver é só sincronizar!"
                buttons={['OK']}
                onDidDismiss={() => setFalhou(false)}
            />
        </IonGrid>
        
    )
}
export default AddComponent;