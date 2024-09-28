document.getElementById('fileInput').addEventListener('change', function () {
    document.getElementById('convertButton').disabled = !this.files.length;
});

document.getElementById('convertButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const bgRemove = document.getElementById('bgRemove').checked;
    const outputFormat = document.getElementById('outputFormat').value;
    if (files.length > 0) {
        const status = document.getElementById('status');
        const progressBar = document.getElementById('progressBar').firstElementChild;
        status.textContent = 'Converting...';
        progressBar.style.width = '0%';

        const promises = [];
        for (let i = 0; i < files.length; i++) {
            promises.push(convertImage(files[i], outputFormat, bgRemove));
        }

        Promise.all(promises).then(() => {
            status.textContent = 'Conversion Completed';
            progressBar.style.width = '100%';
        }).catch(err => {
            status.textContent = `Error: ${err}`;
        });
    }
});

function convertImage(file, outputFormat, bgRemove) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (bgRemove && (file.type === 'image/jpeg' || file.type === 'image/jpg') && outputFormat === 'png') {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                ctx.drawImage(img, 0, 0);

                let format = 'image/jpeg';
                let extension = 'jpg';
                if (outputFormat === 'png') {
                    format = 'image/png';
                    extension = 'png';
                } else if (outputFormat === 'bmp') {
                    format = 'image/bmp';
                    extension = 'bmp';
                } else if (outputFormat === 'gif') {
                    format = 'image/gif';
                    extension = 'gif';
                } else if (outputFormat === 'pdf') {
                    format = 'application/pdf';
                    extension = 'pdf';
                }

                if (outputFormat === 'pdf') {
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF();
                    pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, canvas.width, canvas.height);
                    const pdfBlob = pdf.output('blob');
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(pdfBlob);
                    link.download = file.name.replace(/\.[^.]+$/, `.${extension}`);
                    link.click();
                    resolve();
                } else {
                    canvas.toBlob(function (blob) {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = file.name.replace(/\.[^.]+$/, `.${extension}`);
                        link.click();
                        resolve();
                    }, format);
                }
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
