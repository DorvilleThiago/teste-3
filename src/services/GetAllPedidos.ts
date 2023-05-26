export async function GetAllPedidos() {
    try {
        const response = await fetch('http://localhost:9000/pedidos', {
            method: 'GET',
        })
        return await response.json()
    } catch (err) { 
        console.log(err);
        return false;
    }
}