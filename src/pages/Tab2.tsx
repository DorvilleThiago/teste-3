import React, { useEffect, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import { GetAllPedidos } from '../services/GetAllPedidos';
import { Network } from '@capacitor/network';
import { Storage } from '@ionic/storage';

const Tab2: React.FC = () => {

  interface Item {
    nome: string;
    quantidade: number;
    detalhes: string;
  }

  const [pedidos, setPedidos] = useState<Item[]>([])
  const [online, setOnline] = useState(false)
  const storage = new Storage();

  const getPedidos = async () => {
    await storage.create();
    const resultPedidos = await GetAllPedidos()
  if (resultPedidos) {
    setPedidos(resultPedidos)
    await storage.set('Pedidos', resultPedidos)
    setOnline(true)
  } else { 
    let offpedidos = await storage.get('Pedidos')
    setOnline(false)
    if (!offpedidos) {
      offpedidos = [{
        nome: "Não há uma base de dados",
        quantidade: 0,
        detalhes: "..."
      }]
    }
    setPedidos(offpedidos)
  }
  } 
  
  useEffect(() => {
    getPedidos()
  }, [])

  return (
    <IonPage>

<IonHeader>
      <IonToolbar>
          <IonTitle>Solicitados</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>

        {online ?
          (<IonChip className='onlineStatus' color='success'>Online</IonChip>)
          :
          (<IonChip className='onlineStatus' color='danger'>Offline</IonChip>)
        }
        <IonButton color={'light'} onClick={() => getPedidos()} shape="round">Atualizar</IonButton>

        {pedidos.map((item, index) => (
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
          
      </IonContent>

    </IonPage>
  );
};

export default Tab2;
