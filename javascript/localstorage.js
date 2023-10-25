
// ham xu ly luu listSP vao localstorage 
const handleSaveListSPToLocalstorage = function (key, arg) {
    let isSaveSuccess = false
    if (Array.isArray(arg) && key) {
        const data = JSON.stringify(arg)
        localStorage.setItem(key, data)
        isSaveSuccess = true
    }
    return isSaveSuccess
}

// ham xu ly lay du lieu trong localstorage
const handleGetDataFromLocalstorage = function (key) {
    let resultData = []
    if (key) {
        const arrData = JSON.parse(localStorage.getItem(key))
        if (Array.isArray(arrData)) resultData = arrData
    }
    return resultData
}
