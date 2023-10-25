const dataListProduct = extensionIIFE.getLocalStorage(keyLocalStorageListSP)

// xu ly them san pham vao gio hang
const handleClickAddToCart = (productId) => {
    let productsInCart = extensionIIFE.getLocalStorage(keyLocalStorageItemCard) || []

    const checkMaxQuantity = (productCard) => {
        const products = extensionIIFE.getLocalStorage(keyLocalStorageListSP)
        let isMax = false
        products.forEach(product => {
            if (product.id === productCard.id && productCard.quantity >= product.quantity) {
                isMax = true
            }
        })
        return isMax
    }

    const updateProductsInCart = (productUpdate) => {
        const arr = productsInCart.filter(item => item.id !== productId)
        return [...arr, productUpdate]
    }

    if (productsInCart) {
        const productAddToCart = productsInCart.find(item => item.id === productId)
        if (productAddToCart) {
            let isMax = checkMaxQuantity(productAddToCart)
            if (isMax) {
                toast({
                    type: 'error',
                    title: 'Thông báo!',
                    message: 'Sản phẩm đã đạt số lượng tối đa!'
                })
                return
            }
            productAddToCart.quantity += 1
            toast({
                type: 'success',
                title: 'Thông báo!',
                message: 'Đã thêm sản phẩm thành công!'
            })
            productsInCart = updateProductsInCart(productAddToCart)
        } else {
            const newProductIncart = { id: productId, quantity: 1 }
            productsInCart.push(newProductIncart)
            toast({
                type: 'success',
                title: 'Thông báo!',
                message: 'Đã thêm sản phẩm thành công!'
            })
        }
        extensionIIFE.setLocalStorage(keyLocalStorageItemCard, productsInCart)
    } else {
        const firstProductInCart = { id: productId, quantity: 1 }
        extensionIIFE.setLocalStorage(keyLocalStorageItemCard, [firstProductInCart])
    }
    handleUpdateQuanlityProductInCart()
}


let html = ``
dataListProduct.length > 0 && dataListProduct.map(product => {
    const { id, name, price, quantity, thumbnail } = product
    html += `<article class="product-card">
                <div class="product-card__img">
                    <img src=${thumbnail} alt="PRODUCT_IMG">
                    <div class="btn__addToCart" onclick="handleClickAddToCart(${id})">
                        <i class="fa-solid fa-cart-plus"></i>
                    </div>
                </div>
                <div class="product-card__info">
                    <p class="product-card__info-name">${name}</p>
                    <div>
                        <p class="product-card__info-price">${price}$</p>
                        <p class="product-card__info-quantity">Quantity: ${quantity}</p>
                    </div>
                </div>
            </article>`
})
// cap nhat lai so luong san pham co trong gio hang
handleUpdateQuanlityProductInCart()

$('.content__products').innerHTML = html
