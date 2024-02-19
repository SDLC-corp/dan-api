const fetch = require("node-fetch");
const base64 = require("base-64");
const { ORDER_RELEASES_ORDER_TYPE } = require("../modules/OTMJobProcess/services_push_Otm/const");

const username = process.env.OTM_API_USERNAME;
const password = process.env.OTM_API_PASSWORD;

const sanity_username = process.env.OTM_SANITY_API_USERNAME;
const sanity_password = process.env.OTM_SANITY_API_PASSWORD;



const OTM_BASE_URL = process.env.OTM_BASE_URL;
const OTM_API_BASE_URL = `${OTM_BASE_URL}/logisticsRestApi/resources-int/v2`;

/**
 *
 * @param {Object} {domainName, documentNo, bookingNo}
 * @returns orderType or null
 */
const checkDocumentAndOrderTypeInOTM = async ({
  domainName,
  documentNo = "",
  bookingNo,
  type
}) => {
  let orderType = null;
  let orderTypeGid = null;

  
  // let orderBaseURL = `/orderBases?q= orderBaseXid eq "${documentNo}" and domainName eq "${domainName}"`;

  let orderReleasesURL = `/orderReleases/${domainName}.${documentNo}-001?q=orderReleaseXid sw "${documentNo}-"`;
  if(type === "air") {
    orderReleasesURL = `/orderReleases/${domainName}.${documentNo}`;
  }
  
    try {
      const response = await apiGET(orderReleasesURL);
      console.log("checkDocumentAndOrderTypeInOTM response ::", response, orderReleasesURL);
      if (response && response.orderReleaseXid) {
        /* Show error if found in order released */
        return {
          orderType: "orderReleases",
          orderTypeGid: response.orderReleaseTypeGid,
          orderReleasesExisted: true
        }
      }
    } catch (error) {
      console.error(
        "Error : orderReleases check :: domainName, bookingNo",
        domainName,
        // bookingNo,
      );
    }



  try {
    let orderBaseURL = `/orderBases/${domainName}.${documentNo}`;
    const response = await apiGET(orderBaseURL);
    console.log("checkDocumentAndOrderTypeInOTM response ::", response, orderReleasesURL);
    if (response && response.orderBaseXid) {
      orderType = "orderBases";
      orderTypeGid = response.orderTypeGid
    }
  } catch (error) {
    console.error(
      "Error : orderBases check :: domainName, documentNo",
      domainName,
      documentNo,
      documentNo.split("_")[0]
    );
  }

  

  return {
    orderType,
    orderTypeGid,
    orderReleasesExisted: false
  };
};
async function  checkBookingCancelStatusAPI({orderType, documentNo, domainName})  {
    documentNo = documentNo.trim()
  
    let url = `/${orderType}/${domainName}.${documentNo}/statuses?q=statusTypeGid ew "BOOKING_CANCELLED_OB" or statusTypeGid ew "BOOKING_CANCELLED_OBB" &fields=statusValueGid`
    if(orderType === "orderReleases") {
      url = `/${orderType}/${domainName}.${documentNo}/statuses?q=statusTypeGid ew "BOOKING_CANCELLED_ORR" or statusTypeGid ew "BOOKING_CANCELLED_OR" &fields=statusValueGid`
    }

    try {
      let res = await apiGET(url)
      console.log("checkBookingCancelStatusAPI :: ", url, {orderType, documentNo, domainName}, res);
      if(res && res.count){

        return res.items[0].statusValueGid
  
      } else {

      }
    } catch (error) {
      
    }

    return ""
}
/**
 *
 * @param {*} locationXid
 * @param {*} domainName
 * @returns if found returns locationXid or null
 */
async function checkPossibleXIDInOtmAPI(locationXid, domainName = "TW") {
  let url = `/locations?q=locationXid sw  "${locationXid}"&domainName="${domainName}"`;

  try {
    const response = await apiGET(url);
    if (response && response.count) {
      console.log("checkPossibleXIDInOtmAPI response ::", response.count);
      return locationXid;
    }
  } catch (error) {
    console.error(
      "Error : checkPossibleXIDInOTM check :: locationXid, domainName",
      locationXid,
      domainName,
      error,
    );

    throw new Error("Error while checking locationXid in OTM")
  }

  return null;
}

