// phuong thuc get element 
const $ = (selector) => {
    return document.querySelector(selector)
}

// phuong thuc get element all
const $$ = (selector) => {
    return document.querySelectorAll(selector)
}

// phuong thuc tinh tong cho array
Array.prototype.calculateSumAndStoreInMap = function (key1, key2) {
    const sum = this.reduce((total, current) =>
        key2 === 0 ? total + current[key1] : total + current[key1] * current[key2], 0);

    const map = new Map();
    map.set('sum', sum);
    return map;
};

// ham xu ly update so luong san pham trong gio hang
const handleUpdateQuanlityProductInCart = () => {
    const productsInCart = extensionIIFE.getLocalStorage(keyLocalStorageItemCard)
    const quantityProductInCart = productsInCart?.length || 0

    const spanElement = document.createElement('span')
    spanElement.innerHTML = `${quantityProductInCart}`
    $('.header__cart a').appendChild(spanElement)
}

// lay tinh/thanh pho
const handleGetProvinces = async () => {
    const provinces = await fetchApi('https://provinces.open-api.vn/api/p')
    if (Array.isArray(provinces) && provinces.length > 0) {
        return provinces
    } else {
        alert('Đã có lỗi xảy ra. Vui lòng thử lại sau!')
    }
}

// lay quan/huyen
const handleGetDistricts = async () => {
    const districts = await fetchApi('https://provinces.open-api.vn/api/d')
    if (Array.isArray(districts) && districts.length > 0) {
        if (Array.isArray(districts) && districts.length > 0) {
            return districts
        } else {
            alert('Đã có lỗi xảy ra. Vui lòng thử lại sau!')
        }
    }
}

// lay xa/phuong 
const handleGetWards = async () => {
    const wards = await fetchApi('https://provinces.open-api.vn/api/w')
    if (Array.isArray(wards) && wards.length > 0) {
        if (Array.isArray(wards) && wards.length > 0) {
            return wards
        } else {
            alert('Đã có lỗi xảy ra. Vui lòng thử lại sau!')
        }
    }
}

// lay quan/huyen theo id cua tinh/thanh pho
const getDistrictsByProvinceID = async (provinceId) => {
    let districts = await handleGetDistricts()
    if (districts) {
        districts = districts.filter(district => district.province_code === provinceId)
    }
    return districts
}


// lay xa/phuong theo id cua quan/huyen
const getWardsByDistrictID = async (districtId) => {
    let wards = await handleGetWards()
    if (wards) {
        wards = wards.filter(ward => ward.district_code === districtId)
    }
    return wards
}

// phuong thuc lay data bills
const getBills = async () => {
    let bills = []
    try {
        bills = await fetchApi('http://localhost:3000/bills')
    } catch (error) {
        alert('Đã có lỗi xảy ra ở phía Server!')
    }
    return bills
}

const getBillByCode = async (code) => {
    let bill
    try {
        bill = await fetchApi(`http://localhost:3000/bills/${code}`)
    } catch (error) {
        alert('Đã có lỗi xảy ra ở phía Server!')
    }
    return bill
}

const addNewBill = async (bill) => {
    let isSuccess = true
    try {
        await fetchApi('http://localhost:3000/bills', 'POST', bill)
    } catch (error) {
        isSuccess = false
    }
    return isSuccess
}

const removeBill = async (billCode) => {
    try {
        await fetchApi(`http://localhost:3000/bills/${billCode}`, 'DELETE', {})
    } catch (error) {

        throw error
    }
}


// ham tao id ngau nhien
const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let isCodeUsed

    const handleCheckCodeUsed = async (code) => {
        const bills = await getBills()
        const bill = bills?.find(item => item.code === code)
        if (bill) { isCodeUsed = true } else { isCodeUsed = false }
    }

    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    handleCheckCodeUsed(code)

    if (!isCodeUsed) return code
    generateRandomCode()
}

// ham tra ve ngay hien tai theo format dd/mm/yyyy
const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear();

    return `${day}/${month}/${year}`;
}

// lay chi tiet thong tin san pham trong gio voi idsanpham
const getByIdSP = (idSp) => {
    const products = extensionIIFE.getLocalStorage(keyLocalStorageListSP)
    const productFromID = products.find(product => product.id === idSp)
    return productFromID
}

// xoa san pham trong gio hang bang id
const deleteProductFromCart = (productId) => {
    let productsInCart = extensionIIFE.getLocalStorage(keyLocalStorageItemCard)
    productsInCart = productsInCart.filter(item => item.id !== productId)
    localStorage.setItem(keyLocalStorageItemCard, JSON.stringify(productsInCart))
}

// phuong thuc xu ly toast
const toast = (props) => {

    const { type, title, message } = props

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr[`${type}`](`${message}`, `${title}`)
}

// ham chuyen huong trang
const redirectToPage = (page) => {
    const currentUrl = window.location.href;
    const parts = currentUrl.split('/');
    parts[parts.length - 1] = `${page}.html`
    let domain = parts[0] + '//' + parts[2]
    for (let i = 3; i < parts.length; i++) {
        domain += `/${parts[i]}`
    }
    window.location.href = domain
}

$('.header__logo').onclick = () => redirectToPage('index')