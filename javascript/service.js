const fetchApi = async (url, method, body) => {

    const optionsFetch = () => {
        return body && method ? {
            headers: {
                "Content-Type": "application/json"
            },
            method: `${method}`,
            body: JSON.stringify(body)
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


