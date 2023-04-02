"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "1 day",
    });

    // refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // verify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`Error verify:: ${err}`);
      } else {
        console.log(`Decode verify:: ${decode}`);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - Check userId missing
    2 - Get access token
    3 - Verify token
    4 - Check user in db
    5 - Check keystore with this userId
    6 - Ok all => return next()
  */

  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }

  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found keyStore");
  }

  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid user");
    }

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { createTokenPair, authentication };
