/* *Key: Use their side and *value: use for our side as in jobs table '.' not allowed in mongo: Refer Jobs table */
module.exports.TOTAL_TASK_TO_COMPLETE_COUNTS = 8
module.exports.QUALIFIERS = {
    "SHIPPER": {
        "rpaQualifierName": "SHIPPER",
        "otmQualifierName": "SHIPPER",
    },
    "CONSIGNEE": {
        "rpaQualifierName": "CONSIGNEE",
        "otmQualifierName": "CONSIGNEE",
    },
    "NOTIFY_PARTY_1": {
        "rpaQualifierName": "NOTIFY_PARTY_1",
        "otmQualifierName": "TW.NOTIFY_PARTY_1",
    },
    "ORIGIN_AGENT": {
        "rpaQualifierName": "ORIGIN_AGENT",
        "otmQualifierName": "TW.ORIGIN_AGENT",
    },
    "NOTIFY_PARTY_2": {
        "rpaQualifierName": "NOTIFY_PARTY_2",
        "otmQualifierName": "TW.NOTIFY_PARTY_2",
    },
    "CARRIER": {
        "rpaQualifierName": "CARRIER",
        "otmQualifierName": "CARRIER",
    },
    "DESTINATION_AGENT": {
        "rpaQualifierName": "DESTINATION_AGENT",
        "otmQualifierName": "DESTINATION_AGENT",
    },
    "FORWARDING AGENT": {
        "rpaQualifierName": "FORWARDING AGENT",
        "otmQualifierName": "FORWARDING AGENT",
    },

    "IATA_AGENT": {
        "rpaQualifierName": "IATA_AGENT",
        "otmQualifierName": "TW.IATA_AGENT",
    },
}

module.exports.MBL_QUALIFIERS = {
    "SHIPPER": {
        "rpaQualifierName": "MBL_SHIPPER",
        "otmQualifierName": "TW.MBL_SHIPPER",
    },
    "CONSIGNEE": {
        "rpaQualifierName": "MBL_CONSIGNEE",
        "otmQualifierName": "TW.MBL_CONSIGNEE",
    },
    "NOTIFY_PARTY_1": {
        "rpaQualifierName": "MBL_NOTIFY_PARTY_1",
        "otmQualifierName": "TW.MBL_NOTIFY_PARTY_1",
    },
    "ORIGIN_AGENT": {
        "rpaQualifierName": "ORIGIN_AGENT",
        "otmQualifierName": "TW.ORIGIN_AGENT",
    },
    "NOTIFY_PARTY_2": {
        "rpaQualifierName": "MBL_NOTIFY_PARTY_2",
        "otmQualifierName": "TW.MBL_NOTIFY_PARTY_2",
    },
    "CARRIER": {
        "rpaQualifierName": "CARRIER",
        "otmQualifierName": "CARRIER",
    },
    "DESTINATION_AGENT": {
        "rpaQualifierName": "DESTINATION_AGENT",
        "otmQualifierName": "DESTINATION_AGENT",
    },
    "FORWARDING AGENT": {
        "rpaQualifierName": "FORWARDING AGENT",
        "otmQualifierName": "FORWARDING AGENT",
    },

    "IATA_AGENT": {
        "rpaQualifierName": "IATA_AGENT",
        "otmQualifierName": "IATA_AGENT",
    },
}


module.exports.SHIPPER_SEAL_NUMBER_QUALIFIER = "SHIPPER_SEAL_NUMBER"
module.exports.LINER_SEAL_NUMBER_QUALIFIER = "LINER_SEAL_NUMBER"
module.exports.CUSTOM_SEAL_NUMBER_QUALIFIER = "CUSTOM_SEAL_NUMBER"

module.exports.ORDER_BASSES_ORDER_TYPE = "orderBases"
module.exports.ORDER_RELEASES_ORDER_TYPE = "orderReleases"
module.exports.DOCUMENT_TYPE_MBL = "MBL"
module.exports.DOCUMENT_TYPE_HBL = "HBL"
module.exports.DOCUMENT_TYPE_MAWB = "MAWBL"
module.exports.DOCUMENT_TYPE_HAWB = "HAWBL"

const involvedPartyQualStatus = {
    "STEP1": {
        text: "Check Location XID Exist",
    },
    "STEP2": {
        text: "Location Name and Address Checking in OTM",
    },
    "STEP3": {
        text: "Create Location"
    },
    "STEP4": {
        text: "Check Qualifier Exist in OTM"
    },
    "STEP5": {
        text: "Delete Qualifier"
    },
    "STEP6": {
        text: "Map In OTM"
    },
}
module.exports.NEW_STATUS = {
    "CONSIGNEE": involvedPartyQualStatus,
    "NOTIFY_PARTY_1": involvedPartyQualStatus,
    "ORIGIN_AGENT": involvedPartyQualStatus,
    "NOTIFY_PARTY_2": involvedPartyQualStatus,
    "MBL_SHIPPER": involvedPartyQualStatus,
    "MBL_CONSIGNEE": involvedPartyQualStatus,
    "MBL_NOTIFY_PARTY_1": involvedPartyQualStatus,
    "MBL_NOTIFY_PARTY_2": involvedPartyQualStatus,
    "SHIPPER": involvedPartyQualStatus,
    "CARRIER": involvedPartyQualStatus,
    "DESTINATION_AGENT": involvedPartyQualStatus,
    "FORWARDING AGENT": involvedPartyQualStatus,
    "IATA_AGENT": involvedPartyQualStatus,
    "ContainerDetails": {
        "STEP1":{
            text: "Container Details not found",
            title: "Ship Unit/Container Details"
        },
        "STEP2": {
            title: "Fetch All Container",
        },
        "STEP3": {
            title: "Update Container Detail",
        },
    },
    "ShipperSeal": {
        "STEP1": {
            title: "Fetch All Container",
        },
        "STEP2": {
            title: "Shipper Seal Creation",
        }
    },
    "CustomSeal": {
        "STEP1": {
            title: "Fetch All Container",
        },
        "STEP2": {
            title: "Shipper Seal Creation",
        }
    },
    "LinerSeal": {
        "STEP1": {
            title: "Fetch All Container",
        },
        "STEP2": {
            title: "Shipper Seal Creation",
        }
    },
    "CharterVoyage": {
        "STEP1": {
            "title": "Create Charter Voyage"
        },
        "STEP2": {
            "title": "Charter Voyage Transmission Status"
        },
    },
    "DischargeCharterVoyage": {
        "STEP1": {
            "title": "Create Charter Voyage"
        },
        "STEP2": {
            "title": "Charter Voyage Transmission Status"
        },
    },
    "VesselDetails": {
        "STEP1": {
            title: "Vessel Details Update"
        }
    },
    "DischargeVesselDetails": {
        "STEP1": {
            title: "Vessel Details Update"
        }
    },
    "PortDetails": {
        "STEP1": {
            title: "Port Details Update"
        }
    },
}