document.addEventListener('DOMContentLoaded', () => {
    const qrType = document.getElementById('qrType');
    const dynamicContent = document.getElementById('dynamic-content');
    const fgColorInput = document.getElementById('fgColor');
    const bgColorInput = document.getElementById('bgColor');
    const qrStyle = document.getElementById('qrStyle');
    const logoUpload = document.getElementById('logoUpload');
    const generateBtn = document.getElementById('generateBtn');
    const qrPreview = document.getElementById('qr-preview');

    let qrCode;

    function updateDynamicContent() {
        const type = qrType.value;
        let label = '';
        let placeholder = '';

        switch (type) {
            case 'url':
                label = 'Enter URL:';
                placeholder = 'https://example.com';
                break;
            case 'text':
                label = 'Enter Text:';
                placeholder = 'Type your text';
                break;
            case 'email':
                label = 'Enter Email:';
                placeholder = 'you@example.com';
                break;
            case 'phone':
                label = 'Enter Phone Number:';
                placeholder = '+1234567890';
                break;
            case 'sms':
                label = 'Enter SMS Text:';
                placeholder = 'Your SMS text here';
                break;
        }

        dynamicContent.innerHTML = `
            <label for="content">${label}</label>
            <input type="text" id="content" placeholder="${placeholder}">
        `;
    }

    function generateQRCode() {
        const content = document.getElementById('content').value;
        const fgColor = fgColorInput.value;
        const bgColor = bgColorInput.value;
        const selectedStyle = qrStyle.value;
        const selectedSize = parseInt(document.getElementById('qrSize').value);
        const selectedVersion = parseInt(document.getElementById('qrVersion').value);
        const selectedMask = document.getElementById('qrMask').value;

        if (!content) {
            alert('Please enter content for the QR code.');
            return;
        }

        qrPreview.innerHTML = ''; // Clear the previous QR code

        const qrOptions = {
            text: content,
            width: selectedSize,
            height: selectedSize,
            colorDark: fgColor,
            colorLight: bgColor,
            correctLevel: QRCode.CorrectLevel.H,
            version: selectedVersion
        };

        // Add logo if uploaded
        const logoFile = logoUpload.files[0];
        if (logoFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function () {
                    const ctx = qrPreview.querySelector('canvas').getContext('2d');
                    const imgSize = 64;
                    ctx.drawImage(img, (qrOptions.width - imgSize) / 2, (qrOptions.height - imgSize) / 2, imgSize, imgSize);
                };
            };
            reader.readAsDataURL(logoFile);
        }

        // Apply style based on selection
        switch (selectedStyle) {
            case 'rounded':
                qrOptions.shape = 'rounded';
                break;
            case 'dots':
                qrOptions.shape = 'dots';
                break;
            case 'square-eyes':
                qrOptions.shape = 'square-eyes';
                break;
        }

        qrCode = new QRCode(qrPreview, qrOptions);
        applyMask(selectedMask);
    }


    // Function to apply mask to the QR code
    function applyMask(maskType) {
        // Here, you can implement logic to change the QR code appearance based on selected mask
        const qrCanvas = qrPreview.querySelector('canvas');
        if (qrCanvas) {
            const ctx = qrCanvas.getContext('2d');

            // Example logic to apply a mask (you'll need to customize these masks)
            switch (maskType) {
                case 'mask1':
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red overlay as an example
                    ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
                    break;
                case 'mask2':
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'; // Green overlay
                    ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
                    break;
                case 'mask3':
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'; // Blue overlay
                    ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
                    break;
                case 'mask4':
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Yellow overlay
                    ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
                    break;
                case 'mask5':
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Yellow overlay
                    ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
                    break;
                default:
                    // No mask applied
                    break;
            }
        }
    }

    // Event listeners
    qrType.addEventListener('change', updateDynamicContent);
    generateBtn.addEventListener('click', generateQRCode);
    // Function to update the color preview
    function updateColorPreview(input, preview) {
        preview.style.backgroundColor = input.value; // Update the preview with the selected color
    }

    // Event listeners for color inputs
    fgColorInput.addEventListener('input', function () {
        updateColorPreview(fgColorInput, fgPreview);
    });

    // Initial call to set the preview for the default color
    updateColorPreview(fgColorInput, fgPreview);


    // Event listeners for color inputs
    bgColorInput.addEventListener('input', function () {
        updateColorPreview(bgColorInput, bgPreview);
    });

    // Initial call to set the preview for the default color
    updateColorPreview(bgColorInput, bgPreview);


    updateDynamicContent(); // Initialize default content type

    // Function to download the QR code as PNG
    function downloadPNG() {
        const canvas = qrPreview.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'qr_code.png';
            link.click();
        } else {
            alert('Please generate a QR code first.');
        }
    }

    // Function to download the QR code as SVG
    function downloadSVG() {
        const svgData = qrCode._el.firstChild.outerHTML; // Get the SVG data
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'qr_code.svg';
        link.click();
    }

    // Add event listeners for download buttons
    document.getElementById('downloadPNG').addEventListener('click', downloadPNG);
    document.getElementById('downloadSVG').addEventListener('click', downloadSVG);

});


