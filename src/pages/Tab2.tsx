import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonImg,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab2.css";
import { GetAllPedidos } from "../services/GetAllPedidos";
import { Storage } from "@ionic/storage";
import { Transform } from "stream";
import { Buffer } from "buffer";

const Tab2: React.FC = () => {
  interface Item {
    id: number;
    nome: string;
    quantidade: number;
    detalhes: string;
  }
  interface Fotos {
    foto: Buffer[];
  }

  const [pedidos, setPedidos] = useState<Item[]>([]);
  const [online, setOnline] = useState("carregando");
  const storage = new Storage();

  const [idAtual, setIdAtual] = useState<number>();
  const [listaUrls, setListaUrls] = useState<string[]>([]);
  const [fotos, setFotos] = useState<Fotos[]>([]);
  const [fotosModal, setFotosModal] = useState(false);

  const getPedidos = async () => {
    await storage.create();
    setOnline("carregando");
    const resultPedidos = await GetAllPedidos();
    if (resultPedidos) {
      setPedidos(resultPedidos);
      await storage.set("Pedidos", resultPedidos);
      setOnline("online");
    } else {
      let offpedidos = await storage.get("Pedidos");
      setOnline("offline");
      if (!offpedidos) {
        offpedidos = [
          {
            nome: "Não há uma base de dados",
            quantidade: 0,
            detalhes: "...",
          },
        ];
      }
      setPedidos(offpedidos);
    }
  };

  useEffect(() => {
    getPedidos();
  }, []);

  useEffect(() => {
    const rodar = async () => {
      if (idAtual != undefined) {
        setListaUrls([]);
        const lista = [];
        try {
          const fotos = await fetch(`http://localhost:9000/fotos/${idAtual}`, {
            method: "GET",
          });
          const fotosJson = await fotos.json();
          for (const foto of fotosJson) {
            const buffer = Buffer.from(foto.foto);
            const base64Data = buffer.toString("base64");
            const url = `data:image/jpeg;base64,${base64Data}`;
            lista.push(url);
          }
          setListaUrls(lista);
        } catch (e) {
          return;
        }
      }
    };
    rodar();
  }, [idAtual]);

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

        {online === "online" && (
          <IonChip className="onlineStatus" color="success">
            Online
          </IonChip>
        )}
        {online === "offline" && (
          <IonChip className="onlineStatus" color="danger">
            Offline
          </IonChip>
        )}
        {online === "carregando" && (
          <IonChip className="onlineStatus" color="warning">
            Carregando...
          </IonChip>
        )}

        <IonButton
          style={{ marginTop:0 }}
          color={"light"}
          onClick={() => getPedidos()}
          shape="round"
        >
          Atualizar
        </IonButton>

        {pedidos.map((item, index) => (
          <li key={index}>
            <IonCard color="tertiary">
              <IonCardHeader>
                <IonCardTitle>{item.nome}</IonCardTitle>
                <IonCardSubtitle>
                  x{item.quantidade} - {item.detalhes}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton
                  onClick={() => {
                    console.log(item.id);
                    setIdAtual(item.id);
                    setFotosModal(true);
                  }}
                  color={"dark"}
                >
                  Ver Fotos
                </IonButton>
              </IonCardContent>
            </IonCard>
          </li>
        ))}
      </IonContent>
      <IonModal isOpen={fotosModal} onDidDismiss={() => setFotosModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Fotos</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setFotosModal(false)}>Fechar</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent scrollY={true}>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 15,
              padding: 0,
            }}
          >
            {listaUrls.map((foto, index) => (
              <li style={{ listStyleType: "none", width: "90%" }} key={index}>
                <img src={foto} alt={`Image ${index}`} />
              </li>
            ))}
          </ul>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Tab2;
