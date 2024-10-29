const socket = io();

        socket.on('updateProducts', (producto) => {
            const productList = document.getElementById('productList');
            const newProductItem = document.createElement('li');
            newProductItem.id = `product-${producto.id}`;
            newProductItem.textContent = `${producto.title} - $${producto.price}`;
            productList.appendChild(newProductItem);
            console.log("Producto recibido y agregado:", producto);
        });

        
        socket.on('deleteProduct', (productId) => {
            const productItem = document.getElementById(`product-${productId}`);
            if (productItem) {
                productItem.remove();
                console.log(`Producto con ID ${productId} eliminado`);
            }
        });