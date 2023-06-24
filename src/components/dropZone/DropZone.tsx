import clsx from "clsx";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import { Check, Upload, X } from "react-feather";
import { useTranslation } from "react-i18next";
import { ListGroup, ListGroupItem } from "reactstrap";
import { truncate } from "../../utils/string";
import CustomButton from "../customButton/CustomButton";

const CustomDropZone = forwardRef(
  (
    props: {
      onConfirm: (data: any) => void;
      disabledState: boolean;
    },
    ref
  ) => {
    const { onConfirm, disabledState } = props;
    const { t } = useTranslation("common");
    const [listImage, setList] = useState<any>([]);
    const {
      isDragActive,
      isDragAccept,
      isDragReject,
      getRootProps,
      getInputProps,
    } = useDropzone({
      accept: {
        // "image/jpeg": [],
        // "image/png": [],
        // "image/jpg": [],
        // "image/webp": [],
        // "image/heic": [],
      },
      multiple: true,
      disabled: disabledState,
      onDrop: async (acceptedFiles) => {
        let temp_file = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        let listFile = listImage;
        listFile.push(temp_file[0]);
        setList([...listFile]);
        if (onConfirm) {
          onConfirm(listFile);
        }
      },
    });

    useImperativeHandle(ref, () => ({
      handleClearImage() {
        setList([]);
      },
    }));

    const files = listImage.map(
      (
        file: {
          path: string;
          preview: string;
        },
        index: number
      ) => (
        <ListGroupItem
          className="font-size-sm px-3 py-2 text-success d-flex justify-content-between align-items-center"
          key={file.path + index}
        >
          <div className="d-50 rounded overflow-hidden">
            <img src={file.preview} alt="" className="img-fit-container" />
          </div>
          <span>{truncate(file.path, 15)}</span>{" "}
          <CustomButton
            onClick={() => handleRemove(index)}
            color="neutral-danger"
            id={"deleteDropZone" + index}
            icon={<X size={16} />}
            tooltip={"Xoá ảnh"}
          />
        </ListGroupItem>
      )
    );

    const handleRemove = (index: number) => {
      let temp_list = listImage.filter(
        (_item: any, idx: number) => idx !== index
      );
      setList([...temp_list]);
      onConfirm(temp_list);
    };

    return (
      <>
        <div className="dropzone">
          <div {...getRootProps({ className: "dropzone-upload-wrapper" })}>
            <input {...getInputProps()} />
            <div className="dropzone-inner-wrapper bg-white">
              {isDragAccept && (
                <div>
                  <div className="d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-success mx-auto">
                    <svg
                      className="d-140 opacity-2"
                      viewBox="0 0 600 600"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(300,300)">
                        <path
                          d="M170.4,-137.2C213.2,-82.3,234.8,-11.9,223.6,56.7C212.4,125.2,168.5,191.9,104.3,226.6C40.2,261.3,-44.1,264,-104,229.8C-163.9,195.7,-199.4,124.6,-216.2,49.8C-233,-25.1,-231,-103.9,-191.9,-158C-152.7,-212.1,-76.4,-241.6,-6.3,-236.6C63.8,-231.6,127.7,-192.2,170.4,-137.2Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                    <div className="blob-icon-wrapper">
                      <Check className="d-50" />
                    </div>
                  </div>
                  <div className="font-size-sm text-success">
                    All files will be uploaded!
                  </div>
                </div>
              )}
              {isDragReject && (
                <div>
                  <div className="d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-danger mx-auto">
                    <svg
                      className="d-140 opacity-2"
                      viewBox="0 0 600 600"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(300,300)">
                        <path
                          d="M169,-144C206.7,-87.5,216.5,-18,196.9,35.7C177.3,89.4,128.3,127.1,75.2,150.7C22,174.2,-35.4,183.5,-79.7,163.1C-124,142.7,-155.1,92.6,-164.1,40.9C-173.1,-10.7,-160.1,-64,-129,-118.9C-98,-173.8,-49,-230.4,8.3,-237.1C65.7,-243.7,131.3,-200.4,169,-144Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                    <div className="blob-icon-wrapper">
                      <X className="d-50" />
                    </div>
                  </div>
                  <div className="font-size-sm text-danger">
                    Some files will be rejected!
                  </div>
                </div>
              )}
              {!isDragActive && (
                <div>
                  <div
                    className={clsx(
                      "d-140 hover-scale-lg icon-blob btn-icon  mx-auto",
                      {
                        "text-first": !disabledState,
                        "text-danger": disabledState,
                      }
                    )}
                  >
                    <svg
                      className="d-140 opacity-2"
                      viewBox="0 0 600 600"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(300,300)">
                        <path
                          d="M171.2,-128.5C210.5,-87.2,223.2,-16.7,205.1,40.4C186.9,97.5,137.9,141.1,81.7,167.2C25.5,193.4,-38,202.1,-96.1,181.2C-154.1,160.3,-206.7,109.7,-217.3,52.7C-227.9,-4.4,-196.4,-68,-153.2,-110.2C-110,-152.4,-55,-173.2,5.5,-177.5C65.9,-181.9,131.9,-169.8,171.2,-128.5Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                    <div className="blob-icon-wrapper">
                      <Upload className="d-50" />
                    </div>
                  </div>
                  <div className="font-size-sm">
                    {/* {!disabledState ? t("drag") : t("maxImg")} */}
                    {!disabledState ? t("drag") : t("maxImg")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          {files.length > 0 && (
            <div className="font-weight-bold my-4 text-uppercase text-dark font-size-sm text-center">
              {t("uploaded")}
            </div>
          )}
          {files.length > 0 && (
            <div>
              <ListGroup className="font-size-sm">{files}</ListGroup>
            </div>
          )}
        </div>
      </>
    );
  }
);
export default CustomDropZone;
