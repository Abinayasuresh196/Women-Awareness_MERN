import jsPDF from "jspdf";

const FIRGenerator = ({ firData }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 10;

    Object.entries(firData).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 10, y);
      y += 10;
    });

    doc.save("FIR_Report.pdf");
  };

  return (
    <button onClick={generatePDF} className="btn">
      Download FIR PDF
    </button>
  );
};

export default FIRGenerator;
