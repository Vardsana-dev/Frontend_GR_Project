import { ERROR_MESSAGES } from "./errorMessages"
import { HTTP_ERROR_KEYS } from "./httpErrors"
import { HTTP_STATUS_MESSAGES } from "../http/httpStatusMessages"

export const translateError = (message = "") => {
    message = message.trim()

    // Network issues
    const networkErrors = ["Failed to fetch", "NetworkError", "timeout", "ENOTFOUND", "ECONNREFUSED"]
    if (networkErrors.some(err => message.includes(err))) {
        return ERROR_MESSAGES.SERVER_ERROR
    }

    // Message is a number: HTTP status
    if (!isNaN(message)) {
        const key = HTTP_ERROR_KEYS[Number(message)]
        if (key && ERROR_MESSAGES[key]) {
            return ERROR_MESSAGES[key]
        }
        if (HTTP_STATUS_MESSAGES[Number(message)]) {
            return HTTP_STATUS_MESSAGES[Number(message)]
        }
    }

    // If it's a custom key
    if (ERROR_MESSAGES[message]) {
        return ERROR_MESSAGES[message]
    }

    return ERROR_MESSAGES.UNKNOWN_ERROR
}
