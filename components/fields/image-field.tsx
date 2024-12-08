import {CloudUpload, Paperclip} from 'lucide-react'
import React from 'react'
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '../ui/file-upload'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form'
import {UseFormReturn} from 'react-hook-form'
import InfoBadge from '../displaying/info-badge'
import {FaCheck} from 'react-icons/fa'

interface ImageFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
  name: string
  label?: string
  description?: string
  maxFiles?: number
}

export default function ImageField({
  form,
  name,
  label,
  description,
  maxFiles = 1,
}: ImageFieldProps) {
  const [files, setFiles] = React.useState<File[] | null>([])
  const [uploadedFiles, setUploadedFiles] = React.useState<string[]>([])

  const dropZoneConfig = {
    maxFiles: maxFiles,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  }

  async function handleChange(value: File[] | null) {
    value?.map((file) => {
      if (uploadedFiles.includes(file.name)) {
      } else {
        setFiles((previousFiles) => [...(previousFiles || []), file])
        setUploadedFiles((prev) => [...prev, file.name])
      }
    })
    uploadedFiles.map((filename) => {
      if (value?.find((file) => file.name === filename) === undefined) {
        setUploadedFiles((prev) => prev.filter((file) => file !== filename))
        setFiles((prev) =>
          prev ? prev.filter((file) => file.name !== filename) : null
        )
      }
    })
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <div className="flex gap-2">
            {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
            {description && <InfoBadge description={description} />}
          </div>
          <FormControl>
            <FileUploader
              value={files}
              onValueChange={handleChange}
              dropzoneOptions={dropZoneConfig}
              className="relative bg-background rounded-lg p-2"
            >
              <FileInput
                id="fileInput"
                className="outline-dashed outline-1 outline-slate-500"
              >
                <div className="flex items-center justify-center flex-col p-8 w-full ">
                  <CloudUpload className="text-gray-500 w-10 h-10" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Pulsa para subir</span>
                    &nbsp; o arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
              </FileInput>

              <FileUploaderContent>
                {files &&
                  files.length > 0 &&
                  files.map((file, i) => (
                    <FileUploaderItem
                      key={i}
                      index={i}
                    >
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                      {uploadedFiles[i] && (
                        <FaCheck className="text-green-600" />
                      )}
                    </FileUploaderItem>
                  ))}
              </FileUploaderContent>
              <FormMessage className="text-info-foreground">
                *Funcionalidad en desarrollo
              </FormMessage>
            </FileUploader>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
