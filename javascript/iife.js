
(() => {

    const setLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    }

    const getLocalStorage = (key) => {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
    }


    const callApi = async (url, method, data) => {

        const optionsFetch = () => {
            return data && method ? {
                headers: {
                    "Content-Type": "application/json"
                },
                method: `${method}`,
                body: JSON.stringify(data)
            } : {}
        }
        try {
            const response = await fetch(url, optionsFetch())
            const data = await response.json()
            return data
        } catch (error) {
            throw error
        }
    }

    const calculateSum = (data, prop) => {
        if (Array.isArray(data)) {
            return data.reduce((total, current) => {
                if (typeof current === 'number') {
                    return total + current;
                } else if (typeof current === 'object' && prop && current[prop]) {
                    const value = parseFloat(current[prop])
                    if (!isNaN(value)) {
                        return total + value
                    }
                }
                return total
            }, 0)
        }
        return 0
    }


    window.extensionIIFE = {
        setLocalStorage,
        getLocalStorage,
        callApi,
        calculateSum
    }
})()
