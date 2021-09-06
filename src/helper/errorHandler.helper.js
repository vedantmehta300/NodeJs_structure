 function generateBadRequest(description) {
    return {
        statusCode:400,
        description,
        status:"BAD_REQUEST"
    }
}
 function generateUnhandledRequest(description) {
    return {
        statusCode:500,
        description,
        status:"UNHANDLED_ERROR"
    }
}
module.exports = {
    generateBadRequest,
    generateUnhandledRequest
}
