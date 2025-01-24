const Certificate = require('../models/certificate')

// ================ Get Course Details ================
exports.getCertificateView = async (req, res) => {
    try {
        // get course ID
        const { certificateId } = req.body;

        // find course details
        const certificateView = await Certificate.findOne({
            certificateId: certificateId,
        }).exec()

        //validation
        if (!certificateView) {
            return res.status(400).json({
                success: false,
                message: `Could not find the certificate with ${certificateId}`,
            });
        }

        //return response
        return res.status(200).json({
            success: true,
            data: {
                "certificateUrl":certificateView.certificateUrl
            },
            message: 'Fetched Certificate successfully'
        })
    }

    catch (error) {
        console.log('Error while fetching Certificate');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching Certificate',
        });
    }
}

// ================ Get Course Details ================
exports.getCertificateViewGlobal = async (req, res) => {
    try {
        // get course ID
        const { certificateId } = req.params; // Access query parameters
        // find course details
        const certificateView = await Certificate.findOne({
            certificateId: certificateId,
        }).exec()

        //validation
        if (!certificateView) {
            return res.status(400).json({
                success: false,
                message: `Could not find the certificate with ${certificateId}`,
            });
        }

        //return response
        return res.status(200).json({
            success: true,
            data: {
                "certificateUrl":certificateView.certificateUrl
            },
            message: 'Fetched Certificate successfully'
        })
    }

    catch (error) {
        console.log('Error while fetching Certificate');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching Certificate',
        });
    }
}