/**
 * 
 * @param {String} gid EX: TW.TRANSWORLD_INTEGR_01
 */
async function getLocationAddressAPI(gid) {
  let url = `/locations/${gid}/addresses`
  try {
    const response = await apiGET(url);
    if (response && response.count) {
      return response.items[0];
    }
  } catch (error) {
    console.error(
      "Error : getLocationAddress :: gid",
      gid,
      error,
    );
  }

  return null
}

async function checkInInvolvedPartyAddressAPI({orderType, documentNo, bookingNo, domainName, otmQualifierKey }) {
  const orderTypeXid = getDocOrBookingNoByOrderTypeLogic({orderType, documentNo, bookingNo})



  let url = `/${orderType}/${domainName}.${orderTypeXid}/involvedParties?q=involvedPartyQualGid in["${otmQualifierKey}"]&expand=involvedPartyContact&expandRefFull=true`;
  console.log("checkInInvolvedPartyAddressAPI : url:", url);

  try {
    const response = await apiGET(url);
    if (response && response.count) {
      return response.items[0];
    }
  } catch (error) {
    console.error(
      "Error : checkInInvolvedPartyAddressAPI :: gid",
      orderType, documentNo, bookingNo, domainName, otmQualifierKey,
      error,
    );

    throw new Error(error.message)
  }

  return null
}

async function getAllQualifiersFromOtmAPI({documentNo, domainName, orderType}) {
  let url = `/${orderType}/${domainName}.${documentNo}/involvedParties`

  try {
    let res = await apiGET(url)
    if(res && res.count){
      return res.items

    }
  } catch (error) {
    return []
  }
}

async function deleteMappingAPI({orderType, domainName, bookingNo, documentNo, otmQualifierKey, gid}) {
  const orderTypeXid = getDocOrBookingNoByOrderTypeLogic({orderType, documentNo, bookingNo})

  let url = `/${orderType}/${domainName}/${orderTypeXid}/involvedParties/${otmQualifierKey}x${gid}xEMAIL`
  console.log("deleteMappingAPI : url:", url);

  try {
    let response = await apiDELETE(url)
    if(response){
      return true
    }
  } catch (error) {
    console.log("Error : deleteMappingAPI", orderType, domainName, bookingNo, documentNo, otmQualifierKey, gid);
    console.error(error);
    throw new Error("Error while Delete Mapping API")
  }

  throw new Error("Error while Delete Mapping API")
}

async function performMappingAPI({orderType, bookingNo, documentNo, domainName, otmQualifierKey, gid}) {
  const orderTypeXid = getDocOrBookingNoByOrderTypeLogic({orderType, documentNo, bookingNo})
  
  let url = `/${orderType}/${domainName}.${orderTypeXid}/involvedParties`
  const payload = {
    "involvedPartyQualGid": otmQualifierKey,
    "involvedPartyContactGid": gid,
    "comMethodGid": "EMAIL",
    "domainName": "TW"
  }

  const _options = getOptions("POST", payload)
  let response = await fetch(OTM_API_BASE_URL + url, _options);
  console.log("performMappingAPI response ", url, payload, response.status, response);
  if(response.status == "201") {
    
    try {
      response =  await response.json();
      response = JSON.stringify(response)
    } catch (error) {
      response = {
        status: 201,
        statusText: "success",
        payload
      }
    }
    return {
      success: true,
      response: response,
      payload
    }
  } else {
    return {
      success: false,
      payload,
      response: JSON.stringify({
        status: response.status,
        statusText: response.statusText
      }, null, 4)
    }
  }

  
}

