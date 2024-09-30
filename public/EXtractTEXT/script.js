const imageInput = document.getElementById('image-input');
const extractButton = document.getElementById('extract-button');
const outputText = document.getElementById('output-text');
const outputContainer = document.getElementById('output-container');
const copyButton = document.getElementById('copy-button');
const downloadButton = document.getElementById('download-button');
const hideImageButton = document.getElementById('hide-image-button');
const loadingIndicator = document.getElementById('loading');
const uploadedImage = document.getElementById('uploaded-image');
const dropZone = document.getElementById('drop-zone');

let imageFile = null;

// Drag and Drop Image
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '#e9e9e9';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = '#f0f0f0';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '#f0f0f0';
    const files = e.dataTransfer.files;
    handleImage(files[0]);
});

// Click to Upload Image
dropZone.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', (event) => {
    const files = event.target.files;
    handleImage(files[0]);
});

function handleImage(file) {
    if (file) {
        imageFile = file;
        extractButton.disabled = false; // Enable extract button when an image is selected

        // Show uploaded image
        const reader = new FileReader();
        reader.onload = () => {
            uploadedImage.src = reader.result;
            uploadedImage.style.display = 'block'; // Display the image on the screen
            hideImageButton.style.display = 'inline-block'; // Show hide image button
        };
        reader.readAsDataURL(file);
    }
}

// Hide Image
hideImageButton.addEventListener('click', () => {
    uploadedImage.style.display = 'none';
    hideImageButton.style.display = 'none';
});

// Extract Text from Image
extractButton.addEventListener('click', () => {
    if (imageFile) {
        loadingIndicator.style.display = 'block'; // Show loading bar
        outputContainer.style.display = 'none'; // Hide text area initially
        extractButton.disabled = true; // Disable button to prevent repeated clicks

        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                Tesseract.recognize(
                    img,
                    'eng',
                    { logger: (m) => console.log(m) }
                ).then(({ data: { text } }) => {
                    outputText.textContent = text;
                    outputContainer.style.display = 'block'; // Display extracted text
                    copyButton.disabled = false;
                    downloadButton.disabled = false;
                }).catch((err) => {
                    outputText.textContent = 'Error extracting text.';
                    outputContainer.style.display = 'block';
                    console.error(err);
                }).finally(() => {
                    loadingIndicator.style.display = 'none'; // Hide loading bar
                    extractButton.disabled = false; // Re-enable the button
                });
            };
        };
        reader.readAsDataURL(imageFile);
    }
});

// Copy Text
copyButton.addEventListener('click', () => {
    const text = outputText.textContent;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Text copied to clipboard!");
        }).catch((err) => {
            alert("Failed to copy text.");
            console.error(err);
        });
    }
});

// Download Text
downloadButton.addEventListener('click', () => {
    const text = outputText.textContent;
    if (text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'extracted-text.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
});

function preprocessImage(image) {
    // Convert image to grayscale, adjust contrast, etc.
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0);

    // Get image data
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Loop through each pixel and apply preprocessing techniques (e.g., thresholding)
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        // Apply grayscale conversion formula
        let gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = gray;    // Red
        data[i + 1] = gray; // Green
        data[i + 2] = gray; // Blue
    }

    // Update canvas with the processed image
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();  // Return processed image as base64 string
}

function spellCheckAndCorrect(text) {
    // Using a basic spell-checking library or API call to correct the extracted text
    let correctedText = performSpellCheck(text); // Hypothetical function or external API
    return correctedText;
}


async function extractTextWithGoogleVision(base64Image) {
    const apiKey = 'YOUR_GOOGLE_CLOUD_VISION_API_KEY';
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
        "requests": [
            {
                "image": {
                    "content": base64Image.split(',')[1] // Exclude the base64 header
                },
                "features": [
                    {
                        "type": "TEXT_DETECTION"
                    }
                ]
            }
        ]
    };

    const response = await fetch(visionApiUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    return result.responses[0].textAnnotations[0].description;
}
