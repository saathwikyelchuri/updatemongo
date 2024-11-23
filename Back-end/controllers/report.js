const fs=require('fs');
// const fetch = require('node-fetch');
const path=require('path');
const reports=require('../models/report');

async function handleLoginDetails(req,res){
    const { childName, sessionId } = req.body;
    try {
        await reports.create({
            childname: childName,
            sessionid: sessionId
        });
        res.status(200).json({ message: 'Login details saved successfully' });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function handleUploading(req, res) {
    const { image, filename, childName, sessionId } = req.body;

    // Ensure all required fields are provided
    if (!image || !filename || !childName || !sessionId) {
        return res.status(400).json({ error: 'Missing required fields: image, filename, childName, or sessionId' });
    }

    // Define the absolute path for the photos directory (outside the controllers directory)
    const imagesDirectory = path.join(__dirname, '..', 'photos');
    if (!fs.existsSync(imagesDirectory)) {
        fs.mkdirSync(imagesDirectory, { recursive: true });
    }

    const childDirectory = path.join(imagesDirectory, childName);
    const sessionDirectory = path.join(childDirectory, sessionId);

    // Create directories if they don’t exist
    if (!fs.existsSync(childDirectory)) {
        fs.mkdirSync(childDirectory, { recursive: true });
    }
    if (!fs.existsSync(sessionDirectory)) {
        fs.mkdirSync(sessionDirectory, { recursive: true });
    }

    // Decode base64 image and save it
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(sessionDirectory, filename);

    try {
        // Save the file
        fs.writeFileSync(filePath, base64Data, 'base64');

        // Add only the image path to the `images` array
        const imagePathObject = { imgpath: path.join('photos', childName, sessionId, filename) }; // Relative path

        // Find the document by childName and sessionId, and update the images array
        await reports.findOneAndUpdate(
            { childname: childName, sessionid: sessionId }, // Find by childName and sessionId
            { $push: { images: imagePathObject } },          // Push the new image path to the images array
            { new: true, upsert: true }                      // Create a new document if it doesn't exist
        );

        // Respond to the client only once
        res.json({ success: true, message: 'Image saved and path updated successfully' });
    } catch (error) {
        console.error("Error saving image or updating database:", error);
        res.status(500).json({ error: 'Error saving image or updating database' });
    }
}

async function handleReport(req, res) {
    try {
        // Fetch only childname and sessionid fields
        const report = await reports.find({}, 'childname sessionid');
        if (!report || report.length === 0) {
            return res.status(404).json({ error: "No reports found." });
        }
        res.status(200).json(report); // Send the filtered data as JSON response
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


async function handleModel(req, res) {
  const body = req.body;
  const { childname, sessionid } = body;

  // Construct the folder path based on your directory structure
  const baseFolderPath = path.join(__dirname, '..', '..', 'Back-end');  // Adjust if necessary
  const photosFolderPath = path.join(baseFolderPath, 'photos', childname, sessionid);

  console.log("Photos Folder Path:", photosFolderPath);

  // Check if the photos folder exists
  fs.readdir(photosFolderPath, async (err, files) => {
    if (err) {
      // Error if the folder doesn't exist or there's an issue reading it
      console.error("Error reading folder:", err);
      return res.status(500).json({ message: "Error reading folder." });
    }

    // You can process the files here. For example, filter out specific files if needed.
    console.log("Files in photos folder:", files);

    try{
        const response=await fetch("http://127.0.0.1:5000/analyze",{
            method:'post',
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                childname:childname,
                sessionid:sessionid,
                filePath: photosFolderPath
            })
        });
        if (response.ok){
            console.log("folder sent successfully to model");
        }
        else{
            console.log("folder  not  went to model");
        }
    }catch(e){
        console.log("error ",e);
    }
    // Process or analyze the files as needed
    res.status(200).json({ message: "Folder processed successfully.", files });
  });
}

// let storedResults = [];
// async function handleMe(req, res) {
//     const results = req.body.results;
//     console.log("Received results from Flask backend:", results);
//     storedResults = results;
//     res.status(200).json({
//         message: "Results received successfully.",
//         results
//     });
// }

let storedResults = [];

async function handleMe(req, res) {
    const results = req.body.results;
    console.log("Received results from Flask backend:", results);

    // Store the results for future use (if needed)
    storedResults = results;
    try {
        for (const result of storedResults) {
            const { sessionid, image, emotions, max_emotion } = result;
    
            console.log("Querying sessionid:", sessionid, "and imgpath:", image);
    
            // Try to find the document
            const report = await reports.findOne({
                sessionid: sessionid,
                "images.imgpath": { $regex: image, $options: "i" }, // Use this if paths match exactly
            });
    
            if (!report) {
                console.log(`No matching report found for sessionid: ${sessionid} and imgpath: ${image}`);
                continue;
            }
    
            // Update if a match is found
            await reports.updateOne(
                {
                    sessionid: sessionid,
                    "images.imgpath": { $regex: image, $options: "i" },
                },
                {
                    $set: {
                        "images.$.emotions": emotions,
                        "images.$.max_emotion_img.emotion": max_emotion,
                    },
                }
            );
    
            console.log(`Updated emotions for sessionid: ${sessionid}, imgpath: ${image}`);
        }
    
        res.status(200).json({ message: "Emotions updated successfully." });
    } catch (error) {
        console.error("Error updating emotions:", error);
        res.status(500).json({ error: "An error occurred while updating emotions." });
    }
    
}




async function handleGet(req, res){
    if (storedResults.length === 0) {
        return res.status(404).json({
            message: "No results available yet. Please wait for Flask to send data.",
        });
    }

    res.status(200).json({
        results: storedResults,
    });
};


module.exports={
    handleLoginDetails,
    handleUploading,
    handleReport,
    handleModel,
    handleMe,
    handleGet
}