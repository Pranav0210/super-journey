import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useStepperFormStore from "../store";
import { useQuery } from "@tanstack/react-query";
import { getTruckConfigs } from "../api";

const Step3 = () => {
  const { step2Data, step3Data, setStep3Data } = useStepperFormStore();

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["get-configs"],
    queryFn: () =>
      getTruckConfigs({ toneage: step2Data.quantity, unit: step2Data.unit }),
  });
  console.log(data, isLoading);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   // Update the entire object
  //   setStep3Data({
  //     ...step3Data,
  //     [name]: value,
  //   });
  // };

  return (
    <div className="p-4 flex flex-col gap-y-8">
      <div className="text-left text-xl font-semibold">Vehicle Requirement</div>
      <div className="text-left -mb-4">
        Select Body Type<span className="text-brightRed">*</span>
      </div>
      <ToggleGroup type="single" variant="default" value={step3Data.body}>
        {isFetched &&
          data[0]?.configuration &&
          Object.keys(data[0]?.configuration[0]).map((item) => (
            <ToggleGroupItem
              value={item}
              className=""
              onClick={() => {
                if (step3Data.body !== item)
                  setStep3Data({ ...step3Data, body: item, length: "" });
                else setStep3Data({ ...step3Data, body: item });
              }}
            >
              <span className="text-xs ">{item}</span>
            </ToggleGroupItem>
          ))}
        {/* <ToggleGroupItem
          value="open"
          aria-label="Toggle bold"
          className=""
          onClick={() => setStep3Data({ ...step3Data, body: "open" })}
        >
          <span className="text-xs ">Open Body</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="closed"
          aria-label="Toggle italic"
          onClick={() => setStep3Data({ ...step3Data, body: "closed" })}
        >
          <span className="text-xs ">Closed Body</span>
        </ToggleGroupItem> */}
      </ToggleGroup>
      {/* {step3Data.body == "open" && (
        <>
          <div className="text-left -mb-4">
            Select Container Type<span className="text-brightRed">*</span>
          </div>
          <ToggleGroup
            type="single"
            variant="default"
            value={step3Data.container}
          >
            <ToggleGroupItem
              value="open"
              aria-label="Toggle bold"
              onClick={() => setStep3Data({ ...step3Data, container: "open" })}
            >
              <span className="text-xs ">Open Container</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="tarpaulin"
              aria-label="Toggle italic"
              onClick={() =>
                setStep3Data({ ...step3Data, container: "tarpaulin" })
              }
            >
              <span className="text-xs ">Tarpaulin</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="trailer"
              aria-label="Toggle italic"
              onClick={() =>
                setStep3Data({ ...step3Data, container: "trailer" })
              }
            >
              <span className="text-xs ">Trailer</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="tipper"
              aria-label="Toggle italic"
              onClick={() =>
                setStep3Data({ ...step3Data, container: "tipper" })
              }
            >
              <span className="text-xs ">Tipper / Dumper</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </>
      )}
      {step3Data.body == "closed" && (
        <>
          <div className="text-left -mb-4">
            Select Container Type<span className="text-brightRed">*</span>
          </div>
          <ToggleGroup
            type="single"
            variant="default"
            value={step3Data.container}
          >
            <ToggleGroupItem
              value="standard"
              aria-label="Toggle bold"
              onClick={() =>
                setStep3Data({ ...step3Data, container: "standard" })
              }
            >
              <span className="text-xs ">Standard Container</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="hq"
              aria-label="Toggle italic"
              onClick={() => setStep3Data({ ...step3Data, container: "hq" })}
            >
              <span className="text-xs ">HQ Container</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bulker"
              aria-label="Toggle italic"
              onClick={() =>
                setStep3Data({ ...step3Data, container: "bulker" })
              }
            >
              <span className="text-xs ">Bulker</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="tanker"
              aria-label="Toggle italic"
              onClick={() =>
                setStep3Data({ ...step3Data, container: "tanker" })
              }
            >
              <span className="text-xs ">Tanker</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </>
      )} */}
      {data && data[0]?.configuration[0] && step3Data.body && (
        data[0]?.configuration[0][`${step3Data.body}`].length > 0 ?
          <>
            <div className="text-left -mb-4">
              Select Truck Length<span className="text-brightRed">*</span>
            </div>
            <ToggleGroup
              type="single"
              variant="default"
              value={step3Data.length}
              className="grid grid-cols-6 w-fit"
            >
              {data[0]?.configuration[0][`${step3Data.body}`]?.map((length) => (
                <ToggleGroupItem
                  value={length.toString()}
                  aria-label="Toggle bold"
                  className="w-24"
                  onClick={() =>
                    setStep3Data({ ...step3Data, length: length.toString() })
                  }
                >
                  <span className="text-xs">{`${length} ft`}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </> :
          <div className="text-left text-sm text-terraCotta">
            There are no length options available for this body type and have fixed body length.
          </div>
      )}
    </div>
  );
};
export default Step3;
