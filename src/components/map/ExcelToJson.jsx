import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelToJson = () => {
   const [jsonData, setJsonData] = useState(null);

   const handleFileUpload = (event) => {
      const file = event.target.files[0];

      if (file) {
         const reader = new FileReader();

         reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Check if there are at least two sheets
            if (workbook.SheetNames.length < 2) {
               alert('The file must contain at least two sheets.');
               return;
            }

            // Assuming the data is in the secon sheet
            const sheetName = workbook.SheetNames[1];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const json = XLSX.utils.sheet_to_json(worksheet);
            setJsonData(json);
         };

         reader.readAsArrayBuffer(file);
      }
   };

   return (
      <div>
         <h2>Excel to JSON Converter</h2>
         <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
         {jsonData && (
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
         )}
      </div>
   );
};

export default ExcelToJson;
