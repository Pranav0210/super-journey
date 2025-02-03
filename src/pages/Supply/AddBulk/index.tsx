import CustomFileUpload from "@/components/CustomFileupload";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import Loader from "@/assets/icons/loading.svg?react";
import { DownloadIcon } from "lucide-react";
import { DataTable } from "./components/table/data-table";
import { columns } from "./components/table/columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserBulkTrucks, postBulkTrucks } from "./api";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast/toastProvider";

const AddBulk = () => {
  const { showToast } = useToast();
  const [fileAttachment, setFileAttachment] = useState(null);
  const queryClient = useQueryClient();
  const methods = useForm();
  const file = useWatch({
    name: "file",
    control: methods.control,
  });

  const onSubmit = () => {
    if (!file) {
    } else {
      const reportFormRequestData = new FormData();
      console.log("attach", fileAttachment);
      reportFormRequestData.append("file", fileAttachment);
      mutate(reportFormRequestData);
    }
  };

  const { data: bulkLogsData, isFetching } = useQuery({
    queryKey: ["getBulkLogs"],
    queryFn: getUserBulkTrucks,
  });

  const { mutate, isPending: isPostingBulk } = useMutation({
    mutationFn: postBulkTrucks,
    onError: () => {
      console.log("there has been an error");
      showToast({
        message: "Please format the sheet correctly",
        type: "error",
      });
    },
    onSuccess: () => {
      methods.reset({
        file: null,
      });
      queryClient.invalidateQueries(["getBulkLogs"]);
      showToast({ message: "Bulk upload successful", type: "success" });
    },
    meta: {
      errorMsg: true,
      successMsg: true,
    },
  });

  const handleDownload = () => {
    const fileId = "1MRQiJ0juQmLGA1S0kzSqVhTThrTPMZLO";
    const driveDownloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
    window.open(driveDownloadUrl, "_blank");
  };

  return (
    <FormProvider {...methods}>
      <div className="font-poppins flex-col justify-center gap-2">
        <div className="border-b-[1px] border-borderGray p-4 flex flex-grow items-center sticky z-10 top-0 bg-white mb-2">
          <span className="text-xl font-semibold">Add Bulk Trucks</span>
        </div>
        <div className="flex items-center mt-10 mx-4">
          <CustomFileUpload
            onFileUpload={(files) => {
              methods.setValue("file", files);
              setFileAttachment(files[0]);
            }}
            attachmentFile={file}
            fileLimit={1}
            attachmentText="Add Attachment (such as .csv, .sheets, .xlsx) up to 10mb maximum"
            allowedFileTypes={[
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "text/csv",
            ]}
            allowMultiple={false}
            browseButtonClassName="!bg-cedarChest hover:!bg-terraCotta !border-terraCotta"
            containerClassName="!bg-[#b8d4d6] !text-white"
          />
          <Button
            title={isPostingBulk ? <Loader className="w-6 h-6" /> : "Submit"}
            className="bg-cedarChest hover:bg-terraCotta border-terraCotta hover:border-terraCotta text-white mx-2"
            onClick={() => methods.handleSubmit(onSubmit)()}
          />
        </div>
        <div className="flex flex-grow justify-center text-sm items-center gap-6 m-4 ">
          <span>
            Download a sample excel sheet and format your file correctly.{" "}
          </span>
          <span
            onClick={handleDownload}
            className="p-2 cursor-pointer hover:bg-clearSky rounded-md"
          >
            <DownloadIcon className="w-8 h-8" />
          </span>
        </div>
        <div className="-mt-4 mx-auto py-2 w-[70%]">
          <span className="flex mt-10 mb-4 text-lg justify-center">
            Your Past Bulk Uploads
          </span>
          <DataTable columns={columns} data={bulkLogsData?.data ?? []} />
        </div>
      </div>
    </FormProvider>
  );
};

export default AddBulk;
