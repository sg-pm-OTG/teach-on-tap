import { Navigate } from "react-router-dom";

// Upload page now redirects to the unified Record page
// which supports both recording and uploading
const Upload = () => {
  return <Navigate to="/record" replace />;
};

export default Upload;
