export async function GetAllPedidos() {
    try {
        const response = await fetch('http://143.198.101.34:9000/pedidos', {
            method: 'GET',
        })
        return await response.json()
    } catch (err) { 
        console.log(err);
        return false;
    }
}