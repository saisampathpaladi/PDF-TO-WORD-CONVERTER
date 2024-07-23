document.getElementById('fileInput').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];
        document.getElementById('conversionOptions').classList.remove('hidden');

        if (file.type === 'application/pdf') {
            showPdfToWordOptions(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            showWordToPdfOptions(file);
        } else {
            showChangeExtensionOptions(file);
        }
    }
}

function showPdfToWordOptions(file) {
    document.getElementById('pdfToWordOptions').classList.remove('hidden');
    document.getElementById('wordToPdfOptions').classList.add('hidden');
    document.getElementById('changeExtensionOptions').classList.add('hidden');
    
    document.getElementById('convertPdfToWord').onclick = () => {
        convertPdfToWord(file);
    };
}

async function convertPdfToWord(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const wordBuffer = await pdfDoc.saveAsBase64({ dataUri: true });
    
    const link = document.createElement('a');
    link.href = wordBuffer;
    link.download = 'converted-word.docx';
    link.click();
}

function showWordToPdfOptions(file) {
    document.getElementById('pdfToWordOptions').classList.add('hidden');
    document.getElementById('wordToPdfOptions').classList.remove('hidden');
    document.getElementById('changeExtensionOptions').classList.add('hidden');
    
    document.getElementById('convertWordToPdf').onclick = () => {
        convertWordToPdf(file);
    };
}

function convertWordToPdf(file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const pdfDoc = await PDFLib.PDFDocument.create();
        const wordToPdf = await mammoth.convertToPdf({ arrayBuffer });
        const pdfBytes = await pdfDoc.save();
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
        link.download = 'converted-pdf.pdf';
        link.click();
    };
    reader.readAsArrayBuffer(file);
}

function showChangeExtensionOptions(file) {
    document.getElementById('pdfToWordOptions').classList.add('hidden');
    document.getElementById('wordToPdfOptions').classList.add('hidden');
    document.getElementById('changeExtensionOptions').classList.remove('hidden');
    
    document.getElementById('changeExtension').onclick = () => {
        const newExtension = document.getElementById('newExtension').value;
        changeExtension(file, newExtension);
    };
}

function changeExtension(file, newExtension) {
    const blob = file.slice(0, file.size, file.type);
    const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, `.${newExtension}`), { type: file.type });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(newFile);
    link.download = newFile.name;
    link.click();
}

