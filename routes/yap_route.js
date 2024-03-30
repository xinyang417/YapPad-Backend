const express = require("express");
const router = express.Router();
const yapService = require("../services/yap_service");
const logged_in_check_middleware = require("../middleware/logged_in_check");
const api_consumption_middleware = require("../middleware/api_consumption_middleware");
const { getApiConsumption } = require("../services/api_consumption_service"); 

// fetch the current API consumption
router.get('/api-consumption', [logged_in_check_middleware], async (req, res) => {
  console.log("Accessing /api-consumption endpoint");
  try {
    const userId = req.session.user_id;
    console.log("UserID from session:", userId); 
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in session." });
    }
    const calls = await getApiConsumption(userId);
    res.json({ calls });
  } catch (error) {
    console.error('Failed to fetch API consumption:', error);
    res.status(500).json({ message: 'Internal server error occurred.' });
  }
});


// Create a new Yap
router.post("/create", [logged_in_check_middleware, api_consumption_middleware], async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.session.user_id;
    const yap = await yapService.createYap(title, content, authorId);
    res.json(yap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all yaps
router.get("/saved", [logged_in_check_middleware, api_consumption_middleware], async (req, res) => {
  try {
    const yaps = await yapService.getYaps();
    res.json(yaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a yap by ObjectId
router.get("/:id", [logged_in_check_middleware, api_consumption_middleware], async (req, res) => {
  try {
    const { id } = req.params;
    const yap = await yapService.getYap(id);
    res.json(yap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a yap by ObjectId
router.put("/update/:id", [logged_in_check_middleware, api_consumption_middleware], async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const yap = await yapService.updateYap(id, title, content);
    res.json(yap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a yap by ObjectId
router.delete("/delete/:id", [logged_in_check_middleware, api_consumption_middleware], async (req, res) => {
  try {
    const { id } = req.params;
    await yapService.deleteYap(id);
    res.json({ message: "Yap deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = router;