async function createLocationAPI({locationXid, locationName, locationAddress, country_code}) {

  let url = `/locations`
  const payload = {
     "locationXid": locationXid,
      "locationName":locationName,
      "countryCode3Gid":country_code,
      "domainName": "TW",
      "isActive": true,
       "roleProfiles": {
            "items": [
                {
                    "locationRoleGid": "SHIPFROM/SHIPTO",
                    "domainName": "TW"
                }
            ]
        },
        "addresses": {
            "items": [
                {
                    "lineSequence": 1,
                    "addressLine":locationAddress,
                    "domainName": "TW"
                }
            ]
        }
  }

  try {
    let res = await apiPOST(url, payload)
    if(res) {
      return true
    }
  } catch (error) {
    throw new Error(error.message)
  }
  throw new Error("Error while create location")
}
async function checkLocationExistAPI({locationName, locationAddress}) {
  const apiParamUrl = `${OTM_API_BASE_URL}/locations?fields=locationXid,locationName,addresses.addressLine&expand=addresses&q=locationName eq "${encodeURIComponent(locationName)}" and addresses.addressLine eq "${encodeURIComponent(locationAddress)}"`
  const _options = getOptions('GET')
  let response = await fetch(apiParamUrl, _options);
  console.log("CheckLocationExistAPI response ", apiParamUrl, {locationName, locationAddress}, response.status, response);
  if(response.status == "200") {
    response =  await response.json();
    return {
      success: true,
      response: response
    }
  } else {
    return {
      success: false,
      response: JSON.stringify({
        status: response.status,
        statusText: response.statusText
      }, null, 4)
    }
  }
}

async function apiDeleteByURL(url, options = {}) {
  const otmAPIAccessToken = base64.encode(username + ":" + password);

  const _options = {
    method: "DELETE",
    headers: {
      "Content-Type":"application/vnd.oracle.resource+json;type=singular",
      Authorization: `Basic ${otmAPIAccessToken}`,
      Cookie:
        "JSESSIONID=NvscskPTs6tT3evZIcZo_rpqgL_7rlsPTcoq4jHH8avhNgIDRc9g!1075579596; X-Oracle-BMC-LBS-Route=fb71084c731eca116b8bb4630360dd17721f6bac27da03a11a2ff120e313e9b656c62fd8a7c42ae8414b9d2c633377e66f0f18fd94acae556a54cac1",
    },
    ...options,
  };

  const response = await fetch(url, _options);
  return response;
  // return await response.json();
}

async function getContainerListAPI({orderType, domainName, documentNo}) {

  let url = `/${orderType}/${domainName}.${documentNo}/shipUnits`;

  let res = await apiGET(url) 
  console.log("GetContainerListAPI :: url, res", url, res);
  if(res && res.count) {
    return res.items
  } else {
    return null
  }

}
async function updateContainerAPI({orderType, domainName, documentNo, shipUnitXid, payload}) {
  let url = `/${orderType}/${domainName}.${documentNo}/shipUnits/${domainName}.${shipUnitXid}`
  let response = await newApiPATCH(url, payload) 
  return response
}

async function updateContainerSealUnitAPI({orderType, domainName, documentNo, shipUnitXid, payload}) {

  let url = `/${orderType}/${domainName}.${documentNo}/shipUnits/${domainName}.${shipUnitXid}/seals`

  let res = await apiPATCH(url, payload) 
  console.log("\n updateContainerSealUnitAPI :: url, payload, res", url, payload, res);
  if(res) {
    return true
  } else {
    return false
  }

}

async function updateSingleContainerAPI({orderType, domainName, documentNo, payload}) {
  let url = `/${orderType}/${domainName}.${documentNo}`
  let response = await newApiPATCH(url, payload) 
  return response
}

async function updateContainerSealUnitAPI({orderType, domainName, documentNo, shipUnitXid, payload}) {

  let url = `/${orderType}/${domainName}.${documentNo}/shipUnits/${domainName}.${shipUnitXid}/seals`

  let res = await apiPATCH(url, payload) 
  console.log("\n updateContainerSealUnitAPI :: url, payload, res", url, payload, res);
  if(res) {
    return true
  } else {
    return false
  }

}

async function remarkCreationSealTypeAPI({orderType, domainName, documentNo, shipUnitXid, payload}) {

  let url = `/${orderType}/${domainName}.${documentNo}/shipUnits/${domainName}.${shipUnitXid}/remarks`

  
  const _options = getOptions("POST", payload)
  let response = await fetch(OTM_API_BASE_URL + url, _options);
  if(response.status == "201") {
    response =  await response.json();
    return {
      success: true,
      response: response
    }
  } else {
    return {
      success: false,
      response: JSON.stringify({
        status: response.status,
        statusText: response.statusText
      }, null, 4)
    }
  }

  
  console.log("\n remarkCreationSealTypeAPI :: url, payload, res", url, payload, res);
  if(res) {
    return true
  } else {
    return false
  }
}

