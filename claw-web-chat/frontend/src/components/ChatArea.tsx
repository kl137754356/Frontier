import { MessageList } from './MessageList';
import { InputArea } from './InputArea';

export function ChatArea() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MessageList />
      <InputArea />
    </div>
  );
}
