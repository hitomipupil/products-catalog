let productsContainer = document.getElementById("products-container");
const categorySelector = document.getElementById("categorySelector");
const minPriceInput = document.getElementById("minPriceInput");
const maxPriceInput = document.getElementById("maxPriceInput");
const searchInput = document.getElementById('search');


const loadHandler = async () => {
    // empty the current products list
    productsContainer.innerHTML = '';
    minPriceInput.style.borderColor = '';
    maxPriceInput.style.borderColor = '';
    
    const minPrice = minPriceInput.value.trim() === "" ? null : Number(minPriceInput.value);
    const maxPrice = maxPriceInput.value.trim() === "" ? null : Number(maxPriceInput.value);

    console.log(minPrice, maxPrice)

    if (!isPriceRangeCorrect(minPrice, maxPrice)) {
        console.error("min price cannot exceed max price.");
        showError('Min price cannot exceed max price!');
        minPriceInput.style.borderColor = 'red';
        maxPriceInput.style.borderColor = 'red';
        return;
    }

    // fetch data
    const products = await getProducts();
    if (!products) {
        console.error("Failed to load products.");
        return;
    }
    // if the price range is selected, keep only products with price in that range
    const filteredPriceProducts = filterProductsByPrice(products, minPrice, maxPrice);

    // if there is text in search bar, keep only products with name including that text
    const searchValue = searchInput ? searchInput.value : null;
    let searchResult = filteredPriceProducts;
    if (searchValue) {
        searchResult = filteredPriceProducts.filter((product) => product.title.toLowerCase().includes(searchValue.trim().toLowerCase()))
    }

    if (searchResult.length === 0) {
        console.error("No result");
        showError("No Result");
        return;
    }

    searchResult.forEach(productData => {
        const product = createProduct(productData);
        productsContainer.append(product);
    });
}

const isPriceRangeCorrect = (minPrice, maxPrice) => {
    if (minPrice !== null && maxPrice !== null) {
        return minPrice <= maxPrice;
    }
    return true;
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

const filterProductsByPrice = (products, minPrice, maxPrice) => {
    let filteredProducts = products;
    if (maxPrice) {
        if (minPrice !== null) {
            filteredProducts = products.filter((product) => product.price >= minPrice && product.price <= maxPrice)
        } else {
            filteredProducts = products.filter((product) => product.price <= maxPrice)
        }
    } else {
        if (minPrice !== null) {
            filteredProducts = products.filter((product) => product.price >= minPrice)
        }
    }
    console.log(filteredProducts);
    
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
    productPrice.innerText = `$${productData.price}`;
    productContainer.append(productImg, productName, productPrice);
    return productContainer;
}

const showError = (message) => {
    productsContainer.innerHTML = `<div class="error">${message}</div>`;
};

categorySelector.addEventListener('change', loadHandler);

minPriceInput.addEventListener('change', loadHandler);
maxPriceInput.addEventListener('change', loadHandler);
searchInput.addEventListener('change', loadHandler);



loadHandler();