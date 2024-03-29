const express = require("express");
const router = express.Router();
const yapService = require("../services/yap_service");
const logged_in_check_middleware = require("../middleware/logged_in_check");

// Create a new Yap
router.post("/create", logged_in_check_middleware, async (req, res) => {
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
router.get("/saved", logged_in_check_middleware, async (req, res) => {
  try {
    const yaps = await yapService.getYaps();
    res.json(yaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a yap by ObjectId
router.get("/:id", logged_in_check_middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const yap = await yapService.getYap(id);
    res.json(yap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a yap by ObjectId
router.put("/update/:id", logged_in_check_middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const yap = await yapService.updateYap(id, title, content);
    res.json(yap);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a yap by ObjectId
router.delete("/delete/:id", logged_in_check_middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const yap = await yapService.deleteYap(id);
    res.json(yap);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
