import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function ChatUI() {
  const [messages, setMessages] = useState([
    { id: 1, content: "Вітаю! Чим я можу допомогти?", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [settings, setSettings] = useState({
    model: "gpt-4",
    temperature: 0.7
  });

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      content: newMessage,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Імітація відповіді бота
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        content: "Це демо відповідь від бота. В реальній реалізації тут буде відповідь від API.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Чат з ReChat</CardTitle>
      </CardHeader>
      <CardContent className="h-[60vh] overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex w-full space-x-2">
          <Textarea
            placeholder="Напишіть своє повідомлення..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Надіслати</Button>
        </div>
        <div className="flex justify-between w-full">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Налаштування</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Налаштування чату</DialogTitle>
                <DialogDescription>
                  Налаштуйте параметри моделі для вашого чату.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Модель</h4>
                  <select 
                    className="w-full p-2 border rounded-md" 
                    value={settings.model}
                    onChange={(e) => setSettings({...settings, model: e.target.value})}
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-3">Claude 3</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Температура</h4>
                  <Input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={settings.temperature}
                    onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})}
                  />
                  <span>{settings.temperature}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="w-full">
                  Зберегти налаштування
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="ghost">Очистити чат</Button>
        </div>
      </CardFooter>
    </Card>
  );
} 