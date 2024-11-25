import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {UseFormReturn} from 'react-hook-form'
import InfoBadge from '../displaying/info-badge'

interface TextFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
  name: string
  label?: string
  type?: HTMLInputElement['type']
  description?: string
  placeholder?: string
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}

export default function TextField({
  form,
  name,
  label,
  type = 'text',
  description,
  placeholder,
  startContent,
  endContent,
}: TextFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({field, fieldState}) => (
        <>
          <FormItem className="space-y-1">
            <div className="flex gap-2">
              {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
              {description && <InfoBadge description={description} />}
            </div>
            <FormControl>
              <Input
                className={fieldState.isDirty ? 'border border-purple-500' : ''}
                id={name}
                endContent={endContent}
                type={type}
                startContent={startContent}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  )
}
