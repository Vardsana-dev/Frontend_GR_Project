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

/**
 * ແປຂໍ້ຄວາມ Error ຈາກ Backend ໃຫ້ເປັນພາສາລາວ
 */
export const translateApiError = (msg: string): string => {
    if (!msg || typeof msg !== 'string') return ERROR_MESSAGES.UNKNOWN_ERROR;

    // Pattern: "Purchase order has an open GR draft (GR...). Receive it before creating a new GR"
    const draftMatch = msg.match(/Purchase order has an open GR draft\s*\(([^)]+)\)\.?\s*Receive it before creating a new GR/i);
    if (draftMatch) {
        const grCode = draftMatch[1];
        return `ໃບສັ່ງຊື້ (PO) ນີ້ມີໃບຮັບສິນຄ້າສະຖານະຮ່າງ (${grCode}) ທີ່ຍັງຄ້າງຢູ່. ກະລຸນາຮັບສິນຄ້າໃຫ້ສຳເລັດກ່ອນສ້າງໃບຮັບໃໝ່.`;
    }

    if (/Purchase order has an open GR draft/i.test(msg)) {
        return 'ໃບສັ່ງຊື້ (PO) ນີ້ມີໃບຮັບສິນຄ້າສະຖານະຮ່າງທີ່ຍັງຄ້າງຢູ່. ກະລຸນາຮັບສິນຄ້າໃຫ້ສຳເລັດກ່ອນສ້າງໃບຮັບໃໝ່.';
    }

    if (/all items.*already received/i.test(msg) || /already fully received/i.test(msg)) {
        return 'ສິນຄ້າທັງໝົດໃນໃບສັ່ງຊື້ (PO) ນີ້ຖືກຮັບເຂົ້າຄົບຖ້ວນແລ້ວ.';
    }

    if (/Purchase order.*not found/i.test(msg)) {
        return 'ບໍ່ພົບຂໍ້ມູນໃບສັ່ງຊື້ (PO) ນີ້ໃນລະບົບ.';
    }

    if (/already exists/i.test(msg) || /conflict/i.test(msg)) {
        return 'ຂໍ້ມູນຊ້ຳຊ້ອນ ຫຼື ໃບຮັບສິນຄ້ານີ້ມີຢູ່ໃນລະບົບແລ້ວ.';
    }

    if (/timeout/i.test(msg) || /aborted/i.test(msg)) {
        return ERROR_MESSAGES.TIMEOUT_ERROR;
    }

    if ((ERROR_MESSAGES as Record<string, string>)[msg]) {
        return (ERROR_MESSAGES as Record<string, string>)[msg];
    }

    return msg;
};
