export const generatePdf = async (element, filename) => {
  const html2pdf = (await import('html2pdf.js')).default;

  const options = {
    filename,
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      format: 'a4',
      orientation: 'portrait',
      unit: 'mm',
    },
    margin: [10, 10, 10, 10],
  };

  await html2pdf().set(options).from(element).save();
};
