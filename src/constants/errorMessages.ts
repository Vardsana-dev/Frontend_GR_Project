export const ERROR_MESSAGES = {
    // Generic errors
    UNKNOWN_ERROR: 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ສາເຫດ',
    NETWORK_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ເຄືອຂ່າຍ',
    SERVER_ERROR: 'ເກີດຂໍ້ຜິດພາດທີ່ເຊີບເວີ',
    TIMEOUT_ERROR: 'ການເຊື່ອມຕໍ່ໝົດເວລາ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ',

    // Authentication & Authorization
    AUTH_REQUIRED: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນໃຊ້ງານ',
    AUTH_EXPIRED: 'ການເຂົ້າສູ່ລະບົບໝົດອາຍຸ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່',
    AUTH_INVALID: 'ໄອດີພະນັກງານ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
    UNAUTHORIZED: 'ບໍ່ໄດ້ຮັບອະນຸຍາດ',
    FORBIDDEN: 'ຫ້າມເຂົ້າເຖິງ',
    USER_NOT_FOUND: 'ບໍ່ພົບຜູ້ໃຊ້',
    BAD_REQUEST: 'ຄຳຂໍບໍ່ຖືກຕ້ອງ',
    SERVICE_UNAVAILABLE: 'ບໍລິການບໍ່ພ້ອມໃຊ້ງານ',
    USER_NOT_AUTHENTICATED: 'ຜູ້ໃຊ້ບໍ່ໄດ້ຮັບການຢືນຢັນຕົວຕົນ',

    // Validation errors
    REQUIRED_FIELD: 'ກະລຸນາໃສ່ຂໍ້ມູນໃຫ້ຄົບຖ້ວນ',
    INVALID_FORMAT: 'ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ',

    // Configuration errors
    CONFIG_ERROR: 'ການກຳນົດຄ່າລະບົບບໍ່ຖືກຕ້ອງ ກະລຸນາຕິດຕໍ່ຜູ້ດູແລລະບົບ',

    // Data operations
    FETCH_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ',
    CREATE_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງຂໍ້ມູນ',
    UPDATE_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດຂໍ້ມູນ',
    DELETE_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການລຶບຂໍ້ມູນ',
    NOT_FOUND: 'ບໍ່ພົບຂໍ້ມູນທີ່ຕ້ອງການ',
}
