const socket = io();
const productList = document.getElementById('productList');

async function loadProducts() {
    const response = await fetch('/realtimeproducts');
    const data = await response.json();

    // Verificar si `data.products` es un array
    const products = Array.isArray(data.products) ? data.products : [];

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.textContent = `Producto: ${product.title} - Precio: ${product.price}`;
        document.body.appendChild(productElement);
    });
}

loadProducts();


socket.on('updateProducts', (producto) => {
    const newProductItem = document.createElement('li');
    newProductItem.id = `product-${producto._id}`;
    newProductItem.textContent = `${producto.title} / ${producto.description} - $${producto.price}`;
    productList.appendChild(newProductItem);
    console.log("Producto recibido y agregado:", producto);
});

socket.on('deleteProduct', (productId) => {
    const productItem = document.getElementById(`product-${productId}`);
    if (productItem) {
        productItem.remove();
        console.log(`Producto con ID ${productId} eliminado del DOM`);
    }
});



