import { useState, useRef, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

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

  // Display mode - show the value without editing
  if (!isEditing) {
    return (
      <Box
        sx={{
          p: 1,
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {value !== null && value !== undefined ? (
          String(value)
        ) : (
          <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>null</span>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {isTextarea ? (
        <TextField
          inputRef={textareaRef}
          multiline
          rows={4}
          value={localValue}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder='Enter value (JSON objects/arrays supported)'
          fullWidth
          variant='outlined'
          size='small'
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '14px',
            },
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0094f6',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0094f6',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e5e5e5',
            },
          }}
        />
      ) : (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            inputRef={inputRef}
            value={localValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder='Enter value'
            fullWidth
            variant='outlined'
            size='small'
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0094f6',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0094f6',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e5e5e5',
              },
            }}
          />
          <Button
            onClick={toggleToTextarea}
            variant='outlined'
            size='small'
            title='Switch to multiline editor'
            sx={{
              minWidth: 'auto',
              px: 2,
              backgroundColor: '#f5f5f5',
              color: '#666',
              borderColor: '#d1d5db',
              '&:hover': {
                backgroundColor: '#e5e5e5',
                borderColor: '#d1d5db',
              },
            }}
          >
            ⋯
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default EditableField;
