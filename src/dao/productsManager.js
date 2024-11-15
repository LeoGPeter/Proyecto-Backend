import fs from 'fs';

class ProductsManager {
    constructor(filePath) {
        this.filePath = filePath;
    }


    readProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo los productos:', error);
            return [];
        }
    }


    writeProducts(products) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Error escribiendo los productos:', error);
        }
    }

  
    addProduct(product) {
        const products = this.readProducts();
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...product,
        };
        products.push(newProduct);
        this.writeProducts(products);
        return newProduct;
    }

   
    getProductById(productId) {
        const products = this.readProducts();
        return products.find(product => product.id === productId) || null;
    }


    updateProduct(productId, updatedData) {
        const products = this.readProducts();
        const index = products.findIndex(product => product.id === productId);

        if (index === -1) return null;

        const updatedProduct = { ...products[index], ...updatedData, id: productId };
        products[index] = updatedProduct;
        this.writeProducts(products);

        return updatedProduct;
    }


    deleteProduct(productId) {
        const products = this.readProducts();
        const index = products.findIndex(product => product.id === productId);

        if (index === -1) return null;

        const deletedProduct = products.splice(index, 1)[0];
        this.writeProducts(products);

        return deletedProduct;
    }
}

export default ProductsManager;
