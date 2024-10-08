function generateCertificate(template = 'default', recipientName, courseTitle, issueDate, certificateNumber, signatory) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
    });

    // Apply template styles
    // Apply template styles

    switch (template) {
        case 'classic':
            pdf.setFillColor(230, 230, 250);
            pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');

            pdf.setFontSize(30);
            pdf.setFont("helvetica", "bold");
            pdf.text("CERTIFICATE OF COMPLETION", pdf.internal.pageSize.getWidth() / 2, 70, { align: "center" });

            pdf.setLineWidth(1);
            pdf.setDrawColor(0, 0, 0);
            pdf.rect(30, 30, pdf.internal.pageSize.getWidth() - 60, pdf.internal.pageSize.getHeight() - 60);

            pdf.setFontSize(20);
            pdf.setFont("helvetica", "normal");
            pdf.text(`This is to certify that`, pdf.internal.pageSize.getWidth() / 2, 130, { align: "center" });

            pdf.setFontSize(28);
            pdf.setFont("helvetica", "bold");
            pdf.text(recipientName, pdf.internal.pageSize.getWidth() / 2, 180, { align: "center" });

            pdf.setFontSize(20);
            pdf.setFont("helvetica", "normal");
            pdf.text(`has successfully completed the course`, pdf.internal.pageSize.getWidth() / 2, 230, { align: "center" });

            pdf.setFontSize(28);
            pdf.setFont("helvetica", "bold");
            pdf.text(courseTitle, pdf.internal.pageSize.getWidth() / 2, 280, { align: "center" });

            pdf.setFontSize(20);
            pdf.setFont("helvetica", "normal");
            pdf.text(`on ${issueDate}`, pdf.internal.pageSize.getWidth() / 2, 330, { align: "center" });

            pdf.setFontSize(14);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Certificate Number: ${certificateNumber}`, 60, 380);
            pdf.text(`Signatory: ${signatory}`, 60, 430);

            break;

        case 'modern':

            pdf.setFillColor(255, 248, 220);
            pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');

            pdf.setFontSize(24);
            pdf.setFont("times", "italic");
            pdf.text("ACHIEVEMENT AWARD", pdf.internal.pageSize.getWidth() / 2, 80, { align: "center" });

            pdf.setLineWidth(2);
            pdf.setDrawColor(128, 0, 128);
            pdf.rect(40, 40, pdf.internal.pageSize.getWidth() - 80, pdf.internal.pageSize.getHeight() - 80);

            // Certificate content
            pdf.setFontSize(20);
            pdf.setFont("times", "italic");
            pdf.text("This is presented to:", pdf.internal.pageSize.getWidth() / 2, 120, { align: "center" });

            pdf.setFontSize(28);
            pdf.setFont("times", "bold");
            pdf.text(recipientName, pdf.internal.pageSize.getWidth() / 2, 170, { align: "center" });

            pdf.setFontSize(18);
            pdf.setFont("times", "italic");
            pdf.text("for completing a four-month internship as a graphic designer at", pdf.internal.pageSize.getWidth() / 2, 220, { align: "center" });

            pdf.setFontSize(18);
            pdf.setFont("times", "italic");
            pdf.text("SrimberioFradel and Spies Co.", pdf.internal.pageSize.getWidth() / 2, 260, { align: "center" });

            pdf.setFontSize(16);
            pdf.setFont("times", "bold");
            pdf.text("Howard Ong", pdf.internal.pageSize.getWidth() / 4, 360, { align: "center" });
            pdf.setFontSize(14);
            pdf.setFont("times", "italic");
            pdf.text("School Principal", pdf.internal.pageSize.getWidth() / 4, 380, { align: "center" });

            pdf.setFontSize(16);
            pdf.setFont("times", "bold");
            pdf.text("Chiaki Sato", (pdf.internal.pageSize.getWidth() / 4) * 3, 360, { align: "center" });
            pdf.setFontSize(14);
            pdf.setFont("times", "italic");
            pdf.text("Coordinator", (pdf.internal.pageSize.getWidth() / 4) * 3, 380, { align: "center" });

            pdf.setFontSize(14);
            pdf.setFont("times", "normal");
            pdf.text(`Certificate Number: ${certificateNumber}`, 60, 420);
            pdf.text(`Signatory: ${signatory}`, 60, 440);

              break;
    }

    return pdf;
}



function startProcess() {
    const numberOfCertificates = parseInt(document.getElementById('numberOfCertificates').value);
    const template = document.getElementById('template').value;

    // Collect common details
    const courseTitle = document.getElementById('courseTitle').value;
    const issueDate = document.getElementById('issueDate').value;
    const signatory = document.getElementById('signatory').value;

    certificatesData = [];

    for (let i = 0; i < numberOfCertificates; i++) {
        const recipientName = prompt(`Enter the recipient name for certificate ${i + 1}:`);
        const certificateNumber = prompt(`Enter the certificate number for certificate ${i + 1}:`);

        certificatesData.push({
            template,
            recipientName,
            courseTitle,
            issueDate,
            certificateNumber,
            signatory
        });
    }

    // Show details for confirmation
    showConfirmation();
}

function showConfirmation() {
    const previewContainer = document.getElementById('certificatePreview');
    previewContainer.innerHTML = '';

    certificatesData.forEach((data, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>Certificate ${index + 1}</h3>
            <p>Recipient Name: ${data.recipientName}</p>
            <p>Course Title: ${data.courseTitle}</p>
            <p>Issue Date: ${data.issueDate}</p>
            <p>Certificate Number: ${data.certificateNumber}</p>
            <p>Signatory: ${data.signatory}</p>
            <button onclick="editCertificate(${index})">Edit</button>
            <button onclick="removeCertificate(${index})">Remove</button>
        `;
        previewContainer.appendChild(div);
    });

    const generateButton = document.createElement('button');
    generateButton.innerText = 'Generate Certificates';
    generateButton.onclick = generateAllCertificates;
    previewContainer.appendChild(generateButton);
}

function editCertificate(index) {
    const data = certificatesData[index];
    data.recipientName = prompt('Enter the recipient name:', data.recipientName);
    data.certificateNumber = prompt('Enter the certificate number:', data.certificateNumber);
    showConfirmation();
}

function removeCertificate(index) {
    certificatesData.splice(index, 1);
    showConfirmation();
}


function generateAllCertificates() {
    const previewContainer = document.getElementById('certificatePreview');
    previewContainer.innerHTML = '';

    certificatesData.forEach(data => {
        const pdf = generateCertificate(data.template, data.recipientName, data.courseTitle, data.issueDate, data.certificateNumber, data.signatory);

        const iframe = document.createElement('iframe');
        iframe.src = pdf.output('datauristring');
        iframe.width = '100%';
        iframe.height = '500px';
        previewContainer.appendChild(iframe);
    })
}

// Function to download the certificate[^1^][1]
function downloadCertificate(template = 'default') {

    generateCertificate(template); // Generate the certificate[^47^][47]

    // Save the PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({

        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
    });
    pdf.save('certificate.pdf');
}