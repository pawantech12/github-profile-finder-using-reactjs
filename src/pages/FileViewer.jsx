import { useState } from "react";
import { FaArrowLeftLong, FaRegCopy } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Optional theme for code highlighting

const FileViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false); // State to show the copied message

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true); // Show "Copied" message
    setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
  };
  const handleDownload = (content, fileName) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url); // Clean up after download
  };

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
    <div className="bg-white p-4 mt-4">
      <button
        onClick={handleGoBack}
        className="text-gray-700 flex items-center gap-2  text-lg"
      >
        <FaArrowLeftLong />
        Go Back
      </button>
      <div className="border border-gray-200 rounded-md mt-3">
        <div className="px-5 py-2 flex justify-between items-center relative">
          <h2 className="text-lg font-bold">{fileName}</h2>
          <div className="flex items-center gap-3">
            <button
              className="border border-gray-200 p-2 rounded-md hover:bg-gray-200 transition-colors ease-in-out duration-200"
              onClick={() => handleCopy(fileContent)}
            >
              <FaRegCopy className="w-5 h-5" />
            </button>
            <button
              className="border border-gray-200 p-2 rounded-md hover:bg-gray-200 transition-colors ease-in-out duration-200"
              onClick={() => handleDownload(fileContent, fileName)}
            >
              <FiDownload className="w-5 h-5" />
            </button>
          </div>
          {copied && (
            <div className="absolute -top-9 right-12 mt-2 mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md">
              Copied!
            </div>
          )}
        </div>
        <hr />
        <div className="px-5 py-2">
          <SyntaxHighlighter
            language={fileLanguage}
            style={oneDark}
            showLineNumbers={true}
          >
            {fileContent}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
