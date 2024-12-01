require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const formRoutes = require("./routes/formRoutes");
const cors = require("cors"); // Import the CORS package

const app = express();

// Enable CORS for all origins
app.use(cors());

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});


app.use(express.json());
app.use("/api/forms", formRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
