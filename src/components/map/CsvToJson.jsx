import React, { useState } from 'react';
import Papa from 'papaparse';

const CsvToJson = () => {
      const [jsonData, setJsonData] = useState(null);

      const handleFileChange = (event) => {
            const file = event.target.files[0];

            if (file) {
                  Papa.parse(file, {
                        header: true,  // Treats the first row as headers
                        skipEmptyLines: true, // Skips empty lines
                        complete: function (results) {
                              setJsonData(results.data);
                        }
                  });
            }
      };

      return (
            <div>
                  <h2>CSV to JSON Converter</h2>
                  <input type="file" accept=".csv" onChange={handleFileChange} />
                  {jsonData && (
                        <pre>{JSON.stringify(jsonData, null, 2)}</pre>  // Display the JSON with formatting
                  )}
            </div>
      );
};

export default CsvToJson;
