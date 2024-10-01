import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Optional theme for code highlighting

const FileViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract file data from location state
  const { fileContent, fileName, fileLanguage } = location.state || {
    fileContent: "",
    fileName: "File Not Found",
    fileLanguage: "plaintext",
  };
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div className="bg-white p-4 rounded shadow-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Viewing: {fileName}</h2>
      <button
        onClick={handleGoBack}
        className="text-blue-500 mb-4 hover:underline"
      >
        ⬅️ Back
      </button>
      <SyntaxHighlighter language={fileLanguage} style={oneDark}>
        {fileContent}
      </SyntaxHighlighter>
    </div>
  );
};

export default FileViewer;
