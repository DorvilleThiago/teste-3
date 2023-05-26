import React from 'react';
import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonLabel } from '@ionic/react';
import './Tab1.css';
import AddComponent from '../components/AddComponent';
import { Storage } from '@ionic/storage';


const Tab1: React.FC = () => {


  const store = new Storage();
  

  return (
    <IonPage>

      <IonHeader>

        <IonToolbar>
          <IonTitle>Solicitar</IonTitle>
        </IonToolbar>

      </IonHeader>

      <IonContent fullscreen>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Solicitar</IonTitle>
          </IonToolbar>
        </IonHeader>

        <AddComponent/>

      </IonContent>

    </IonPage>
  );
};

export default Tab1;
