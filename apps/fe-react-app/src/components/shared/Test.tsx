/* eslint-disable sonarjs/no-commented-code */
"use client";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/Shadcn/file-upload";
import { Button } from "@/components/Shadcn/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { compressImage } from "@/services/imageCompressService";
import { $api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import type { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
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
    "image/*": [".jpg", ".jpeg", ".png", ".webp"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false,
} satisfies DropzoneOptions;

// TRÊN ĐÂY LÀ HÀM UTILS **********************************************************************************
// DƯỚI ĐÂY LÀ COMPONENT **********************************************************************************

export default function Test() {
  const query = $api.useMutation("post", "/media/upload");
  const [files, setFiles] = useState<File[] | null>(null);
  const [webpFileArr, setWebpFileArr] = useState<File[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  async function onSubmit(formInputData: z.infer<typeof formSchema>) {
    if (files && files.length > 0) {
      files.forEach(async (item) => {
        const webpFile = await compressImage(item);
        setWebpFileArr((prev) => [...(prev || []), webpFile]);
      });
    }
    console.log("webpFileArr nè ", webpFileArr);

    const formdata = new FormData();
    formdata.append("file", webpFileArr?.[0] as File);
    console.log("formdata nè ", formdata);
    query.mutate(
      {
        body: formdata as unknown as { file: string },
      },
      {
        onSuccess: (data) => {
          console.log("Upload successful:", data);
        },
        onError: (error) => {
          console.error("Upload failed:", error);
        },
      },
    );
  }

  useEffect(() => {
    console.log("files nè ", files);
    console.log("webpFileArr nè ", webpFileArr);
  }, [webpFileArr, files]);

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
