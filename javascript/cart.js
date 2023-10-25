const cartContent = $('.cart__content')
const btnModalCancle = $('.cart__modal-btn.btn__cancle')
const iconCloseModal = $('.icon-close')

const handleToggleModalPayment = () => {
    $('body').classList.toggle('noneScroll')
    $('.cart__modal').classList.toggle('isShow')
}

const handleIncreaseQuantity = (idSP) => {
    const { quantity } = getByIdSP(idSP)
    let productsInCart = extensionIIFE.getLocalStorage(keyLocalStorageItemCard)
    let quantityProductInCart = productsInCart.find(item => item.id === idSP).quantity
    if (quantityProductInCart >= quantity) {
        alert('Không thể tăng thêm số lượng!!!')
    } else {
        quantityProductInCart += 1
        productsInCart = productsInCart.map(item => {
            if (item.id === idSP) {
                item.quantity = quantityProductInCart
            }
            return item
        })
        extensionIIFE.setLocalStorage(keyLocalStorageItemCard, productsInCart)
    }
    renderUI()
}

const handleReduceQuantity = (idSP) => {
    let productsInCart = extensionIIFE.getLocalStorage(keyLocalStorageItemCard)
    let quantityProductInCart = productsInCart.find(item => item.id === idSP).quantity
    if (quantityProductInCart <= 1) {
        handledeleteProductFromCart(idSP)
    } else {
        quantityProductInCart -= 1
        productsInCart = productsInCart.map(item => {
            if (item.id === idSP) {
                item.quantity = quantityProductInCart
            }
            return item
        })
        extensionIIFE.setLocalStorage(keyLocalStorageItemCard, productsInCart)
    }
    renderUI()
}

const handledeleteProductFromCart = (productId) => {
    const isDelete = confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?')
    if (isDelete) {
        deleteProductFromCart(productId)
        handleUpdateQuanlityProductInCart()
        renderUI()
    }
}

// ham render du lieu tinh/thanh pho
const handleRenderProvinces = async () => {
    const provinces = await extensionIIFE.callApi('https://provinces.open-api.vn/api/p')
    let html = ``
    provinces?.forEach(province => {
        const { name, code } = province
        html += `<option value="${code}">${name}</option>`
    })
    $('.cart__modal-select-city').insertAdjacentHTML('beforeend', html)
}
// ham render du lieu huyen/quan
const handleRenderDistricts = async (provinceId) => {
    const districts = await getDistrictsByProvinceID(Number(provinceId))
    let html = `<option value="">--Chọn Huyện/Quận--</option>`
    districts?.forEach(district => {
        const { name, code } = district
        html += `<option value="${code}">${name}</option>`
    })
    $('.cart__modal-select-district').innerHTML = html
}
// ham render du lieu xa/phuong
const handleRenderWards = async (districtId) => {
    const wards = await getWardsByDistrictID(Number(districtId))
    let html = `<option value="">--Chọn Phường/Xã--</option>`
    wards?.forEach(ward => {
        const { name, code } = ward
        html += `<option value="${code}">${name}</option>`
    })
    $('.cart__modal-select-ward').innerHTML = html
}

btnModalCancle.onclick = function (e) {
    e.preventDefault()
    handleClearInputData()
    handleToggleModalPayment()
}

iconCloseModal.onclick = () => {
    handleClearInputData()
    handleToggleModalPayment()
}

handleRenderProvinces()
// bat su kien thay doi value select province
$('.cart__modal-select-city').onchange = function (e) {
    const provinceId = e.target.value
    handleRenderDistricts(provinceId)
}
// bat su kien thay doi value select district
$('.cart__modal-select-district').onchange = function (e) {
    const districtId = e.target.value
    handleRenderWards(districtId)
}

const renderUI = () => {
    let html = ``
    const productsInCart = extensionIIFE.getLocalStorage(keyLocalStorageItemCard) || []

    const products = extensionIIFE.getLocalStorage(keyLocalStorageListSP) || []

    const totalQuantity = productsInCart.calculateSumAndStoreInMap('quantity', 0).get('sum')

    const productsInCartForCaculateTotal = productsInCart.map(productInCart => {
        let product
        products.forEach(item => {
            if (productInCart.id === item.id) {
                product = { ...productInCart, price: item.price }
            }
        })
        return product

    })
    const totalPrice = productsInCartForCaculateTotal.calculateSumAndStoreInMap('quantity', 'price').get('sum')

    if (productsInCart.length > 0) {
        html = `<ul class="cart__content-head">
                        <li>Product Name</li>
                        <li>Quantity</li>
                        <li>Subtotal</li>
                        <li>Total</li>
                        <li>Clear Cart</li>
                    </ul>`
        productsInCart.forEach((item) => {
            const productInfoDetail = getByIdSP(item.id)
            const { id, name, price, quantity, thumbnail } = productInfoDetail
            html += `<ul class="cart__content-body">
                        <li>
                            <div class="cart__content-body-imgProduct">
                                <img src=${thumbnail} alt="">
                            </div>
                            <div class="cart__content-body-infoProduct">
                                <p class="infoProduct__name">${name}</p>
                                <p class="infoProduct__quantity">Quantity: ${quantity}</p>
                            </div>
                        </li>
                        <li>
                            <div class="cart__content-body-quantityProduct">
                                <div class="quantityProduct__minus" onclick="handleReduceQuantity(${id})">-</div>
                                <p>${item.quantity}</p>
                                <div class="quantityProduct__plus" onclick="handleIncreaseQuantity(${id})">+</div>
                            </div>
                        </li>
                        <li>
                            <p class="cart__content-body-subtotal">
                                $${price}
                            </p>
                        </li>
                        <li>
                            <p class="cart__content-body-total">
                                $${item.quantity * price}
                            </p>
                        </li>
                        <li>
                            <div class="cart__content-body-clearIcon" onclick="handledeleteProductFromCart(${id})">
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                        </li>
                    </ul>`
        })
        html += `<div class="cart__content-total">
                    <p class="cart__content-total-quantity">Total Quantity: <span>${totalQuantity}</span></p>
                    <p class="cart__content-total-price">Total Price: <span>$${totalPrice}</span></p>
                    <button class="cart__content-btnBuy" onclick="handleToggleModalPayment()">Mua</button>
                </div>`
    } else {
        html = `<div class="cart__content-empty">
                        <img src="../images/cart_empty.png" alt="CART_EMPTY">
                    </div>`
    }

    cartContent.innerHTML = html
}
handleUpdateQuanlityProductInCart()
renderUI()