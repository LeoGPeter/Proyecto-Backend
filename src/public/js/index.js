const socket = io();

        // Escuchar el evento `updateProducts` y agregar el producto a la lista
        socket.on('updateProducts', (producto) => {
            const productList = document.getElementById('productList');
            const newProductItem = document.createElement('li');
            newProductItem.id = `product-${producto.id}`;
            newProductItem.textContent = `${producto.title} - $${producto.price}`;
            productList.appendChild(newProductItem);
            console.log("Producto recibido y agregado:", producto);
        });

        // Escuchar el evento `deleteProduct` y eliminar el producto de la lista
        socket.on('deleteProduct', (productId) => {
            const productItem = document.getElementById(`product-${productId}`);
            if (productItem) {
                productItem.remove();  // Eliminar el elemento del DOM
                console.log(`Producto con ID ${productId} eliminado`);
            }
        });