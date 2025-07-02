"use client";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/Shadcn/file-upload";
import { Button } from "@/components/Shadcn/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { encode } from "@jsquash/webp";
import { CloudUpload, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import type { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      }),
    )
    .max(5, {
      message: "Maximum 5 files are allowed",
    })
    .nullable(),
});

const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false,
} satisfies DropzoneOptions;

async function loadImage(src: File) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(src);
  await new Promise((resolve) => (img.onload = resolve));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  [canvas.width, canvas.height] = [img.width, img.height];
  ctx?.drawImage(img, 0, 0);
  return ctx?.getImageData(0, 0, img.width, img.height);
}

// TRÊN ĐÂY LÀ HÀM UTILS **********************************************************************************
// DƯỚI ĐÂY LÀ COMPONENT **********************************************************************************

export default function Test() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [webpBufferFileArr, setWebpBufferFileArr] = useState<ArrayBuffer[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  function onSubmit(formInputData: z.infer<typeof formSchema>) {
    try {
      console.log("formInputData nè ", formInputData); // formInputData.files ko có dữ liệu, phải lấy từ trên useState ra

      if (files && files.length > 0) {
        files.forEach(async (item) => {
          const rawImageData = await loadImage(item);
          if (rawImageData != null) {
            const webpBuffer = await encode(rawImageData);
            console.log("webpBuffer của file", item.name);
            console.log(webpBuffer);
            setWebpBufferFileArr((prev) => [...(prev || []), webpBuffer]);
          }
        });
      }
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(formInputData, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  useEffect(() => {
    console.log("files nè ", files);
  }, [webpBufferFileArr, files]);

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-8 py-10">
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select File</FormLabel>
                <FormControl>
                  <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={dropZoneConfig}
                    className="bg-background relative rounded-lg p-2"
                  >
                    <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
                      <div className="flex w-full flex-col items-center justify-center p-8">
                        <CloudUpload className="h-10 w-10 text-gray-500" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                          <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                            <img src={URL.createObjectURL(file)} alt={file.name} height={80} width={80} className="size-20 p-0" />
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
                </FormControl>
                <FormDescription>Select a file to upload.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {/* <div>{webpBufferFileArrDecode && webpBufferFileArrDecode.map((item, i) => <div key={i}>{item.data}</div>)}</div> */}
    </div>
  );
}

// import type { UserResponse } from "@/type-from-be";
// import { $api } from "@/utils/api";

// export const Test = () => {
//   const { data, error, isLoading } = $api.useQuery("get", "/users", {});

//   console.log(data?.result as UserResponse);
//   console.log();
//   console.log(error);
//   console.log(isLoading);

//   if (!data || isLoading) return "Loading...";
//   if (error) return `An error occurred: ${error}`;

//   // return <div>{data.result?.map((item) => item.fullName)}</div>;
// };
