/**
 * Error Messages Templates
 */
export const ERROR_MESSAGES = {
    // Generic errors
    UNKNOWN_ERROR: 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ສາເຫດ',
    NETWORK_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ເຄືອຂ່າຍ',
    SERVER_ERROR: 'ເກີດຂໍ້ຜິດພາດທີ່ເຊີບເວີ',
    TIMEOUT_ERROR: 'ການເຊື່ອມຕໍ່ໝົດເວລາ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ',
    
    // Authentication & Authorization
    AUTH_REQUIRED: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນໃຊ້ງານ',
    AUTH_EXPIRED: 'ການເຂົ້າສູ່ລະບົບໝົດອາຍຸ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່',
    AUTH_INVALID: 'ຂໍ້ມູນການເຂົ້າສູ່ລະບົບບໍ່ຖືກຕ້ອງ',
    PERMISSION_DENIED: 'ທ່ານບໍ່ມີສິດໃນການໃຊ້ງານຟັງຊັ້ນນີ້',
    UNAUTHORIZED: 'ບໍ່ໄດ້ຮັບອະນຸຍາດ',
    FORBIDDEN: 'ຫ້າມເຂົ້າເຖິງ',
    USER_NOT_FOUND: 'ບໍ່ພົບຜູ້ໃຊ້',
    BAD_REQUEST: 'ຄຳຂໍບໍ່ຖືກຕ້ອງ',
    SERVICE_UNAVAILABLE: 'ບໍລິການບໍ່ພ້ອມໃຊ້ງານ',
    
    // Validation errors
    VALIDATION_ERROR: 'ຂໍ້ມູນທີ່ປ້ອນບໍ່ຖືກຕ້ອງ',
    REQUIRED_FIELD: 'ກະລຸນາໃສ່ຂໍ້ມູນໃຫ້ຄົບຖ້ວນ',
    INVALID_FORMAT: 'ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
    OFFICE_REQUIRED: 'ກະລຸນາເລືອກສາຂາ',
    
    // Configuration errors
    CONFIG_ERROR: 'ການກຳນົດຄ່າລະບົບບໍ່ຖືກຕ້ອງ ກະລຸນາຕິດຕໍ່ຜູ້ດູແລລະບົບ',
    API_CONFIG_ERROR: 'ການກຳນົດຄ່າ API ບໍ່ຖືກຕ້ອງ ກະລຸນາຕິດຕໍ່ຜູ້ດູແລລະບົບ',
    
    // Products specific
    PRODUCTS_FETCH_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າ',
    PRODUCT_NOT_FOUND: 'ບໍ່ພົບສິນຄ້າທີ່ຕ້ອງການ',
    PRODUCT_CREATE_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງສິນຄ້າໃໝ່',
    PRODUCT_UPDATE_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສິນຄ້າ',
    PRODUCT_DELETE_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການລຶບສິນຄ້າ',
    
    // Customers specific
    CUSTOMERS_FETCH_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລູກຄ້າ',
    CUSTOMER_NOT_FOUND: 'ບໍ່ພົບລູກຄ້າທີ່ຕ້ອງການ',
    CUSTOMER_SEARCH_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາລູກຄ້າ',
    
    // Credit specific
    CREDIT_FETCH_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນເຄຣດິດ',
    
    // DocGroup specific
    DOCGROUP_FETCH_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນກຸ່ມເອກະສານ',
    
    // Exchange Rate specific
    EXCHANGE_RATE_FETCH_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນອັດຕາແລກປ່ຽນ',
    
    // Quotation specific
    QUOTATION_FETCH_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນໃບສະເໜີລາຄາ',
    QUOTATION_CREATE_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງໃບສະເໜີລາຄາ',
    QUOTATION_UPDATE_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດໃບສະເໜີລາຄາ',
    QUOTATION_DELETE_ERROR: 'ເກີດຂໍ້ຜິດພາດໃນການລຶບໃບສະເໜີລາຄາ',
    QUOTATION_NOT_FOUND: 'ບໍ່ພົບໃບສະເໜີລາຄາທີ່ຕ້ອງການ',
    
    // Request cancellation
    REQUEST_CANCELLED: 'ຄຳຂໍຖືກຍົກເລີກ',
    REQUEST_ABORTED: 'ຄຳຂໍຖືກຢຸດການເຮັດວຽກ'
}