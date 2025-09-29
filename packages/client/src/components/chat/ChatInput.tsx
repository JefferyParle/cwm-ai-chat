import { type KeyboardEvent } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

interface ChatInputProps {
  onSubmit: (data: ChatFormData) => void;
}

export interface ChatFormData {
  prompt: string;
}

const ChatInput = ({ onSubmit }: ChatInputProps) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const submit = handleSubmit((data) => {
    reset({ prompt: '' });
    onSubmit(data);
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-2 items-end relative"
    >
      <textarea
        {...register('prompt', {
          required: true,
          validate: (data) => data.trim().length > 0,
        })}
        autoFocus
        className="w-full min-h-40 border-2 p-4 rounded-3xl focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <Button
        disabled={!formState.isValid}
        className="rounded-full w-9 h-9 right-4 bottom-4 absolute cursor-pointer"
      >
        <FaArrowUp />
      </Button>
    </form>
  );
};
export default ChatInput;
