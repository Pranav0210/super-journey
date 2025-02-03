import PlantIllustration from "@/assets/icons/login_illustration.svg?react";
import TruckIllustration from "@/assets/icons/login_illustration2.svg?react";
import Logo from "@/assets/icons/logo_black.svg?react";
import Flag91Icon from "@/assets/icons/flag_91.svg?react";
import CheckIcon from "@/assets/icons/check.svg?react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import cn from "classnames";
import { CardProps } from "@/types";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/Checkbox";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyOTP, sendOTP, reSendOTP } from "./api";
import { useMutation } from "@tanstack/react-query";
import { allowDigitsInputOnly } from "@/lib/utils";
import CountdownTimer, {
  CountdownTimerRef,
} from "@/components/CountdownTimer";
import { APP_TYPE } from "@/config";
import { useCountdown } from "@/store";

const Login = ({ className, ...props }: CardProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [isResendAllowed, setIsResendAllowed] = useState(true);
  const [otp, setOTP] = useState("");
  const [phone, setPhone] = useState("");
  const [isOTPInvalid, setIsOtpInvalid] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastClassNames, setToastClassNames] = useState("");

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const timerRef = useRef<CountdownTimerRef | null>(null);

  useEffect(() => {
    const checkCompletion = () => {
      if (timerRef.current?.hasCompleted()) {
        setIsResendAllowed(true);
      }
      console.log("here", timerRef.current?.getTime())
    };

    // Set an interval to check completion state
    const interval = setInterval(checkCompletion, 500);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    timerRef.current?.start();
    console.log("timer start fn triggered");
  };

  const handleReset = () => {
    console.log("reset called");
    timerRef.current?.reset();
  };

  // const handleGetTime = () => {
  //   const currentTime = timerRef.current?.getTime();
  //   alert(`Current Timer: ${currentTime} seconds`);
  // };

  const navigate = useNavigate();
  const { mutate: mutateVerifyOTP, isPending: isOTPVerificationPending } =
    useMutation({
      mutationFn: (data: { phone: string; otp: string }) =>
        verifyOTP({ phone: data.phone, otp: data.otp }),
      onSuccess: () => {
        setIsOTPVerified(true);
        setIsOtpInvalid(false);
        setToastMsg("OTP Verified");
        setToastClassNames("!bg-verifiedGreen");
        setIsOtpRequested(false);
        timerRef.current?.reset()
        timerRef.current?.stop()
        //navigate('/')
      },
      onError: () => {
        setIsOtpInvalid(true);
        setToastClassNames("!bg-errorRed");
        setToastMsg("Invalid OTP");
        console.log("error");
      },
      onSettled: () => {
        triggerToast();
      },
    });

  const { mutate: mutateSendOTP, isPending: isOtpDeliveryPending } =
    useMutation({
      mutationFn: (phone: string) => sendOTP({ phone }),
      onSuccess: () => {
        setIsOTPVerified(false);
        setIsOtpInvalid(false);
        inputsRef.current.map((digitElement) => {
          if (digitElement) digitElement.value = "";
        });
        setToastMsg("OTP Sent");
        setToastClassNames("!bg-verifiedGreen");
        setIsOtpRequested(true);
        setIsResendAllowed(false)
        timerRef.current?.reset()
        timerRef.current?.start()
        // navigate('/')
      },
      onError: (error) => {
        console.log("error sending OTP", error);
        setToastMsg("Invalid Phone");
        setToastClassNames("!bg-errorRed");
      },
      onSettled: () => {
        triggerToast();
      },
    });

  const { mutate: mutateReSendOTP } = useMutation({
    mutationFn: (phone: string) => reSendOTP({ phone }),
    onSuccess: () => {
      setIsOTPVerified(false);
      setIsOtpInvalid(false);
      inputsRef.current.map((digitElement) => {
        if (digitElement) digitElement.value = "";
      });
      setToastMsg("OTP ReSent");
      setToastClassNames("!bg-verifiedGreen");
      setIsOtpRequested(true);
      setIsResendAllowed(false);
      timerRef.current?.reset()
      timerRef.current?.start()
      // handleReset()
      // timerRef.current?.start()
      // handleStart()
      // navigate('/')
    },
    onError: (error) => {
      console.log("error sending OTP", error);
      setToastMsg("Invalid Phone");
      setToastClassNames("!bg-errorRed");
      setIsResendAllowed(true);
      setIsOtpRequested(false);
    },
    onSettled: () => {
      triggerToast();
    },
  });

  const handleOTPDigitInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (!/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }

    if (value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
      if (inputsRef.current[index + 1]) inputsRef.current[index + 1]?.select();
    }

    setOTP(
      inputsRef.current.reduce(
        (acc, digitElement) => acc + digitElement?.value,
        "",
      ),
    );
  };

  const handleBackSpace = (
    evt: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      evt.key === "Backspace" &&
      (evt.target as HTMLInputElement).value === ""
    ) {
      evt.preventDefault();
      if (index < inputsRef.current.length) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (
      evt.key === "ArrowLeft" &&
      (evt.target as HTMLInputElement).selectionStart === 0 &&
      index > 0
    ) {
      evt.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (
      evt.key === "ArrowRight" &&
      (evt.target as HTMLInputElement).selectionStart === 1 &&
      index < inputsRef.current.length - 1
    ) {
      evt.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
    // else{
    setOTP(
      inputsRef.current.reduce(
        (acc, digitElement) => acc + digitElement?.value,
        "",
      ),
    );
    // }
  };

  return (
    <div className="flex justify-center items-center h-full font-poppins overflow-hidden relative">
      {showToast && <Toast message={toastMsg} classNames={toastClassNames} />}
      <PlantIllustration className="absolute right-0 top-[22rem] w-[24rem] h-[24rem]" />
      <TruckIllustration className="absolute left-[4rem] top-[8rem] w-[18rem]" />
      <div className="bg-clearSky w-[120%] absolute block h-[80%] -z-10 -rotate-[10deg] left-0 -bottom-64" />
      <div className="bg-cloudyBlue w-[120%] absolute block h-[80%] -z-20 -rotate-[10deg] left-0 -bottom-60" />
      <div className="flex flex-col justify-center items-center gap-10 h-full">
        <Logo className="align-self-start" />
        <Card
          className={cn(
            "w-[36vw] min-h-[60vh] p-6 shadow-custom flex flex-col",
            className,
          )}
          {...props}
        >
          <CardHeader>
            <CardTitle className="font-normal text-3xl text-primaryBlack">
              Your Goods,{" "}
              <span className="font-semibold text-secondaryBlack">
                Our Wheels
              </span>
            </CardTitle>
            <CardDescription className="text-primaryBlack text-lg py-2">
              Login using OTP
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="">
              <div className="text-left pb-2">Enter Mobile Number</div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center space-x-4 justify-end px-2 rounded-md border-2 border-gray-300 h-[2rem] w-[4.5rem]">
                  <Flag91Icon className="rounded-sm -mr-2" />
                  <p className="text-sm font-medium leading-none align-middle flex items-center text-right h-full">
                    +91
                  </p>
                </div>
                <input
                  type="text"
                  maxLength={10}
                  onChange={(e) => setPhone(allowDigitsInputOnly(e))}
                  disabled={isOTPVerified || isOtpRequested}
                  className="w-full h-[2rem] flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-sm font-medium focus:outline-none focus:border-2 focus:border-primaryIndigo"
                />
                <Button
                  disabled={isOtpDeliveryPending || isOTPVerified}
                  onClick={() => {
                    if (isOtpRequested) {
                      handleStart();
                      setIsOtpRequested(false);
                    } else mutateSendOTP(phone);
                  }}
                  className="text-xs bg-primaryIndigo hover:bg-navyLight"
                >
                  {isOtpRequested ? "Edit Phone" : "Send OTP"}
                </Button>
              </div>
            </div>
            <div className="">
              <div className="text-left pb-2">Enter OTP</div>
              <div className="gap-4 items-center grid grid-cols-10">
                {Array.from({ length: 6 }, (_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    disabled={isOTPVerified}
                    className={cn(
                      {
                        "border-errorRed focus:border-errorRed": isOTPInvalid,
                        "border-gray-300 focus:border-primaryIndigo":
                          !isOTPInvalid,
                      },
                      "w-[2rem] h-[2rem] border-2 rounded-md text-center text-sm font-medium focus:outline-none focus:border-2",
                    )}
                    ref={(el) => (inputsRef.current[index] = el)}
                    onChange={(evt) => handleOTPDigitInputChange(evt, index)}
                    onKeyDown={(evt) => handleBackSpace(evt, index)}
                  />
                ))}
                <Button
                  disabled={isOTPVerificationPending || otp.length < 6}
                  onClick={() => {
                    if (!isOTPVerified)
                      mutateVerifyOTP({ phone: phone, otp: otp });
                  }}
                  className={cn(
                    {
                      "bg-verifiedGreen hover:bg-verifiedGreen hover:cursor-default":
                        isOTPVerified,
                      "bg-primaryIndigo hover:bg-navyLight": !isOTPVerified,
                    },
                    "col-span-4 w-full text-xs",
                  )}
                >
                  {isOTPVerified ? (
                    <>
                      <div className="border-2 border-white rounded-full p-[0.5px]">
                        <CheckIcon className="w-2 h-2" />
                      </div>
                      Verified
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </div>
            </div>
            <span
              onClick={() => {
                if (isResendAllowed) {
                  mutateReSendOTP(phone);
                }
              }}
              className={cn(
                { "opacity-100 hover:cursor-pointer": isOtpRequested },
                "-mt-6 text-left flex opacity-0 items-center gap-2 text-sm text-textGray hover:text-navyLight hover:cursor-default",
              )}
            >
              {isResendAllowed ? (
                "Resend OTP"
              ) : (
                <>
                  <span>Resend OTP in</span>
                </>
              )}
            </span>
            <div className={cn("flex text-sm -mt-14 pt-1 ml-24 pl-2 text-textGray hover:text-navyLight hover:cursor-default", { "hidden": isResendAllowed || isOTPVerified})}>
              <CountdownTimer ref={timerRef} initialSeconds={10} />
            </div>
            <div className="flex-1 block"></div>
          </CardContent>

          <CardFooter className="mt-auto flexq flex-col">
            <div className="flex items-center my-6 gap-2">
              <Checkbox
                checked={isChecked}
                onChange={() => {
                  setIsChecked((prev) => !prev);
                }}
                className="shrink-0"
              />
              <span className="text-left text-xs">
                By clicking, I accept to agree the{" "}
                <Link to="" className="text-primaryIndigo font-semibold">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="" className="text-primaryIndigo font-semibold">
                  Privacy Policy
                </Link>{" "}
                to keep using the product.
              </span>
            </div>
            <Button
              className="w-full bg-primaryIndigo hover:bg-navyLight"
              disabled={!isChecked || !isOTPVerified}
              onClick={() => navigate(APP_TYPE == 'demand' ? "/all-loads" : "/all-trucks")}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
