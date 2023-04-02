"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

// signUp
router.post("/shop/login", asyncHandler(accessController.login));
router.post("/shop/signup", asyncHandler(accessController.signUp));

// Middleware authentication
router.use(authentication);

// log out
router.post("/shop/logout", asyncHandler(accessController.logout));
module.exports = router;
