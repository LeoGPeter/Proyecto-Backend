const socket = io();
const productList = document.getElementById('productList');

async function loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();


    productList.innerHTML = '';

    products.forEach((producto) => {
        const newProductItem = document.createElement('li');
        newProductItem.id = `product-${producto._id}`;
        newProductItem.textContent = `${producto.title} / ${producto.description} - $${producto.price}`;
        productList.appendChild(newProductItem);
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



