import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setZoomIndex(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleExtract = async () => {
        if (!file) {
            toast.error("Please select a file before extracting text.", { autoClose: 3000 });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setResponse(response.data);
        } catch (error) {
            console.error("Error extracting text:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleZoomImage = (index) => {
        setZoomIndex(index);
    };

    const handleCloseModal = () => {
        setZoomIndex(null);
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner-border text-primary shadow" style={{ width: '300px', height: '300px' }} role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            )}
            <div className={`row ${loading ? 'blur' : ''}`}>
                <div className="col-md-10 offset-md-1">
                    <input type="file" className="form-control" onChange={handleFileChange} />
                    <button className="btn btn-primary mt-3" onClick={handleExtract}>
                        Extract Text
                    </button>
                    {response.map((item, index) => (
                        <div key={index} className="mt-4">
                            <h5>{item.image_path.split("/").pop()}</h5>
                            <img
                                src={`http://localhost:5000/${item.image_path}`}
                                alt=""
                                className="img-fluid rounded"
                                style={{ boxShadow: "0px 2px 10px white", cursor: "pointer" }}
                                width={400}
                                onClick={() => handleZoomImage(index)}
                            />
                            <div className="input-group mt-2">
                                <textarea
                                    className="form-control"
                                    rows={10}
                                    value={item.response}
                                    readOnly
                                    style={{ textAlign: "left" }}
                                />
                            </div><br />
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    navigator.clipboard.writeText(item.response);
                                    toast.success("Text copied to clipboard.");
                                }}
                                style={{ zIndex: 0.9, color: 'white', background: 'black' }}
                            >
                                Copy to Clipboard
                            </button>
                            <hr></hr>
                        </div>
                    ))}
                    {zoomIndex !== null && (
                        <div className="modal-backdrop">
                            <div className="modal-content">
                                <img
                                    src={`http://localhost:5000/${response[zoomIndex].image_path}`}
                                    alt=""
                                    className="img-fluid"
                                    style={{ maxHeight: "100vh" }}
                                />
                                <button className="btn btn-danger" onClick={handleCloseModal}>Close</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
