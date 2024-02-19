const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const base64 = require('base-64');
const fetch = require('node-fetch')


const username = process.env.OTM_API_USERNAME
const password = process.env.OTM_API_PASSWORD

const serviceUpdateInOTM = async (req, res) => {

    // const { domainName, documentNo } = await pick(req.query, ["domainName", "documentNo"]);

    const otmAPIAccessToken = base64.encode(username + ":" + password);

    const location = '/TW/TIL/MUM'
    const shipperName = "GIANTLOK INDIA PVT. LTD"
    const shipperAddress = "#43,2ND FLOOR.COMMUNITY CENTRE,NARAINA INDUSTRIAL AREA.PHASE 1 NEW DELHl-110028,INDIA TEL.NO.91-011-4700 1540 ,FAX.NO.91-011-4700 1525 IEC NUMBER: 0508072964, PAN NO: AADCG1924F, GSTIN: 07AADCG1924F12Y, E-MAIL ID: AMANASHRAF@GIANTLOK.COM"

    let newShipperName = shipperName.split("").slice(0, 17).join("")

    let initialLocationId = newShipperName.replace(/[^a-zA-Z0-9]/g, "_") // replace all special char [!@#$%^&*\n><?-~] as well as space 

    // const encoded = encodeURIComponent(initialLocationId)
    const search = location + "." + initialLocationId

    // for orderBase get
    let currentIdx = 0

    //  for lacation id 
    let locationID = ''


    let LocUrl = `${process.env.OTM_BASE_URL}/logisticsRestApi/resources-int/v2/locations`;


    try {
        locationID = await getOrederBaseAPi(initialLocationId)

        const LocOptions = {
            'method': 'POST',
            'headers': {
                'Authorization': `Basic ${otmAPIAccessToken}`,
                'Cookie': 'JSESSIONID=NvscskPTs6tT3evZIcZo_rpqgL_7rlsPTcoq4jHH8avhNgIDRc9g!1075579596; X-Oracle-BMC-LBS-Route=fb71084c731eca116b8bb4630360dd17721f6bac27da03a11a2ff120e313e9b656c62fd8a7c42ae8414b9d2c633377e66f0f18fd94acae556a54cac1',
                'Content-Type': "application/vnd.oracle.resource+json;type=singular"
            },
            "body": JSON.stringify({
                "locationXid": locationID,
                "locationName": shipperName,
                "countryCode3Gid": "IN",
                "domainName": "TW",
                "isActive": true,
                "roleProfiles": {
                    "items": [
                        {
                            "locationRoleGid": "SHIPFROM/SHIPTO",
                            "domainName": "TW"
                        }
                    ]
                },
                "addresses": {
                    "items": [
                        {
                            "lineSequence": 1,
                            "addressLine": shipperAddress,
                            "domainName": "TW"
                        }
                    ]
                }

            })
        };

        const res = await fetch(LocUrl, LocOptions);
        if (res.status = 201) {
            const data = await res.json();
            locationID = data.locationXid

            let involvePartyUrl = `${process.env.OTM_BASE_URL}:443/logisticsRestApi/resources-int/v2/orderBases${location}.${locationID}/involvedParties`

            const invPartyOptions = {
                'method': 'POST',
                'headers': {
                    'Authorization': `Basic ${otmAPIAccessToken}`,
                    'Cookie': 'JSESSIONID=NvscskPTs6tT3evZIcZo_rpqgL_7rlsPTcoq4jHH8avhNgIDRc9g!1075579596; X-Oracle-BMC-LBS-Route=fb71084c731eca116b8bb4630360dd17721f6bac27da03a11a2ff120e313e9b656c62fd8a7c42ae8414b9d2c633377e66f0f18fd94acae556a54cac1',
                    'Content-Type': "application/vnd.oracle.resource+json;type=singular"
                },
                "body": JSON.stringify({
                    "involvedPartyQualGid": "CONSIGNEE",
                    "involvedPartyContactGid": `TW.${locationID}`,
                    "comMethodGid": "EMAIL",
                    "domainName": "TW"

                })
            };

            const response = await fetch(involvePartyUrl, invPartyOptions)
            if (response) {
                const data = await response.json();
                console.log('involve Party Added', data);
            }
            else {
                console.log('involve party error', response);
            }
        } else {
            console.log('new location added error', res);
        }



        // if (data && data.count) {
        //     sendResponse(res, httpStatus.OK, { docPresent: true, count: data.count }, null);
        // } else {
        //     sendResponse(res, httpStatus.OK, { docPresent: false, count: data.count }, null);
        // }
    } catch (error) {
        console.error("error :::", error);
        sendResponse(res, httpStatus.BAD_REQUEST, null, "Failed to check the document status");
    }


    async function getOrederBaseAPi(initialLocationId) {

        let currentXid = initialLocationId + "_" + (parseInt(currentIdx, 10) + 1).toString().padStart(2, 0)

        const otmAPIAccessToken = base64.encode(username + ":" + password);
        let url = `${process.env.OTM_BASE_URL}/logisticsRestApi/resources-int/v2/orderBases${location}.${currentXid}/involvedParties?q=involvedPartyQualGid in["SHIPPER"]&expand=involvedPartyContact&expandRefFull=true`;

        const options = {
            'method': 'GET',
            'headers': {
                'Authorization': `Basic ${otmAPIAccessToken}`,
                'Cookie': 'JSESSIONID=NvscskPTs6tT3evZIcZo_rpqgL_7rlsPTcoq4jHH8avhNgIDRc9g!1075579596; X-Oracle-BMC-LBS-Route=fb71084c731eca116b8bb4630360dd17721f6bac27da03a11a2ff120e313e9b656c62fd8a7c42ae8414b9d2c633377e66f0f18fd94acae556a54cac1'
            }
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (data?.count) {
                currentIdx++
                getOrederBaseAPi(initialLocationId)
            } else {
                return currentXid
            }
        } catch (error) {
            console.log('Error fetch orderBase ', error);
            return null
        }

    }

};




// controller
const updateInOTM = catchAsync(async (req, res) => {
    // console.log('req.body', Object.keys(req.body));

    let body = {
        "Shipper Name": {
            "value": "TLSS INC"
        },
        "Shipper Address": {
            "value": "200 MIDDLESEX ESSEX TURNPIKE, SUIT E ISELIN NJ 08830 US"
        }
    }
    const obj = pick(body, ["ShipperName", "valueString"])



    // const { xId } = pick(req.params, ["xid"])
    // const { valueString, key } = pick(body, Object.keys(req.body))



    // console.log(" obj ", obj);
    // console.log(" req body", req.body);


    serviceUpdateInOTM({ ...obj })

    // get data check fields in exits OTM  
    // then we will get xid
    //if get xid
    // then call those api , which field updated


    // const updated = await service.updateField({ jobId, key, valueString });
    // sendResponse(res, httpStatus.OK, updated, null);
});






module.exports = updateInOTM;