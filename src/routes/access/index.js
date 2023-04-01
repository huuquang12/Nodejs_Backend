"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");

// signUp
router.post("/shop/signup", asyncHandler(accessController.signUp));

module.exports = router;
