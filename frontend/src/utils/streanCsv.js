// utils/loadData.js
import Papa from "papaparse";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const loadCsvFile = (csvFilePath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: function (results) {
        // TODO
        resolve(results.data); // Return the parsed data
        // resolve(results.data.slice(0, 1000)); // Return the parsed data
      },
      error: function (err) {
        reject(err); // Reject on error
      },
    });
  });
};
export const csvFileDownload = (fileUrl) => {
  console.log("Downloading File");

  try {
    // Create a temporary link element for downloading the CSV file
    const a = document.createElement("a");
    a.href = fileUrl; // Set the href to the CSV file URL
    a.download = fileUrl.split("/").pop(); // Use the file name from the URL

    // Append the anchor to the body (needed for Firefox)
    document.body.appendChild(a);

    // Trigger the download by simulating a click on the anchor
    a.click();

    // Clean up by removing the anchor from the document
    a.remove();
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error downloading the CSV file:", error);
  }
};
// export const csvVariableDownload = (csvData) => {
//     console.log("Downloading Var");
//     try {
//         // Create a Blob from the CSV data
//         const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

//         // Create a temporary link element for downloading the CSV file
//         const a = document.createElement('a');
//         const url = URL.createObjectURL(blob); // Generate a URL for the Blob
//         a.href = url;
//         a.download = 'data.csv'; // Set a default name for the downloaded file

//         // Append the anchor to the body (needed for Firefox)
//         document.body.appendChild(a);

//         // Trigger the download by simulating a click on the anchor
//         a.click();

//         // Clean up by revoking the object URL and removing the anchor
//         URL.revokeObjectURL(url);
//         a.remove();
//     } catch (error) {
//         // Log any errors that occur during the process
//         console.error("Error downloading the CSV file:", error);
//     }
// };

// export const csvVariableDownload = (csvData) => {
//   console.log("Downloading filtered CSV");
//
//   try {
//     console.log(csvData);
//     // Convert JSON data to CSV format using Papa.unparse
//     const csvString = Papa.unparse(csvData);
//
//     // Create a Blob from the CSV string
//     const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//
//     // Create a temporary link element for downloading the CSV file
//     const a = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     a.href = url;
//     a.download = "filtered_data.csv"; // Set a default name for the downloaded file
//
//     // Append and trigger download, then clean up
//     document.body.appendChild(a);
//     a.click();
//     URL.revokeObjectURL(url);
//     a.remove();
//   } catch (error) {
//     console.error("Error downloading the CSV file:", error);
//   }
// };

export const csvVariableDownload = (csvData) => {
  console.log("Downloading filtered CSV");

  try {
    console.log(csvData);

    // Convert JSON data to CSV format with proper quoting
    const csvString = Papa.unparse(csvData, {
      quotes: true, // Ensures all fields are enclosed in double quotes
      delimiter: ",", // Explicitly set CSV separator as comma
      newline: "\r\n", // Ensures proper line breaks for Excel compatibility
      encoding: "utf-8",
    });

    // Add UTF-8 BOM to prevent Excel encoding issues
    const utf8Bom = "\uFEFF" + csvString;

    // Create a Blob with UTF-8 encoding
    const blob = new Blob([utf8Bom], { type: "text/csv;charset=utf-8;" });

    // Create a temporary link element for downloading the CSV file
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "filtered_data.csv"; // Set a default name for the downloaded file

    // Append and trigger download, then clean up
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error("Error downloading the CSV file:", error);
  }
};

// Download all data from backend (streaming)
export const downloadAllData = async (dataType) => {
  console.log(`Downloading all ${dataType} data from backend...`);

  try {
    const endpoint = dataType === 'telegram'
      ? `${API_URL}/api/export/telegram/all`
      : `${API_URL}/api/export/twitter/all`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}_export.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    console.log(`✅ ${dataType} data downloaded successfully`);
  } catch (error) {
    console.error(`Error downloading ${dataType} data:`, error);
    throw error;
  }
};

// Download filtered data from backend (streaming)
export const downloadFilteredData = async (dataType, filters) => {
  console.log(`Downloading filtered ${dataType} data from backend...`, filters);

  try {
    const endpoint = dataType === 'telegram'
      ? `${API_URL}/api/export/telegram/filtered`
      : `${API_URL}/api/export/twitter/filtered`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}_filtered.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    console.log(`✅ Filtered ${dataType} data downloaded successfully`);
  } catch (error) {
    console.error(`Error downloading filtered ${dataType} data:`, error);
    throw error;
  }
};

// Fetch metadata (channels, users, stats)
export const fetchMetadata = async (dataType, metadataType) => {
  try {
    const endpoint = dataType === 'telegram'
      ? `${API_URL}/api/metadata/telegram/${metadataType}`
      : `${API_URL}/api/metadata/twitter/${metadataType}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${metadataType}:`, error);
    throw error;
  }
};

// Fetch statistics
export const fetchStats = async (dataType) => {
  try {
    const endpoint = `${API_URL}/api/stats/${dataType}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${dataType} stats:`, error);
    throw error;
  }
};

// Fetch paginated data with filters
export const fetchPaginatedData = async (dataType, page = 1, limit = 50, filters = {}) => {
  try {
    const endpoint = dataType === 'telegram'
      ? `${API_URL}/api/paginate/telegram`
      : `${API_URL}/api/paginate/twitter`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page,
        limit,
        ...filters,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching paginated ${dataType} data:`, error);
    throw error;
  }
};
