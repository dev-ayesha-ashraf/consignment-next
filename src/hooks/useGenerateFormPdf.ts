import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useGenerateFormPdf = () => {
  const generatePdf = useCallback(async (formData: any) => {
    try {
    
      const logoSrc = '/image.png'; 
      const logoBase64 = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.src = logoSrc;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '100%'; 
      document.body.appendChild(container);

      container.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; display: flex; justify-content: center; align-items: ceter; flex-direction: column; class="Pdf">
           <h1 style="text-align: center; font-size: 28px; margin-bottom: 20px; font-weight: bold;font-style: italic;">Receipt</h1>
          <div style="text-align: center; justify-content: center; display: flex; align-items: center">
            <img src="${logoBase64}" alt="Logo" style="width: 220px; height: 150px; margin-bottom: 20px;" />
          </div>
          <h2>Pick-Up Details</h2>
          <p><strong>Name:</strong> ${formData.pickUp.name}</p>
          <p><strong>Phone:</strong> ${formData.pickUp.phone}</p>
          <hr>
          <h2>Drop-Off Details</h2>
          <p><strong>Name:</strong> ${formData.dropOff.name}</p>
          <p><strong>Phone:</strong> ${formData.dropOff.phone}</p>
          <hr>
          <h2>Consignment Details</h2>
          <p><strong>Weight:</strong> ${formData.weight}</p>
          <p><strong>COD:</strong> ${formData.COD}</p>
          <p><strong>Total Price:</strong> ${(formData.weight * 10).toFixed(2)}</p>
    <p><strong>Date:</strong> ${formData.date}</p>
          <p><strong>Day:</strong> ${formData.day}</p>
        </div>
      `;

      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p', 
        unit: 'mm',
        format: 'a4', 
      });

      const imgWidth = 210; 
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('consignment-receipt.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } 
  }, []);

  return { generatePdf };
};

export default useGenerateFormPdf;
