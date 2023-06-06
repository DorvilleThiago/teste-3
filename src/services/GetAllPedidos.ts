import { CapacitorHttp, HttpResponse } from '@capacitor/core';

export async function GetAllPedidos () {
    const options = {
      url: 'https://26f8-200-199-64-170.ngrok-free.app/pedidos',
    };
    try {
        const response: HttpResponse = await CapacitorHttp.get(options);
        return response.data
    } catch (err) { 
        console.log(err)
        return false
    }
  }