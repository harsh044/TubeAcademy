const Certificate = require('../models/certificate')
const mongoose = require('mongoose'); 

// ================ Get Course Details ================
exports.getCertificateId = async (req, res) => {
    try {
        const { courseid, userid } = req.body;

        if (!mongoose.Types.ObjectId.isValid(courseid) || !mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course or user ID"
            });
        }

        const certificateView = await Certificate.findOne({
            course: new mongoose.Types.ObjectId(courseid),
            student: new mongoose.Types.ObjectId(userid)
        });

        if (!certificateView) {
            return res.status(404).json({
                success: false,
                message: `Could not find the certificate`,
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                certificateId: certificateView.certificateId
            },
            message: 'Fetched Certificate successfully'
        });
    } catch (error) {
        console.error('Error while fetching Certificate', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching Certificate',
        });
    }
}

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