async function createCharterVoyageAPI(payload) {

  let url = process.env.OTM_TW_CHARTER_VOYAGE_URL;

  try {
    const otmAPIAccessToken = base64.encode(sanity_username + ":" + sanity_password);
    const _options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${otmAPIAccessToken}`,
        "Cookie":"JSESSIONID=NvscskPTs6tT3evZIcZo_rpqgL_7rlsPTcoq4jHH8avhNgIDRc9g!1075579596; X-Oracle-BMC-LBS-Route=fb71084c731eca116b8bb4630360dd17721f6bac27da03a11a2ff120e313e9b656c62fd8a7c42ae8414b9d2c633377e66f0f18fd94acae556a54cac1",
      },
      body: JSON.stringify(payload)
    };

    let response = await fetch(url, _options);
    console.log("\n createCharterVoyageAPI :: url, payload, response", url, payload, response);
    if(response.status == "200") {
      response = await response.json()
      return {
        success: true,
        response
      }
    } else {
      return {
        success: false,
        response: JSON.stringify({
          status: response.status,
          statusText: response.statusText
        }, null, 4)
      }
    }
    
  } catch (error) {
    console.error("Error createCharterVoyageAPI ::", payload, error);
  }

  return null
  
}

function getDocOrBookingNoByOrderTypeLogic({orderType, bookingNo, documentNo}) {
  /* DO NOT REMOVE THIS ORDER TYPE LOGIC WRITTEN HERE FOR ANY FUTURE CHANGES */
  return documentNo
  // return orderType == "orderBases" ? bookingNo : documentNo
}

async function updateInOrderPortVesselFieldsAPI({orderType, domainName, documentNo, payload}) {
  let url = `/${orderType}/${domainName}.${documentNo}`
  return await newApiPATCH(url, payload) 
}

async function refnumCreationAPI({orderType, domainName, documentNo, payload}) {
  let url = `/${orderType}/${domainName}.${documentNo}/refnums`

  const _options = getOptions("POST", payload)
  const response = await fetch(OTM_API_BASE_URL + url, _options);
  console.log("\n refnumCreationAPI :: url, payload, res", url, payload, response);
  if(response.status == "201") {
    return {
      success: true,
      response
    }
  } else {
    return {
      success: false,
      response: JSON.stringify({
        status: response.status,
        statusText: response.statusText
      }, null, 4)
    }
  }
}
async function remarkCreationAPI({orderType, domainName, documentNo, payload}) {
  let url = `/${orderType}/${domainName}.${documentNo}/remarks`
  const _options = getOptions("POST", payload)
  const response = await fetch(OTM_API_BASE_URL + url, _options);
  console.log("\n remarkCreationAPI :: url, payload, response", url, payload, response);
  if(response.status == "201") {
    return {
      success: true,
      response
    }
  } else {
    return {
      success: false,
      response: JSON.stringify({
        status: response.status,
        statusText: response.statusText
      }, null, 4)
    }
  }
}

async function deleteShipUnitRemarkAPI({orderType, domainName, documentNo, remarkSequence, obShipUnitXid}) {
  try {
    const url = `${OTM_API_BASE_URL}/${orderType}/${domainName}.${documentNo}/shipUnits/${domainName}.${obShipUnitXid}/remarks/${remarkSequence}`
    const _options = getOptions("DELETE")
    const response = await fetch(url, _options);
    console.log("\n deleteShipUnitRemarkAPI :: url, payload, response", url, {obShipUnitXid, remarkSequence}, response);
    if(response.status == "200") {
      return {
        success: true,
        response: response
      }
    } else {
      return {
        success: false,
        response: JSON.stringify({
          status: response.status,
          statusText: response.statusText
        }, null, 4)
      }
    }
  } catch (error) {
    console.error("Error deleteRemarksAPI", error);
  }
  return false
}

async function deleteRemarksAPI({orderType, domainName, documentNo, remarkSequence, remarkQualGid}) {
  try {
    let url = `${OTM_API_BASE_URL}/${orderType}/${domainName}.${documentNo}/remarks/${remarkSequence}`
    const _options = getOptions("DELETE")
    const response = await fetch(url, _options);
    console.log("\n deleteRemarksAPI :: url, payload, response", url, {}, response);
    if(response.status == "200") {
      return {
        success: true,
        response: response
      }
    } else {
      return {
        success: false,
        response: JSON.stringify({
          status: response.status,
          statusText: response.statusText
        }, null, 4)
      }
    }
  } catch (error) {
    console.error("Error deleteRemarksAPI", error);
  }
  return false
}

async function getOrderBaseRemarksAPI({orderType, domainName, documentNo, remarkQualGid}) {
  let url = `/${orderType}/${domainName}.${documentNo}/remarks?q= remarkQualGid ew "${remarkQualGid}"`
  try {
    let res = await apiGET(url) 
    if(res && res.count) {
      return res.items
    } else {
      return null
    } 
  } catch (error) {
    return null
  }
}

async function deleteRefnumAPI({orderType, domainName, documentNo, qualifierGID, obRefnumValue}) {
  let url = `${OTM_API_BASE_URL}/${orderType}/${domainName}.${documentNo}/refnums/${qualifierGID}x${obRefnumValue}`
    const _options = getOptions("DELETE")
    const response = await fetch(url, _options);
    console.log("\n deleteRefnumAPI :: url, payload, response", url, {}, response);
    if(response.status == "200") {
      return {
        success: true,
        response: response
      }
    } else {
      return {
        success: false,
        response: JSON.stringify({
          status: response.status,
          statusText: response.statusText
        }, null, 4)
      }
    }
}

async function checkCharterVoyageTransmissionStatusAPI({transmissionId}) {
  let url = `${OTM_API_BASE_URL}/transmissionStatus/${transmissionId}`
  
  const _options = getOptions('GET')
  let response = await fetch(url, _options);
  console.log("\n checkCharterVoyageTransmissionStatusAPI :: url, response", url, response);
  if(response.status == "200") {
    response = await response.json()
    return {
      success: true,
      response: response
    }
  } else {
    return {
      success: false,
      response: JSON.stringify({
        status: response.status,
        statusText: response.statusText
      }, null, 4)
    }
  }
}

async function markOtmSuccessFlagAPI({orderType, domainName, documentNo, payload, qualifierGID}) {
  let url = `${OTM_API_BASE_URL}/${orderType}/${domainName}.${documentNo}/refnums`;
  const _options = getOptions("POST", payload)

  try {
    let yRes = await deleteRefnumAPI({orderType, domainName, documentNo, qualifierGID: qualifierGID, obRefnumValue: "Y"})
  } catch (error) {
    console.error("Error markOtmSuccessFlagAPI DELETE", domainName, "SCANNED_DATA_RECEIVED");
  }

    let response = await fetch(url, _options);
    console.log("\n markOtmSuccessFlagAPI :: response", response);

    if(response.status == "201") {
      return {
        success: true,
        response: response
      }
    } else {
      return {
        success: false,
        response: JSON.stringify({
          status: response.status,
          statusText: response.statusText
        }, null, 4)
      }
    }
}
async function markNoOtmSuccessFlagAPI({orderType, domainName, documentNo, payload, qualifierGID}) {
  let url = `${OTM_API_BASE_URL}/${orderType}/${domainName}.${documentNo}/refnums`;
  const _options = getOptions("POST", payload)

  try {
    let yRes = await deleteRefnumAPI({orderType, domainName, documentNo, qualifierGID: qualifierGID, obRefnumValue: "Y"})
  } catch (error) {
    console.error("Error markOtmSuccessFlagAPI DELETE", domainName, "SCANNED_DATA_RECEIVED");
  }

    // let response = await fetch(url, _options);
    // console.log("\n markOtmSuccessFlagAPI :: response", response);

    // if(response.status == "201") {
    //   return {
    //     success: true,
    //     response: response
    //   }
    // } else {
    //   return {
    //     success: false,
    //     response: JSON.stringify({
    //       status: response.status,
    //       statusText: response.statusText
    //     }, null, 4)
    //   }
    // }
}
async function getRefnumQaulListByQualGid({orderType, domainName, documentNo, obRefnumQualGid}) {
  let url = `${OTM_API_BASE_URL}/${orderType}/${domainName}.${documentNo}/refnums?q= obRefnumQualGid ew "${obRefnumQualGid}"`
  if(orderType === ORDER_RELEASES_ORDER_TYPE) {
    url = `${OTM_API_BASE_URL}/${orderType}/${domainName}.${documentNo}/refnums?q= orderReleaseRefnumQualGid ew "${obRefnumQualGid}"`
  }
  const _options = getOptions("GET")
  try {
    let res = await fetch(url, _options)
    res = await res.json()
    return res.items || []
  } catch (error) {
    console.error(" Error getRefnumQaulListByQualGid ::", error);
  }
  return []

}
async function getCountryCodeByAddress(address) {
  let apiKey = process.env.GOOGLE_GEOCODING_API_KEY
  let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
  response = await response.json()
  if (response.results.length > 0) {
    const countryCode = response.results[0].address_components.find(
      (component) => component.types.includes('country')
    );
    console.log("response country_code countryCode:::", countryCode);
    if (countryCode) {
      return countryCode.short_name;
    } else {
      throw new Error('Country code not found in the response.');
    }
  } else {
    throw new Error('No results found for the provided address.');
  }
}
/* API HELPERS */
async function apiGET(url, options = {}) {
  const otmAPIAccessToken = base64.encode(username + ":" + password);

  const _options = {
    method: "GET",
    headers: {
      Authorization: `Basic ${otmAPIAccessToken}`,
      Cookie: "JSESSIONID=NvscskPTs6tT3evZIcZo_rpqgL_7rlsPTcoq4jHH8avhNgIDRc9g!1075579596; X-Oracle-BMC-LBS-Route=fb71084c731eca116b8bb4630360dd17721f6bac27da03a11a2ff120e313e9b656c62fd8a7c42ae8414b9d2c633377e66f0f18fd94acae556a54cac1",
    },
    ...options,
  };

  url = OTM_API_BASE_URL + url;
  const response = await fetch(url, _options);
  return await response.json();
}
async function apiPOST(url, body = {}) {
  const _options = getOptions("POST", body)
  const response = await fetch(OTM_API_BASE_URL + url, _options);
  return await response.json();
}
async function apiPATCH(url, body = {}) {
  
  let options = getOptions("PATCH", body)
  url = OTM_API_BASE_URL + url;
  const response = await fetch(url, options);
  if(response.status == "204") return true
  return await response.json();
}
async function newApiPATCH(url, body = {}) {
  let options = getOptions("PATCH", body)
  url = OTM_API_BASE_URL + url;
  const response = await fetch(url, options);

  if(response.status == "204") {
    return {
      success: true,
      response: response
    }
  } else {
    return {
      success: false,
      response: JSON.stringify({
        status: response.status,
        statusText: response.statusText
      }, null, 4)
    }
  }
}
async function apiDELETE(url, options = {}) {
  const otmAPIAccessToken = base64.encode(username + ":" + password);

  const _options = {
    method: "DELETE",
    headers: {
      "Content-Type":"application/vnd.oracle.resource+json;type=singular",
      Authorization: `Basic ${otmAPIAccessToken}`,
      Cookie:
        "JSESSIONID=NvscskPTs6tT3evZIcZo_rpqgL_7rlsPTcoq4jHH8avhNgIDRc9g!1075579596; X-Oracle-BMC-LBS-Route=fb71084c731eca116b8bb4630360dd17721f6bac27da03a11a2ff120e313e9b656c62fd8a7c42ae8414b9d2c633377e66f0f18fd94acae556a54cac1",
    },
    ...options,
  };

  url = OTM_API_BASE_URL + url;
  const response = await fetch(url, _options);
  return await response.json();
}
const getOptions = (method, body) => {
  const otmAPIAccessToken = base64.encode(username + ":" + password);
  return {
    method: method,
    headers: {
      "Content-Type":"application/vnd.oracle.resource+json;type=singular",
      Authorization: `Basic ${otmAPIAccessToken}`,
      Cookie:"JSESSIONID=NvscskPTs6tT3evZIcZo_rpqgL_7rlsPTcoq4jHH8avhNgIDRc9g!1075579596; X-Oracle-BMC-LBS-Route=fb71084c731eca116b8bb4630360dd17721f6bac27da03a11a2ff120e313e9b656c62fd8a7c42ae8414b9d2c633377e66f0f18fd94acae556a54cac1",
    },
    body: JSON.stringify(body)
  };
}

async function getVesselApi(vesselName) {
  let url = `${OTM_API_BASE_URL}/vessels?q=vesselName eq "${vesselName}"`
  try {
    const _options = getOptions("GET")
    let response = await fetch(url, _options);
    if (response.status == "200") {
      response = await response.json()
      return {
        success: true,
        ...response
      }
    }

  } catch (error) {
    console.error("Error getVesselApi ::", error);
  }

  return {
    success: false,
    items: []
  }

  }


async function getPortMasterAPI({limit, offset, insertDate}) {
    let url = `${OTM_API_BASE_URL}/locations?q=roleProfiles.locationRoleGid eq "PORT"&fields=locationXid,locationName&limit=${limit}&totalResults=true&offset=${offset}`

    if(insertDate) {
      insertDate = new Date(insertDate).toISOString()
      url = `${OTM_API_BASE_URL}/locations?q=(insertDate ge ${insertDate}) roleProfiles.locationRoleGid eq "PORT"&fields=locationXid,locationName,insertDate,updateDate&limit=${limit}&totalResults=true&offset=${offset}`
    }

    try {
        const _options = getOptions("GET")
        let response = await fetch(url, _options);
        if(response.status == "200") {
            response = await response.json()
            return {
                success: true,
                ...response
            }
        } else {
            console.log('error -------',{success: false,response});
            return {
                success: false,
                items: [],
                response: JSON.stringify({
                status: response.status,
                statusText: response.statusText
                }, null, 4)
            }
        }      
    } catch (error) {
        console.error("Error getPortMasterAPI ::", error);
    }
    return null
}

async function getAirPortMasterAPI({limit, offset, insertDate}) {
    let url = `${OTM_API_BASE_URL}/locationProfiles/TW.FF_WORLD_AIRPORT/details?expand=location&fields=location.locationXid,location.locationName,location.insertDate,location.updateDate,location.city&totalResults=true&limit=${limit}&totalResults=true&offset=${offset}`
    
    if(insertDate) {
      insertDate = new Date(insertDate).toISOString()
      url = `${OTM_API_BASE_URL}/locationProfiles/TW.FF_WORLD_AIRPORT/details?q=(insertDate ge ${insertDate}),expand=location&fields=location.locationXid,location.locationName,location.insertDate,location.updateDate,location.city&totalResults=true&limit=${limit}&totalResults=true&offset=${offset}`
    }

    try {
        const _options = getOptions("GET")
        let response = await fetch(url, _options);
        if(response.status == "200") {
            response = await response.json()
            return {
                success: true,
                ...response
            }
        } else {
            console.log('error -------',{success: false,response});
            return {
                success: false,
                items: [],
                response: JSON.stringify({
                status: response.status,
                statusText: response.statusText
                }, null, 4)
            }
        }      
    } catch (error) {
        console.error("Error getAirPortMasterAPI :: ", error);
    }
    return null
}

async function getAllContainerItemsData({limit=25}) {
  let url = `/items?fields=itemXid,itemName,description,htsGid&limit=${limit}&q=htsGid pr&totalResults=true`
  try {
    let res = await apiGET(url)
    if(res && res.count){
      return res.items

    }
  } catch (error) {
    return []
  }
}
module.exports = {
  getRefnumQaulListByQualGid,
  checkDocumentAndOrderTypeInOTM,
  checkPossibleXIDInOtmAPI,
  getLocationAddressAPI,
  checkInInvolvedPartyAddressAPI,
  remarkCreationSealTypeAPI,
  checkLocationExistAPI,
  deleteMappingAPI,
  performMappingAPI,
  createLocationAPI,
  refnumCreationAPI,
  deleteShipUnitRemarkAPI,
  getOrderBaseRemarksAPI,
  deleteRefnumAPI,
  deleteRemarksAPI,
  remarkCreationAPI,
  createCharterVoyageAPI,
  updateContainerAPI,
  updateSingleContainerAPI,
  apiDeleteByURL,
  getContainerListAPI,
  markOtmSuccessFlagAPI,
  updateContainerSealUnitAPI,
  getAllQualifiersFromOtmAPI,
  updateInOrderPortVesselFieldsAPI,
  getCountryCodeByAddress,
  checkCharterVoyageTransmissionStatusAPI,
  getVesselApi,
  getPortMasterAPI,
  getAirPortMasterAPI,
  getAllContainerItemsData,
  checkBookingCancelStatusAPI,
  markNoOtmSuccessFlagAPI
};