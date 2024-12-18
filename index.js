let productsContainer = document.getElementById("products-container");
const categorySelector = document.getElementById("categorySelector");
const minPriceInput = document.getElementById("minPriceInput");
const maxPriceInput = document.getElementById("maxPriceInput");




const loadHandler = async () => {
    // empty the current products list
    productsContainer.innerHTML = '';
    // fetch data
    const products = await getProducts();
    if (!products) {
        console.error("Failed to load products.");
        return;
    }
    // if the price range is selected, keep only products with price in that range
    const filteredProducts = filterProductsByPrice(products);
    if (filteredProducts.length === 0) {
        console.error("No result");
        showError('No result')
        return;
    }
    filteredProducts.forEach(productData => {   
        const product = createProduct(productData);
        productsContainer.append(product);
    });
}

const getProductURL = () => {
    if (categorySelector.value) {
        // if category is selected, fetch data of products in that category
        return `https://fakestoreapi.com/products/category/${encodeURIComponent(categorySelector.value)}`
    } else {
        // if category is not selected, fetch data of all products
        return `https://fakestoreapi.com/products`;
    }
}

const getProducts = async () => {
    try {
        const res = await fetch(getProductURL());
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

const filterProductsByPrice = (products) => {
    const minPrice = minPriceInput ? Number(minPriceInput.value) : null;
    const maxPrice = maxPriceInput ? Number(maxPriceInput.value): null;
    let filteredProducts = products;
    if(minPrice && maxPrice && minPrice > maxPrice){
            console.error("min price cannot exceed max price.");
            showError('min price cannot exceed max price!')
            return [];
    }
    if (maxPrice) {
        if (minPrice) {
            filteredProducts = products.filter((product) => product.price >= minPrice && product.price <= maxPrice)
        } else {
            filteredProducts = products.filter((product) => product.price <= maxPrice)
        }
    } else {
        if (minPrice) {
            filteredProducts = products.filter((product) => product.price >= minPrice)
        }
    }
    return filteredProducts;
}

const createProduct = (productData) => {
    const productContainer = document.createElement('div');
    productContainer.id = productData.id;
    const productImg = document.createElement("img");
    productImg.src = productData.image;
    const productName = document.createElement("div");
    productName.innerText = productData.title;
    const productPrice = document.createElement("div");
    productPrice.innerText = productData.price;
    productContainer.append(productImg, productName, productPrice);
    return productContainer;
}

const showError = (message) => {
    productsContainer.innerHTML = `<div class="error">${message}</div>`;
};

categorySelector.addEventListener('change', loadHandler);

minPriceInput.addEventListener('change', loadHandler);
maxPriceInput.addEventListener('change', loadHandler);



loadHandler();