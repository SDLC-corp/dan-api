const {
    sendEmailForProfessionalAccount,
} = require("../../../utils/emailServices");

const proffesionalAccountReq = async (body) => {
    try {
        if (body) {
            const result = await sendEmailForProfessionalAccount(body);
            if(result.status){
                return { data: "Email Sent!", status: true, code: 200 };
            }else{
                return { data: "Error While Sending Email!", status: false, code: 400 };
            }
        } else {
            return { data: "Something Went Wrong!", status: false, code: 404 };
        }
    } catch (error) {
        return { data: "Something Went Wrong!", status: false, code: 404 };
    }
};
module.exports = proffesionalAccountReq;
