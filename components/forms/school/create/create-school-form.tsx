"use client";

import { CreateSchool } from "@/action/school";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CreateSchoolFormValues, CreateSchoolSchema } from "@/data/form-schema";
import { useDisableComponents } from "@/hooks/use-disable-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateSchoolGallery } from "./create-school-gallery";
import { CreateSchoolInformation } from "./create-school-information";
import { CreateSchoolLocation } from "./create-school-location";
import { CreateSchoolPreview } from "./create-school-preview";
import { CreateSchoolProgram } from "./create-school-program";
import { CreateSchoolScholarship } from "./create-school-scholarship";

export const CreateSchoolForm = () => {
  const [loading, setLoading] = useState(false);
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CreateSchoolFormValues>();
  const router = useRouter();

  const form = useForm<CreateSchoolFormValues>({
    resolver: zodResolver(CreateSchoolSchema),
    mode: "onBlur",
    defaultValues: {
      color: "#7D1F1F",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = form;

  const onSubmit = async (values?: CreateSchoolFormValues) => {
    if (values) {
      const validatedFields = CreateSchoolSchema.safeParse(values);

      if (validatedFields.success) {
        // Call API to create school
        const data = validatedFields.data;

        setLoading(true);

        try {
          await CreateSchool(data)
            .then((res) => {
              if (res.success) {
                toast.success("Trường học đã được tạo thành công");
                router.push(`/schools/${res.id}`);
              }

              if (typeof res.error === "string") {
                toast.error(res.error);
              } else {
                console.log("ERRORS", JSON.stringify(res.error));
                toast.error("Đã xảy ra lỗi khi tạo trường học");
              }
            })
            .finally(() => {
              setLoading(false);
            });
        } catch (error) {
          console.log("CREATE_SCHOOL_ERROR", error);
          toast.error("Đã xảy ra lỗi khi tạo trường học");
        }
      }
    }
  };

  const processForm: SubmitHandler<CreateSchoolFormValues> = (data) => {
    setData(data);
  };

  type FieldName = keyof CreateSchoolFormValues;

  const steps = [
    {
      id: "Bước 1",
      name: "Thông tin trường học",
      fields: ["logo", "background", "name", "short", "color", "country"],
    },
    {
      id: "Bước 2",
      name: "Thêm cơ sở",
      fields: ["locations"],
    },
    {
      id: "Bước 3",
      name: "Thêm chương trình đào tạo",
      fields: ["programs"],
    },
    {
      id: "Bước 4",
      name: "Thêm bộ sưu tập (tùy chọn)",
      fields: ["galleries"],
    },
    {
      id: "Bước 5",
      name: "Thêm học bổng (tùy chọn)",
      fields: ["scholarships"],
    },
    {
      id: "Bước 6",
      name: "Xác nhận thông tin",
    },
  ];

  const next = async () => {
    const fields = steps[currentStep]?.fields;

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const { isDisabled } = useDisableComponents();

  return (
    <div className="size-full">
      <ul className="flex gap-4">
        {steps.map((step, index) => (
          <li key={step.name} className="md:flex-1">
            {currentStep > index ? (
              <div className="group flex w-full flex-col border-l-4 border-main dark:border-main-component py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-main dark:text-main-component transition-colors ">
                  {step.id}
                </span>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {step.name}
                </span>
              </div>
            ) : currentStep === index ? (
              <div
                className="flex w-full flex-col border-l-4 border-main dark:border-main-foreground py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-main dark:text-main-foreground">
                  {step.id}
                </span>
                <span className="text-sm font-medium text-main dark:text-main-foreground">
                  {step.name}
                </span>
              </div>
            ) : (
              <div className="group flex h-full w-full flex-col border-l-4 border-main/20 dark:border-main-component py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500 transition-colors">
                  {step.id}
                </span>
                <span className="text-sm font-medium text-neutral-700 dark:text-main-component">
                  {step.name}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
      <hr className="h-1 bg-main dark:bg-main-component my-4 rounded-full" />
      <Form {...form}>
        <form onSubmit={handleSubmit(processForm)} className="size-full">
          {currentStep === 0 && (
            <CreateSchoolInformation
              control={control}
              errors={errors}
              setValue={setValue}
            />
          )}
          {currentStep === 1 && (
            <CreateSchoolLocation
              control={control}
              errors={errors}
              setValue={setValue}
              getValue={getValues}
            />
          )}
          {currentStep === 2 && (
            <CreateSchoolProgram
              control={control}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
            />
          )}
          {currentStep === 3 && (
            <CreateSchoolGallery
              control={control}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
            />
          )}
          {currentStep === 4 && (
            <CreateSchoolScholarship
              control={control}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
            />
          )}
          {currentStep === 5 && <CreateSchoolPreview data={data} />}
          <div className="flex w-full items-center justify-around mt-4">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0 || isDisabled || loading}
              className="rounded bg-white dark:bg-main-component px-2 py-1 text-sm font-semibold text-main/90 dark:text-main-foreground/90 shadow-sm ring-1 ring-inset ring-main/30 dark:ring-main-foreground/30 hover:bg-main/5 dark:hover:bg-main-foreground/5 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-x-2"
            >
              <ChevronLeft />
              Quay về
            </button>
            {currentStep === steps.length - 1 &&
              (loading ? (
                <div className="flex items-center gap-x-2">
                  <span>Đang xử lý...</span>
                  <div className="w-4 h-4 border-t-2 border-main dark:border-main-component rounded-full animate-spin"></div>
                </div>
              ) : (
                <Button
                  onClick={() => onSubmit(data)}
                  disabled={loading}
                  className="border-main dark:border-main-component font-bold bg-main dark:bg-main-component text-white dark:text-main-foreground"
                >
                  Thêm trường học
                </Button>
              ))}
            <button
              type="button"
              onClick={next}
              disabled={
                currentStep === steps.length - 1 || loading || isDisabled
              }
              className="rounded bg-white dark:bg-main-component px-2 py-1 text-sm font-semibold text-main/90 dark:text-main-foreground/90 shadow-sm ring-1 ring-inset  ring-main/30 dark:ring-main-foreground/30 hover:bg-main/5 dark:hover:bg-main-foreground/5 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-x-2"
            >
              Tiếp theo
              <ChevronRight />
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
