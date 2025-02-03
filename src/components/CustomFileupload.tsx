import { X } from "lucide-react";
import React, { useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import CustomButton from "./Button";
import classNames from "classnames";

const FileNameBadge = ({
  file,
  handleUnselect,
  disabled,
}: {
  file: any | { name: string; url: string };
  handleUnselect: (file: File | { name: string }) => void;
  disabled?: boolean;
}) => {
  return (
    <Badge
      variant="secondary"
      key={file.name}
      className={classNames("mr-1 mb-1 !bg-cedarChest")}
    >
      {file.name}
      {!disabled && (
        <button
          className="ml-1 rounded-full p-[0.125rem] bg-clearSky hover:border-cedarChest outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => {
            handleUnselect(file);
          }}
        >
          <X className="h-3 w-3 text-black hover:text-foreground" />
        </button>
      )}
    </Badge>
  );
};
interface FileUploadProps {
  onFileUpload: (file: File[]) => void;
  attachmentFile: any;
  disabled?: boolean;
  fileLimit?: number;
  attachmentText?: string;
  allowedFileTypes?: string[];
  allowMultiple?: boolean;
  browseButtonClassName?: string;
  containerClassName?: string
}
const defaultAllowedFileTypes = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];
const CustomFileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  attachmentFile,
  disabled,
  fileLimit = 100,
  attachmentText,
  allowedFileTypes = defaultAllowedFileTypes,
  allowMultiple = true,
  browseButtonClassName,
  containerClassName
}) => {
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFiles = files;
      const allowedFiles = Array.from(selectedFiles).filter(
        (selectedFile) =>
          selectedFile.size <= 10 * 1024 * 1024 &&
          allowedFileTypes.includes(selectedFile.type),
      );
      if (allowedFiles.length != selectedFiles.length) {
        if (
          Array.from(selectedFiles).some(
            (selectedFile) => !allowedFileTypes.includes(selectedFile.type),
          )
        )
          console.log("File type not supported.");
        else console.log("Files larger than 10 MB are not allowed.");
      }
      onFileUpload([
        ...(attachmentFile ? Array.from(attachmentFile as FileList) : []),
        ...allowedFiles,
      ]);
      // if (
      //   selectedFile.size <= 10 * 1024 * 1024 &&
      //   allowedFileTypes.includes(selectedFile.type)
      // ) {
      //   const file = event.target.files?.[0];
      //   if (!file) return;
      //   // const result = profileImageSchema.safeParse(file);
      //   // if (!result.success) {
      //   //   setError(result.error.issues[0].message);
      //   //   return;
      //   // } else {
      //   //   setError(undefined);
      //   //   file = result.data;
      //   // }
      //   // fileInputRef.current = file;
      //   // setError(undefined);
      //   // if (url) {
      //   //     setSrc(url);
      //   //     setHasImage(true);
      //   // }
      //   onFileUpload(selectedFile);
      // } else {
      //   console.error(
      //     "Invalid file. Please select a file up to 10MB with the allowed file types.",
      //   );
      // }
    }
    event.target.files = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // const filesName = useMemo<(typeof FileNameBadge)[]>(() => {
  //   return Array.from(attachmentFile as FileList).map((file: File) => (
  //     <FileNameBadge file={file}></FileNameBadge>
  //   ));
  // }, [attachmentFile]);

  const handleUnselect = useCallback(
    (removeFile: File | { name: string }) => {
      if (attachmentFile) {
        const newFiles = Array.from(attachmentFile as FileList).filter(
          (file: File) => removeFile.name !== file.name,
        );
        onFileUpload(newFiles);
      }
    },
    [attachmentFile],
  );
  const handleDeleteFile = useCallback(
    (removeFile: File | { name: string; key: string }) => {
      handleUnselect(removeFile);
    },
    [id, attachmentFile],
  );

  return (
    <>
      <div className="flex-1">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
          accept=".pdf,.xls,.xlsx,.csv"
          multiple={allowMultiple}
        />
        <div className={classNames(containerClassName, "flex items-center rounded-md gap-2 bg-clearSky flex-grow mx-2 dark:bg-holly text-white p-2 hover:bg-primaryLight")}>
          {!disabled &&
            (attachmentFile != null
              ? Array.from(attachmentFile as FileList)?.length
              : 0) < fileLimit && (
              <CustomButton
                title={"Browse"}
                className={classNames(browseButtonClassName, "bg-primaryIndigo hover:bg-navyLight")}
                onClick={disabled ? () => { } : handleBrowseClick}
              />
            )}
          <span className="inline-block text-[0.75rem] max-w-full text-black overflow-x-auto whitespace-nowrap no-scrollbar">
            {attachmentFile != null &&
              Array.from(attachmentFile as FileList).length > 0
              ? Array.from(attachmentFile as FileList)
                .slice(0, fileLimit)
                .map((file: any) => (
                  <FileNameBadge
                    file={file}
                    handleUnselect={disabled ? () => { } : handleDeleteFile}
                    disabled={disabled}
                  ></FileNameBadge>
                ))
              : attachmentText
                ? `${attachmentText}`
                : `Add Attachment (such as .pdf, .sheets, .xlsx) up to 10mb maximum`}
          </span>
        </div>
      </div>
    </>
  );
};
export default CustomFileUpload;
