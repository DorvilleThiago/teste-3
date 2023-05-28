import React from 'react';
import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonLabel } from '@ionic/react';
import './Tab1.css';
import AddComponent from '../components/AddComponent';

const Tab1: React.FC = () => {

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
