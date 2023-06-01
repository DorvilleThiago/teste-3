import React, { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonImg, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import { GetAllPedidos } from '../services/GetAllPedidos';
import { Storage } from '@ionic/storage';
import { Transform } from 'stream';

function convertToUrl(buffer: Buffer) {
  const base64Data = buffer.toString('base64');
  return `data:image/jpeg;base64,${base64Data}`
}

const Tab2: React.FC = () => {
  interface Item {
    id: number;
    nome: string;
    quantidade: number;
    detalhes: string;
    fotos: Buffer[];
  }
  interface Fotos {
    foto: Buffer[]
    id: number
  }
  

  const [pedidos, setPedidos] = useState<Item[]>([])
  const [online, setOnline] = useState(false)
  const storage = new Storage();

  const [fotosAtual, setFotosAtual] = useState<Fotos>()
  const [fotos, setFotos] = useState<Fotos[]>([])
  const [fotosModal, setFotosModal] = useState(false)

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

  const findFotos = (id: number): Fotos | undefined => {
    return fotos.find((pedido) => pedido.id === id);
  };
  

  const getFotos = () => {
    console.log('logPósPedidos: '+pedidos)
    const fotos:Fotos[] = []
    pedidos.map((pedido) => {
      const fotos_do_pedido = {
        foto: pedido.fotos,
        id: pedido.id
      }
      fotos.push(fotos_do_pedido)
    })
    setFotos(fotos)
  } 

  useEffect(() => {
    const rodar = async() => {
      await getPedidos()
    }
    rodar()
  }, [])

  useEffect(() => {
    console.log('fotosAtual: '+fotosAtual)
  }, [fotosAtual])

  useEffect(() => {
    console.log('pedidos: ' + pedidos)
     getFotos()
  }, [pedidos])

  useEffect(() => {
    console.log('fotos: '+fotos)
  }, [fotos])

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
                <IonCardSubtitle>x{item.quantidade} - {item.detalhes}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton onClick={() => {
                  console.log(fotos)
                  console.log(item.id)
                  setFotosAtual(findFotos(item.id))
                  setFotosModal(true)
                }} color={'dark'}>Ver Fotos</IonButton>
              </IonCardContent>
            </IonCard>
          </li>)
        )}
      </IonContent>
      <IonModal isOpen={fotosModal}>
                <IonHeader>
                    <IonToolbar>
                    <IonTitle>Fotos</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setFotosModal(false)}>Fechar</IonButton>
                    </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent scrollY={true}>
                    <ul style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, padding: 0}}>
                    {fotosAtual?.foto.map((foto, index) => (
                        <li style={{listStyleType: 'none', width: '90%'}} key={index}>
                        <IonImg src={convertToUrl(foto)} alt={`Image ${index}`} />
                        </li>
                    ))}
                    </ul>
                </IonContent>
        </IonModal>
    </IonPage>
  );
};

export default Tab2;