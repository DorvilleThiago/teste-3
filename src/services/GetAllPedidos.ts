import { CapacitorHttp, HttpResponse } from '@capacitor/core';

export async function GetAllPedidos () {
    const options = {
      url: 'http://thiagodorville.ddns.net:25565/pedidos',
    };
    try {
        const response: HttpResponse = await CapacitorHttp.get(options);
        return response.data
    } catch (err) { 
        console.log(err)
        return false
    }
  }