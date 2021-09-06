async function createSuccessfullyResponse(message, data,status) {
    return {
        status,
        message,
        statusCode: 200,
        data: data ? data : "NO_DATA"
    }
}

module.exports = {
    createSuccessfullyResponse
}
