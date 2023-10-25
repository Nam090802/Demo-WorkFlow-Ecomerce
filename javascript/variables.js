const listSP = [
    {
        id: 1,
        name: 'Nike Air Force 1',
        price: 10,
        quantity: 10,
        thumbnail: '../images/product_1.png'
    },
    {
        id: 2,
        name: 'Nike InfinityRN 4 SE',
        price: 15,
        quantity: 9,
        thumbnail: '../images/product_2.png'
    },
    {
        id: 3,
        name: 'Nike InfinityRN 2',
        price: 20,
        quantity: 4,
        thumbnail: '../images/product_3.png'
    },
    {
        id: 4,
        name: 'Sabrina 1 Ionic EP',
        price: 20,
        quantity: 7,
        thumbnail: '../images/product_4.png'
    },
    {
        id: 5,
        name: 'Luka 2 Lake Bled PF',
        price: 20,
        quantity: 7,
        thumbnail: '../images/product_5.png'
    },
    {
        id: 6,
        name: 'Nike Metcon 9 AMP',
        price: 30,
        quantity: 3,
        thumbnail: '../images/product_6.png'
    },
    {
        id: 7,
        name: 'Nike SB Chron 2 Canvas',
        price: 17,
        quantity: 6,
        thumbnail: '../images/product_7.png'
    },
    {
        id: 8,
        name: 'Nike SB Zoom Blazer Mid',
        price: 23,
        quantity: 6,
        thumbnail: '../images/product_8.png'
    },

]
const keyLocalStorageListSP = 'DANHSACHSP'
const keyLocalStorageItemCard = 'DANHSACHITEMCART'

const dataProductsFromLocalStorage = extensionIIFE.getLocalStorage(keyLocalStorageListSP)
if (!dataProductsFromLocalStorage) { extensionIIFE.setLocalStorage(keyLocalStorageListSP, listSP) }
// extensionIIFE.setLocalStorage(keyLocalStorageListSP, listSP)

