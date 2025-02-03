import { useEffect, useState } from "react";
import AddTruckStep1 from "./components/Step1";
import AddTruckStep2 from "./components/Step2";
// import AddTruckStep3 from "./components/Step3";
import cn from "classnames";
import ArrowLeftIcon from "@/assets/icons/arrow_left.svg?react";
import ChevronRight from "@/assets/icons/chevron-right.svg?react";
import ChevronLeft from "@/assets/icons/chevron-left.svg?react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { StepperForm } from "@/types";
import useStepperFormStore from "./store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTruck, postTruck, updateTruck } from "./api";
import { useToast } from "@/components/Toast/toastProvider";
import PageLoader from "@/components/PageLoader";
import { LocationPointDto, Step1Dto, Step2Dto, validateStepData } from "./dto/add-truck.dto";
// import PageLayout from "./PageLayout"

const AddLoadStepperForm: React.FC<StepperForm> = ({
  rootClassName,
  timelineContainerClassName,
  stepperFormItems,
}) => {
  const {
    step1Data,
    setStep1Data,
    step2Data,
    setStep2Data,
    resetForm,
  } = useStepperFormStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [currentStep, setCurrentStep] = useState<number>(1);
  // const [showToast, setShowToast] = useState(false);
  // const [toastMsg, setToastMsg] = useState("");
  // const [toastClassNames, setToastClassNames] = useState("");

  const { data: truckData } = useQuery({
    queryKey: ["getTruck"],
    queryFn: () => getTruck(id),
  });

  useEffect(() => {
    if (truckData) {
      setStep1Data({
        pickupPoint: { name: truckData?.pickupPoint, placeId: truckData?.pickupPlaceId },
        dropPoint: { name: truckData?.dropPoint, placeId: truckData?.dropPlaceId },
      });
      setStep2Data({
        regNo: truckData?.regnNo,
        minPrice: truckData?.fare,
        expirationTime: truckData?.expirationTime,
        body: truckData?.bodyType,
        quantity: truckData?.capacity,
        length: truckData?.length
      });
      console.log("log", step1Data, step2Data);
    }
  }, [truckData, id]);
  console.log(truckData);

  useEffect(() => {
    if (!id) resetForm();
  }, []);
  // const triggerToast = () => {
  //   setShowToast(true);
  //   setTimeout(() => setShowToast(false), 3000);
  // };
  const nextStep = async () => {
    const getStepData = () => {
      switch (currentStep) {
        case 1:
          return step1Data;
        case 2:
          return step2Data;
        // case 3:
        //   return step3Data;
      }
    };
    const getValidateParams = () => {
      switch (currentStep) {
        case 1:
          return [validateStepData(step1Data, Step1Dto), validateStepData(step1Data.pickupPoint, LocationPointDto), validateStepData(step1Data.dropPoint, LocationPointDto)];
        case 2:
          return [validateStepData(step2Data, Step2Dto)];
      }
    }
    const validationErrors = (await Promise.all(getValidateParams())).flat().filter((item) => item);
    if (validationErrors.length > 0) {
      console.log(validationErrors)
      showToast({ message: validationErrors[0].message.split(',')[0], type: 'error' });
      return;
    }
    // console.log("Form Data:", { step1Data });
    // mutate();
    // if (Object.values(getStepData()).some((value) => !value)) {
    //   const missingKeys = Object.keys(getStepData()).filter(
    //     (key) => !getStepData()[key],
    //   );
    //   console.log(
    //     getStepData(),
    //     Object.values(getStepData).some((value) => !value),
    //     Object.keys(getStepData).filter((key) => {
    //       if (!getStepData[key].length) return key;
    //     }),
    //   );
    //   showToast({
    //     message: `${missingKeys[0].replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} is required`,
    //     type: "error",
    //   });
    //   // setToastMsg(`${missingKeys[0]} is require d`);
    //   // setToastClassNames("bg-errorRed");
    //   // triggerToast();
    // } 
    else {
      setCurrentStep((prev) => {
        if (prev < stepperFormItems.length) return prev + 1;
        else return prev;
      });
      if (currentStep === stepperFormItems.length)
        mutate()
    }
  };
  const prevStep = () => {
    setCurrentStep((prev) => {
      if (prev > 1) return prev - 1;
      else return prev;
    });
  };

  const cancelEdit = () => {
    resetForm();
    navigate("/my-trucks");
  };

  const handleSubmit = () => {
    console.log("Form Data:", { step1Data, step2Data });
    mutate();
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["submit-load"],
    mutationFn: () => {
      if (!id) return postTruck({ ...step1Data, ...step2Data });
      else return updateTruck({ ...step1Data, ...step2Data, id });
    },
    onSuccess() {
      // setToastMsg("Load Posted Successfully");
      // setToastClassNames("bg-verifiedGreen mt-12");
      // triggerToast();
      showToast({ message: id ? "Load updated successfullly" : "Load posted successfully", type: "success" });
      resetForm();
      navigate("/my-trucks");
      // setCurrentStep(1);
    },
    onError() {
      // setToastMsg("An Error Occured");
      // setToastClassNames("bg-errorRed mt-12");
      // triggerToast();
      showToast({ message: "Something went wrong", type: "error" });
    },
  });

  return (
    <div className={cn(rootClassName, "h-full font-poppins")}>
      {isPending && <PageLoader />}
      <div className="border-b-[1px] border-borderGray px-4 py-2 h-[4rem] flex flex-grow items-center">
        <span className="text-xl font-semibold flex gap-4 items-center">
          <ArrowLeftIcon
            className="hover:cursor-pointer"
            onClick={() => navigate(-1)}
          />
          {id ? "Edit Truck" : "Add Truck"}
        </span>
        <div className="flex gap-2 ml-auto">
          {id && (
            <div
              onClick={cancelEdit}
              className={cn(
                "bg-errorRed hover:opacity-80 hover:cursor-pointer text-white items-center flex gap-2 w-[6rem] rounded-md text-xs px-4 py-2 ml-auto",
              )}
            >
              <X className="w-4 h-4 -ml-2" />
              Cancel
            </div>
          )}
          <div
            onClick={prevStep}
            className={cn(
              {
                "bg-borderGray": currentStep == 1,
                "bg-pantoneGreen hover:bg-pantoneLight hover:cursor-pointer":
                  currentStep > 1,
              },
              "text-white items-center flex gap-2 w-[6rem] rounded-md text-xs px-4 py-2 ml-auto",
            )}
          >
            <ChevronLeft className="w-4 h-4 -ml-2" />
            Back
          </div>
          <div
            onClick={nextStep}
            className={cn(
              {
                hidden: currentStep == stepperFormItems?.length,
                "bg-pantoneGreen hover:bg-pantoneLight hover:cursor-pointer":
                  currentStep < stepperFormItems?.length,
              },
              "text-white items-center flex gap-2 w-[6rem] rounded-md text-xs px-4 py-3 ml-auto",
            )}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
          <div
            onClick={nextStep}
            className={cn(
              {
                "bg-pantoneGreen hover:bg-pantoneLight hover:cursor-pointer":
                  currentStep == stepperFormItems?.length,
                hidden: currentStep < stepperFormItems?.length,
              },
              "text-white items-center flex gap-2 w-[6rem] rounded-md text-xs px-4 py-3 ml-auto",
            )}
          >
            Submit
            <ChevronRight className="w-4 h-4 -mr-2" />
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(100%-4rem)] items-center flex flex-col justify-center">
        {/* {showToast && <Toast message={toastMsg} classNames={toastClassNames} />} */}
        <div className="grid grid-cols-6 w-full h-full">
          <div
            className={cn(
              timelineContainerClassName,
              "relative col-span-2 bg-backgroundGray px-6 py-10 flex flex-col gap-12 text-sm",
            )}
          >
            {stepperFormItems.map((item, index) => {
              if (currentStep == index + 1)
                return (
                  <section className="relative flex items-center gap-2 font-semibold">
                    <span className="relative rounded-full inset-0 h-8 w-8 bg-vividTangerine block">
                      <span className="absolute rounded-full inset-0 h-6 w-6 bg-cedarChest m-auto  text-white items-center justify-center flex">
                        {index + 1}
                      </span>
                    </span>
                    {item.title}
                    {/* <div className="absolute border-l-2 border-dashed border-textGray h-[3rem] mt-2"></div> */}
                  </section>
                );
              else if (currentStep > index + 1) {
                return (
                  <section className="relative flex items-center gap-2">
                    <span className="rounded-full h-6 w-6 bg-cedarChest  m-1 text-white items-center justify-center flex">
                      {index + 1}
                    </span>
                    {item.title}
                    <div className="absolute border-l-2 border-cedarChest h-[2.825rem] left-4 top-6 mt-2"></div>
                  </section>
                );
              } else
                return (
                  <section className="relative flex items-center gap-2">
                    <span className="rounded-full h-6 w-6 border-[1px] border-textGray  m-1 text-textGray items-center justify-center flex">
                      {index + 1}
                    </span>
                    {item.title}
                    <div className="absolute border-l-2 border-dashed border-textGray left-4 bottom-8 h-[2.825rem] mt-2"></div>
                  </section>
                );
            })}
          </div>
          <div className="col-span-4">
            {stepperFormItems[currentStep - 1].component}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddTruck = () => {
  return (
    <AddLoadStepperForm
      stepperFormItems={[
        {
          title: "Trip Start & End Location",
          component: <AddTruckStep1 />,
        },
        {
          title: "Truck Details",
          component: <AddTruckStep2 />,
        },
        // {
        //   title: "Vehicle Requirement",
        //   component: <AddTruckStep3 />,
        // },
      ]}
    />
  );
};

export default AddTruck;
