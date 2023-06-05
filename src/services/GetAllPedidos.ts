import { CapacitorHttp, HttpResponse } from '@capacitor/core';

export async function GetAllPedidos () {
    const options = {
      url: 'https://5d38-200-170-138-241.ngrok-free.app/pedidos',
    };
    try {
        const response: HttpResponse = await CapacitorHttp.get(options);
        return response.data
    } catch (err) { 
        console.log(err)
        return false
    }
  }