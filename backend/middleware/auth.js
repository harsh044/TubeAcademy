// AUTH , IS STUDENT , IS INSTRUCTOR , IS ADMIN

const jwt = require("jsonwebtoken");
require('dotenv').config();

// / Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, accountType: user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "1m" } // Access token valid for 15 minutes
    );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, accountType: user.accountType },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } // Refresh token valid for 7 days
    );
};

// user Authentication by checking token validating
// ================ AUTH ================
exports.auth = async (req, res, next) => {
    try {
        const token = req.body?.token || req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is Missing",
            });
        }
        
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode; // Attach user info to the request
            next(); // Proceed to the next middleware
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                if (!refreshToken) {
                    const newRefreshToken = generateRefreshToken(decode);
                    res.cookie("refreshToken", newRefreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "Strict",
                    });
                    console.log(newRefreshToken)
                }
                // Verify the refresh token
                const refreshToken = req.cookies.refreshToken;
                
                const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                // Handle expired access token
                
                // Check if the refresh token has expired
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                const refreshTokenExpiry = decode.exp; // Expiry time of the refresh token

                // If the refresh token is expired, generate a new refresh token as well
                if (currentTime >= refreshTokenExpiry) {
                    const newRefreshToken = generateRefreshToken(decode);
                    res.cookie("refreshToken", newRefreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "Strict",
                    });
                }

                if (!refreshToken) {
                    return res.status(401).json({
                        success: false,
                        message: "Session expired. Please log in again.",
                    });
                }

                // Verify refresh token
                try {
                    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    const newAccessToken = generateAccessToken(decode);
                    res.cookie("token", newAccessToken, {
                        httpOnly: true,
                        secure: true, // Use secure cookies in production
                        sameSite: "Strict",
                    });
                    req.user = decode; // Attach user info to the request
                    next();
                } catch (refreshError) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid refresh token. Please log in again.",
                    });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token.",
                });
            }
        }
    } catch (error) {
        console.log("Error in authentication middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

// ================ REFRESH TOKEN  ================
exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token is missing.",
        });
    }

    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateAccessToken(decode);
        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token.",
        });
    }
};



// ================ IS STUDENT ================
exports.isStudent = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user?.accountType != 'Student') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for student'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with student accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with student accountType'
        })
    }
}


// ================ IS INSTRUCTOR ================
exports.isInstructor = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user?.accountType != 'Instructor') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for Instructor'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with Instructor accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with Instructor accountType'
        })
    }
}


// ================ IS ADMIN ================
exports.isAdmin = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user.accountType != 'Admin') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for Admin'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with Admin accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with Admin accountType'
        })
    }
}


