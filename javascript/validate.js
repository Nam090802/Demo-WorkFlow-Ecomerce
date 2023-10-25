const inputSurName = 'input[name="surname"]'
const inputName = 'input[name="name"]'
const inputEmail = 'input[name="email"]'
const inputPhoneNumber = 'input[name="phoneNumber"]'
const inputCity = 'select[name="city"]'
const inputDistrict = 'select[name="district"]'
const inputWard = 'select[name="ward"]'
const inputHouseNumber = 'input[name="houseNumber"]'
const inputMessage = 'textarea[name="message"]'


const handleClearInputData = () => {
    $(inputSurName).value = ''
    $(inputName).value = ''
    $(inputEmail).value = ''
    $(inputPhoneNumber).value = ''
    $(inputCity).value = ''
    $(inputDistrict).value = ''
    $(inputWard).value = ''
    $(inputHouseNumber).value = ''
    $(inputMessage).value = ''
    Array.from($$('.cart__modal-form-error')).forEach(ele => {
        ele.style.visibility = 'hidden'
        ele.html = ''
    })
}


const Validator = (options) => {
    const { form, rules, onSubmit } = options

    const currentForm = $(form)

    currentForm.onsubmit = function (e) {
        e.preventDefault()

        let isSuccesValid = true
        rules.forEach(rule => {
            const { selector, test } = rule
            const inputElement = $(selector)
            if (inputElement) {
                const errElement = inputElement.parentElement.querySelector('.cart__modal-form-error')
                let messError = test(inputElement.value)
                if (messError) {
                    isSuccesValid = false
                    errElement.style.visibility = 'visible'
                    errElement.innerHTML = messError
                } else {
                    errElement.style.visibility = 'hidden'
                    errElement.innerHTML = ''
                }
            }
        })
        if (isSuccesValid) {
            const enableInputs = currentForm.querySelectorAll('[name]')
            const formValues = Array.from(enableInputs).reduce((values, input) => {
                return (values[input.name] = input.value.trim()) && values
            }, {})
            onSubmit(formValues)
        }
    }
    if (currentForm) {
        const inputRules = {}

        rules.forEach(rule => {
            const { selector, test } = rule

            if (!Array.isArray(inputRules[selector])) {
                inputRules[selector] = [test]
            } else {
                inputRules[selector].push(test)
            }

            const inputElement = $(selector)
            if (inputElement) {
                inputElement.onblur = () => {
                    const errElement = inputElement.parentElement.querySelector('.cart__modal-form-error')
                    let messError

                    const selectorRules = inputRules[selector]

                    for (const rule of selectorRules) {
                        messError = rule(inputElement.value.trim())
                        if (messError) break
                    }

                    if (messError) {
                        errElement.style.visibility = 'visible'
                        errElement.innerHTML = messError
                    } else {
                        errElement.style.visibility = 'hidden'
                        errElement.innerHTML = ''
                    }
                }
                inputElement.oninput = () => {
                    const errElement = inputElement.parentElement.querySelector('.cart__modal-form-error')
                    errElement.innerHTML = ''
                }
            }
        })
    }
}

Validator.isRequired = (selector) => {
    return {
        selector,
        test: (inputValue) => {
            return inputValue.trim() ? undefined : "Vui lòng nhập trường này."
        }
    }
}

Validator.isEmail = (selector) => {
    return {
        selector,
        test: (inputValue) => {
            const eReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
            return eReg.test(inputValue.trim()) ? undefined : 'Nhập vào không phải email.  (vd: yourname@yourcompany.com)'
        }
    }
}

Validator.isPhoneNumber = (selector) => {
    return {
        selector,
        test: (inputValue) => {
            const phoneNumberReg = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
            return phoneNumberReg.test(inputValue.trim()) ? undefined : 'Nhập vào không phải số điện thoại.  (vd: 0344XXX678)'
        }
    }
}
Validator.isOnlyChar = (selector) => {
    return {
        selector,
        test: (inputValue) => {
            const onlyCharReg = /^[a-zA-Zà-ỹẠ-ỹ ]*$/g
            return onlyCharReg.test(inputValue.trim()) ? undefined : 'Không nhập số và kí tự đặc biệt. (vd: Nguyên,..)'
        }
    }
}

Validator({
    form: '.cart__modal-content-form',
    rules: [
        Validator.isOnlyChar(inputSurName),
        Validator.isOnlyChar(inputName),
        Validator.isRequired(inputSurName),
        Validator.isRequired(inputName),
        Validator.isRequired(inputEmail),
        Validator.isRequired(inputPhoneNumber),
        Validator.isRequired(inputCity),
        Validator.isRequired(inputDistrict),
        Validator.isRequired(inputWard),
        Validator.isRequired(inputHouseNumber),
        Validator.isRequired(inputMessage),
        Validator.isEmail(inputEmail),
        Validator.isPhoneNumber(inputPhoneNumber)
    ],
    onSubmit: async (values) => {
        const { surname, name, email, phoneNumber, city, district, ward, houseNumber, message } = values
        const code = generateRandomCode(5)
        const date = getCurrentDate()
        const nameCity = await fetchApi(`https://provinces.open-api.vn/api/p/${city}`)
        const nameDistrict = await fetchApi(`https://provinces.open-api.vn/api/d/${district}`)
        const nameWard = await fetchApi(`https://provinces.open-api.vn/api/w/${ward}`)
        const cart = extensionIIFE.getLocalStorage(keyLocalStorageItemCard)
        const products = extensionIIFE.getLocalStorage(keyLocalStorageListSP)
        const totalItem = cart.length
        const totalQuanlity = cart.calculateSumAndStoreInMap('quantity', 0).get('sum')
        const totalPrice = cart.map(productInCart => {
            let product
            products.forEach(item => {
                if (productInCart.id === item.id) {
                    product = { ...productInCart, price: item.price }
                }
            })
            return product

        }).calculateSumAndStoreInMap('quantity', 'price').get('sum')

        // update so luong san pham sau khi xac nhan don hang
        const productsUpdate = products.map((item) => {
            let product = item
            cart.forEach(itemCart => {
                if (product.id === itemCart.id) {
                    product.quantity -= itemCart.quantity
                }
            })
            return product
        })

        const customerInfo = {
            code,
            date,
            surname,
            name,
            email,
            phoneNumber,
            nameCity: nameCity.name,
            nameDistrict: nameDistrict.name,
            nameWard: nameWard.name,
            houseNumber,
            message,
            products: cart,
            totalItem,
            totalQuanlity,
            totalPrice
        }
        const addState = await addNewBill(customerInfo)
        if (addState) {
            extensionIIFE.setLocalStorage(keyLocalStorageListSP, productsUpdate)
            extensionIIFE.setLocalStorage(keyLocalStorageItemCard, [])
            alert('Thêm đơn hàng thành công!')
        } else {
            toast({
                type: 'error',
                title: 'Thông báo!',
                message: 'Thêm đơn hàng thất bại!'
            })
        }
    }
})