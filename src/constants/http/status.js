export const HTTP_STATUS = {
    // Success codes - ລະຫັດຄວາມສຳເລັດ
    OK: 200,                    // ສຳເລັດ
    CREATED: 201,               // ສ້າງສຳເລັດ
    ACCEPTED: 202,              // ຍອມຮັບ
    NO_CONTENT: 204,            // ບໍ່ມີເນື້ອຫາ
    
    // Client error codes - ລະຫັດຂໍ້ຜິດພາດຈາກຜູ້ໃຊ້
    BAD_REQUEST: 400,           // ຄຳຂໍບໍ່ຖືກຕ້ອງ
    UNAUTHORIZED: 401,          // ບໍ່ໄດ້ຮັບອະນຸຍາດ
    FORBIDDEN: 403,             // ຫ້າມເຂົ້າເຖິງ
    NOT_FOUND: 404,             // ບໍ່ພົບຂໍ້ມູນ
    METHOD_NOT_ALLOWED: 405,    // ບໍ່ອະນຸຍາດໃຫ້ໃຊ້ວິທີນີ້
    CONFLICT: 409,              // ຂໍ້ມູນຂັດແຍ້ງ
    UNPROCESSABLE_ENTITY: 422,  // ບໍ່ສາມາດປະມວນຜົນໄດ້
    TOO_MANY_REQUESTS: 429,     // ມີຄຳຂໍຫຼາຍເກີນໄປ
    
    // Server error codes - ລະຫັດຂໍ້ຜິດພາດຈາກເຊີບເວີ
    INTERNAL_SERVER_ERROR: 500, // ຂໍ້ຜິດພາດພາຍໃນເຊີບເວີ
    NOT_IMPLEMENTED: 501,       // ຍັງບໍ່ໄດ້ພັດທະນາ
    BAD_GATEWAY: 502,           // Gateway ບໍ່ດີ
    SERVICE_UNAVAILABLE: 503,   // ບໍລິການບໍ່ພ້ອມໃຊ້ງານ
    GATEWAY_TIMEOUT: 504        // Gateway ໝົດເວລາ
}
