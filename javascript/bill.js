
const handleRemoveBill = async (code) => {

    // update so luong san pham sau khi xac nhan tra don hang
    const handleUpdateListSP = (products, productsInBill) => {
        const productsUpdate = products.map((item) => {
            let product = item
            productsInBill.forEach(productInBill => {
                if (product.id === productInBill.id) {
                    product.quantity += productInBill.quantity
                }
            })
            return product
        })
        return productsUpdate
    }


    const isRemove = confirm('Bạn muốn trả đơn hàng này!')
    if (isRemove) {
        const products = extensionIIFE.getLocalStorage(keyLocalStorageListSP)
        const billRemove = await getBillByCode(code)
        const productsInBill = billRemove.products || []
        if (productsInBill) {
            const dataListSP = handleUpdateListSP(products, productsInBill)
            extensionIIFE.setLocalStorage(keyLocalStorageListSP, dataListSP)
            await removeBill(code)
        }
    }
    renderUI()
}

const renderUI = async () => {

    const bills = await getBills()

    let html = `<ul class="bill__content-head">
                        <li>Code</li>
                        <li>Customer Name</li>
                        <li>Date</li>
                        <li>Item Numbers</li>
                        <li>Total Quanlity</li>
                        <li>Total Price</li>
                        <li>Return</li>
                    </ul>`

    if (bills && bills.length > 0) {
        bills.forEach(bill => {
            const { code, date, surname, name, email, phoneNumber, nameCity, nameDistrict, nameWard, houseNumber,
                message, products, totalItem, totalQuanlity, totalPrice } = bill
            html += `<ul class="bill__content-body">
                        <li>
                           <p class="bill__content-body-item">
                                ${code}
                            </p>
                            <div class="bill__content-body-detail" href="">
                                <div class="info-icon"><i class="fa-solid fa-circle-info"></i></div>
                                <div class="detail-info">
    <div class="detail-info__customer">
        <div class="detail-info-customer__head">
            Thông tin khách hàng
        </div>
        <ul class="detail-info__info-customer-list">
            <li class="detail-info__info-customer-item"><strong>Họ và tên:</strong><strong>${surname} ${name}</strong></li>
            <li class="detail-info__info-customer-item"><strong>SDT:</strong>&nbsp;&nbsp;${phoneNumber}</li>
            <li class="detail-info__info-customer-item"><strong>Địa chỉ:</strong>&nbsp;&nbsp;${houseNumber}, ${nameWard}, ${nameDistrict}, ${nameCity}</li>
            <li class="detail-info__info-customer-item"><strong>Ghi chú:</strong>&nbsp;  ${message || 'không'}</li>
        </ul>
    </div>
    <div class="detail-info__product">
        <div class="detail-info-product__head">
            Thông tin sản phẩm
        </div>
        <ul class="detail-info__info-product-list">
            ${products.map(item => {
                const product = getByIdSP(item.id)
                const { name } = product
                return `
                        <li class="detail-info__info-product-item">
                            <div class="detail-info__info-product-item-img">
                                <img src="${product.thumbnail}" />
                            </div>
                            <p><span><strong>${name}</strong></span><span><strong>SL: ${item.quantity}</strong></span></p>
                        </li>`
            }).join(" ")}
        </ul>
    </div>
</div>
                            </div>
                        </li>
                        <li>
                            <p class="bill__content-body-item">
                                ${surname} ${name} 
                            </p>
                        </li>
                        <li>
                            <p class="bill__content-body-subitem">
                                ${date}
                            </p>
                        </li>
                        <li>
                            <p class="bill__content-body-item">
                                ${totalItem}
                            </p>
                        </li>
                         <li>
                            <p class="bill__content-body-item">
                                ${totalQuanlity}
                            </p>
                        </li>
                         <li>
                            <p class="bill__content-body-item">
                                $${totalPrice}
                            </p>
                        </li>
                         <li>
                            <div class="bill__content-body-clearIcon" onclick="handleRemoveBill('${code}')">
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                        </li>
                    </ul>`
        })
    } else {
        html = '<h1>Chưa có đơn hàng nào!</h1>'
    }
    $('.bill__content').innerHTML = html
}
handleUpdateQuanlityProductInCart()
renderUI()