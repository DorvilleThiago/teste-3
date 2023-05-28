import React, { useEffect, useState } from 'react';
import './AddComponent.css';
import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonInput, IonRow, IonText, IonTextarea } from '@ionic/react';
import { send, sync } from 'ionicons/icons';
import { Send } from '../services/Send';
import { Storage } from '@ionic/storage';

function AddComponent(props: any) {

    const storage = new Storage();
    
    const [nome, setNome] = useState('');
    const [number, setNumber] = useState(0);
    const [detalhes, setDetalhes] = useState('');

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
      }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await Send(nome, number, detalhes);
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
            const res = await Send(obj.nome, obj.quantidade, obj.detalhes)
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
                <IonInput onIonChange={(e) => setNome(e.detail.value!)} label='Nome' labelPlacement='stacked' placeholder='Caneta' type='text'/>
                <IonInput onIonChange={(e) => setNumber(parseInt(e.detail.value!))} label='Quantidade' labelPlacement='stacked' placeholder='5' type='number' />
                    <IonTextarea
                    onIonChange={(e) => setDetalhes(e.detail.value!)}
                    fill='solid'
                    label='Detalhes'
                    labelPlacement='stacked'
                    placeholder='Apenas canetas azuis e de ponta fina...' />
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
        </IonGrid>
        
    )
}
export default AddComponent;