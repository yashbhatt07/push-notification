import { useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { EditById } from "../API/API";
import { useParams } from "react-router-dom";

export const Dropzone = () => {
  const [files, setFiles] = useState([]);
  const params = useParams();
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles?.length) {
        const updatedFiles = [
          ...files,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ];
        setFiles(updatedFiles);

        try {
          const admin = params.id;
          const updatedData = {
            gallery: updatedFiles.map((file) => file.preview),
          };
          await EditById(admin, updatedData);
        } catch (error) {
          console.error(error);
        }
      }

      console.log(
        "🚀 ~ file: DropZone.jsx:8 ~ onDrop ~ acceptedFiles:",
        acceptedFiles
      );
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });
  const removeImage = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  return (
    <div style={{ width: "100%", height: "460px" }}>
      <h4 style={{ color: "burlywood" }}>Upload Image</h4>

      <div
        {...getRootProps()}
        className="text-white drag-box"
        style={{ width: "50%" }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-white">Drop the files here ...</p>
        ) : (
          <p className="text-white">
            Drag drop some files here, or click to select files
          </p>
        )}
      </div>

      <ul className="text-white drop-list">
        {files.map((file, index) => (
          <li key={index}>
            <img
              src={file.preview}
              alt="image"
              width={100}
              height={100}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            />
            <Button
              onClick={() => removeImage(index)}
              type="button"
              className=" btn-outline-dark btn-sm"
            >
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
