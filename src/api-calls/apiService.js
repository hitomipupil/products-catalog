export const apiService = () => {
    console.log('API');
   fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(json=>console.log(json))
    .catch(error=>console.error('Error:', error))
}