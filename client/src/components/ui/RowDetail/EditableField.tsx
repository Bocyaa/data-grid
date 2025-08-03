import { useState, useRef, useEffect } from 'react';

interface EditableFieldProps {
  value: any;
  fieldKey: string;
  onChange: (key: string, value: any) => void;
  isEditing: boolean;
}

function EditableField({
  value,
  fieldKey,
  onChange,
  isEditing,
}: EditableFieldProps) {
  const [localValue, setLocalValue] = useState<string>('');
  const [isTextarea, setIsTextarea] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize local value when component mounts or value changes
  useEffect(() => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'object') {
        const jsonString = JSON.stringify(value, null, 2);
        setLocalValue(jsonString);
        setIsTextarea(true);
      } else {
        setLocalValue(String(value));
        setIsTextarea(false);
      }
    } else {
      setLocalValue('');
      setIsTextarea(false);
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setLocalValue(newValue);

    try {
      // Try to parse as JSON first
      if (newValue.trim().startsWith('{') || newValue.trim().startsWith('[')) {
        const parsed = JSON.parse(newValue);
        onChange(fieldKey, parsed);
      } else if (newValue === '') {
        onChange(fieldKey, null);
      } else {
        // Try to parse as number if it's numeric
        const numValue = Number(newValue);
        if (!isNaN(numValue) && newValue.trim() !== '') {
          onChange(fieldKey, numValue);
        } else {
          onChange(fieldKey, newValue);
        }
      }
    } catch {
      // If JSON parsing fails, treat as string
      onChange(fieldKey, newValue);
    }
  };

  const toggleToTextarea = () => {
    setIsTextarea(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  if (!isEditing) {
    return (
      <div className='md:col-span-2 p-2 border border-[#e5e5e5] rounded-lg'>
        {value !== null && value !== undefined ? (
          typeof value === 'object' ? (
            <pre className='whitespace-pre-wrap text-sm'>
              {JSON.stringify(value, null, 2)}
            </pre>
          ) : (
            String(value)
          )
        ) : (
          <span className='text-gray-400 italic'>null</span>
        )}
      </div>
    );
  }

  return (
    <div className='md:col-span-2'>
      {isTextarea ? (
        <textarea
          ref={textareaRef}
          value={localValue}
          onChange={(e) => handleValueChange(e.target.value)}
          className='w-full p-2 border border-[#e5e5e5] rounded-lg resize-vertical min-h-[80px] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          placeholder='Enter value (JSON objects/arrays supported)'
        />
      ) : (
        <div className='flex gap-2'>
          <input
            ref={inputRef}
            type='text'
            value={localValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className='flex-1 p-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Enter value'
          />
          <button
            type='button'
            onClick={toggleToTextarea}
            className='px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors'
            title='Switch to multiline editor'
          >
            ⋯
          </button>
        </div>
      )}
    </div>
  );
}

export default EditableField;
