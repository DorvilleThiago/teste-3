import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import { GetAllPedidos } from '../services/GetAllPedidos';
import { Network } from '@capacitor/network';

import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

const Tab2: React.FC = () => {

  interface Item {
    nome: string;
    quantidade: number;
    detalhes: string;
  }

  const [pedidos, setPedidos] = useState<Item[]>([])
  const storage = new Storage();

  useEffect(() => {
    const con = async () => {
      const conDispositivo = (await Network.getStatus()).connected
      console.log(conDispositivo)
    }
    con()
  }, [])

  useEffect(() => {
    const getPedidos = async() => {
        const resultPedidos = await GetAllPedidos()
      if (resultPedidos) {
        setPedidos(resultPedidos)
        storage.setItem('Pedidos', resultPedidos)
      } else { 
        //@ts-ignore
          setPedidos(storage.getItem('Pedidos'))
      }
    }
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

        {pedidos.map((item, index) => (
          <li key={index}>
            <h3>{item.nome}</h3>
            <p>Quantidade: {item.quantidade}</p>
            <p>Detalhes: {item.detalhes}</p>
          </li>)
        )}
        
          
      </IonContent>

    </IonPage>
  );
};

export default Tab2;
