// components/StartChatButton.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ChatInterface } from './chatInterface';

interface StartChatButtonProps {
  otherUserId: string;
  otherUserName: string;
}

export const StartChatButton: React.FC<StartChatButtonProps> = ({
  otherUserId,
  otherUserName,
}) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowChat(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Message {otherUserName}
      </Button>

      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Chat with {otherUserName}</h3>
              <Button variant="ghost" onClick={() => setShowChat(false)}>
                Close
              </Button>
            </div>
            <div className="h-[calc(100%-80px)]">
              <ChatInterface otherUserId={otherUserId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};