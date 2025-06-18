import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  senderName?: string;
}

interface LiveChatProps {
  className?: string;
}

export default function LiveChat({ className }: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && !wsRef.current) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isOpen]);

  const connectWebSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        // Send initial greeting
        setMessages([{
          id: Date.now().toString(),
          text: "Hello! Welcome to Lumier Furniture. How can I assist you today?",
          sender: 'support',
          timestamp: new Date(),
          senderName: 'Support Team'
        }]);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          const newMsg: Message = {
            id: data.id || Date.now().toString(),
            text: data.text,
            sender: data.sender || 'support',
            timestamp: new Date(data.timestamp || Date.now()),
            senderName: data.senderName || 'Support Team'
          };
          
          setMessages(prev => [...prev, newMsg]);
          
          // Increment unread count if chat is minimized or closed
          if (isMinimized || !isOpen) {
            setUnreadCount(prev => prev + 1);
          }
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      senderName: isAuthenticated ? `${(user as any)?.firstName || 'Customer'}` : 'Guest'
    };

    setMessages(prev => [...prev, message]);

    // Send to WebSocket
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        ...message,
        userId: (user as any)?.id || 'guest'
      }));
    }

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
    setUnreadCount(0);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // Chat button when closed
  if (!isOpen) {
    return (
      <Button
        onClick={openChat}
        className={`relative bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90 rounded-full p-2 shadow-lg ${className}`}
        size="sm"
      >
        <MessageCircle className="h-3 w-3" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center text-[10px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    );
  }

  // Minimized chat
  if (isMinimized) {
    return (
      <div className={`fixed top-20 right-6 z-50 ${className}`}>
        <Card className="w-80 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between py-3 bg-lumier-gold text-lumier-black">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">Live Chat</span>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={openChat}
                className="h-6 w-6 p-0 hover:bg-lumier-gold/80"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChat}
                className="h-6 w-6 p-0 hover:bg-lumier-gold/80"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>
    );
  }

  // Full chat window
  return (
    <div className={`fixed top-20 right-6 z-50 ${className}`}>
      <Card className="w-80 h-96 shadow-lg flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between py-3 bg-lumier-gold text-lumier-black">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">Live Chat</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={minimizeChat}
              className="h-6 w-6 p-0 hover:bg-lumier-gold/80"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeChat}
              className="h-6 w-6 p-0 hover:bg-lumier-gold/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-lumier-gold text-lumier-black'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.senderName} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                disabled={!isConnected}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                size="sm"
                className="bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!isConnected && (
              <p className="text-xs text-red-500 mt-1">Connection lost. Retrying...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}