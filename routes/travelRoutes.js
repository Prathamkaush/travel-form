import express from "express";
import multer from "multer";
import TravelLog from "../models/travelLogs.js";

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


// GET ALL + FILTERS
router.get("/", async (req, res) => {
  try {
    const { from, to, startDate, endDate } = req.query;

    let filter = {};

    if (from) {
      filter.fromLocation = { $regex: from, $options: "i" };
    }

    if (to) {
      filter.toLocation = { $regex: to, $options: "i" };
    }

    // DATE FILTER
    if (startDate || endDate) {
      filter.date = {};  
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const logs = await TravelLog.find(filter).sort({ date: -1 });
    res.json(logs);

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});


// ADD TRAVEL ENTRY
router.post("/add", upload.single("slipImage"), async (req, res) => {
  try {
    const { fromLocation, toLocation, amount, date } = req.body;

    const newLog = await TravelLog.create({
      fromLocation,
      toLocation,
      amount: Number(amount),
      date: new Date(date),
      slipImageUrl: `/uploads/${req.file.filename}`,
    });

    res.json({ success: true, data: newLog });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// DELETE ENTRY
router.delete("/:id", async (req, res) => {
  try {
    await TravelLog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});


// TOTAL AMOUNT
router.get("/total", async (req, res) => {
  try {
    const logs = await TravelLog.find();
    const total = logs.reduce((acc, curr) => acc + Number(curr.amount), 0);
    res.json({ totalAmount: total });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
