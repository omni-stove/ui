import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Chat } from ".";
import { Typography } from "../Typography";

const meta: Meta<typeof Chat.Message> = {
  component: Chat.Message,
};

export default meta;

type Story = StoryObj<typeof Chat.Message>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    // メッセージの型を明示的に定義
    type Message = {
      id: string;
      type: "sent" | "received";
      text: string;
      timestamp: string;
      isRead?: boolean;
      metadata?: ReactNode;
    };

    const [messages, setMessages] = useState<Message[]>([
      {
        id: "1",
        type: "received",
        text: "こんにちは",
        timestamp: "10:30",
      },
      {
        id: "2",
        type: "sent",
        text: "こんにちは",
        timestamp: "10:31",
        isRead: true,
      },
    ]);

    const handleSubmit = () => {
      if (!value.trim()) return;

      // 現在時刻を取得してフォーマット
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const timestamp = `${hours}:${minutes}`;

      // メッセージを追加
      setMessages([
        ...messages,
        {
          id: `sent-${Date.now()}`,
          type: "sent",
          text: value,
          timestamp,
          isRead: false,
          metadata: (
            <Typography variant="labelSmall" color="secondary">
              送信中...
            </Typography>
          ),
        },
      ]);
      // 入力をクリア
      setValue("");

      // 自動返信（デモ用）
      setTimeout(() => {
        const replyNow = new Date();
        const replyHours = replyNow.getHours().toString().padStart(2, "0");
        const replyMinutes = replyNow.getMinutes().toString().padStart(2, "0");
        const replyTimestamp = `${replyHours}:${replyMinutes}`;

        setMessages((prev) => [
          ...prev,
          {
            id: `recv-${Date.now()}`,
            type: "received",
            text: "自動返信メッセージです",
            timestamp: replyTimestamp,
          },
        ]);

        // 少し遅れて既読をつける
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.type === "sent" && !msg.isRead
                ? { ...msg, isRead: true }
                : msg,
            ),
          );
        }, 1500);
      }, 1000);
    };

    return (
      <Chat.Wrapper onSubmit={() => console.log("Wrapper onSubmit called")}>
        <Chat.Content>
          {messages.map((msg) => (
            <Chat.Message
              key={msg.id}
              type={msg.type as "sent" | "received"}
              timestamp={msg.timestamp}
              isRead={msg.isRead}
            >
              {msg.text}
            </Chat.Message>
          ))}
          <Chat.Actions
            actions={[
              {
                label: "送信",
                onPress: () => {},
                children: "送信",
              },
              {
                label: "添付",
                onPress: () => {},
                children: "添付",
              },
              {
                label: "カメラ",
                onPress: () => {},
                children: "カメラ",
              },
            ]}
          />
        </Chat.Content>
        <Chat.Input value={value} onChange={setValue} onSubmit={handleSubmit} />
      </Chat.Wrapper>
    );
  },
};

export const WithMetadata: Story = {
  render: () => {
    const [value, setValue] = useState("");
    // メッセージの型を明示的に定義
    type MessageWithMetadata = {
      id: string;
      type: "sent" | "received";
      text: string;
      timestamp: string;
      isRead?: boolean;
      metadata?: ReactNode;
    };

    const [messages, setMessages] = useState<MessageWithMetadata[]>([
      {
        id: "1",
        type: "received",
        text: "こんにちは",
        timestamp: "10:30",
        metadata: (
          <Typography variant="labelSmall" color="tertiary">
            転送済み
          </Typography>
        ),
      },
      {
        id: "2",
        type: "sent",
        text: "添付ファイルを送信しました",
        timestamp: "10:31",
        isRead: true,
        metadata: (
          <Typography variant="labelSmall" color="secondary">
            PDF, 2.4MB
          </Typography>
        ),
      },
      {
        id: "3",
        type: "received",
        text: "ありがとうございます、確認します",
        timestamp: "10:32",
      },
    ]);

    const handleSubmit = () => {
      if (!value.trim()) return;

      // 現在時刻を取得してフォーマット
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const timestamp = `${hours}:${minutes}`;

      // メッセージを追加
      setMessages([
        ...messages,
        {
          id: `sent-${Date.now()}`,
          type: "sent",
          text: value,
          timestamp,
          isRead: false,
        },
      ]);
      // 入力をクリア
      setValue("");
    };

    return (
      <Chat.Wrapper>
        <Chat.Content>
          {messages.map((msg) => (
            <Chat.Message
              key={msg.id}
              type={msg.type as "sent" | "received"}
              timestamp={msg.timestamp}
              isRead={msg.isRead}
              metadata={msg.metadata}
            >
              {msg.text}
            </Chat.Message>
          ))}
        </Chat.Content>
        <Chat.Input value={value} onChange={setValue} onSubmit={handleSubmit} />
      </Chat.Wrapper>
    );
  },
};

export const AutoScroll: Story = {
  render: () => {
    const [value, setValue] = useState("");
    // メッセージの型を明示的に定義
    type Message = {
      id: string;
      type: "sent" | "received";
      text: string;
      timestamp: string;
      isRead?: boolean;
      metadata?: ReactNode;
    };

    const [messages, setMessages] = useState<Message[]>([
      { id: "r1", type: "received", text: "こんにちは", timestamp: "10:00" },
      {
        id: "s1",
        type: "sent",
        text: "こんにちは",
        timestamp: "10:01",
        isRead: true,
      },
      {
        id: "r2",
        type: "received",
        text: "調子はどうですか？",
        timestamp: "10:02",
      },
      {
        id: "s2",
        type: "sent",
        text: "元気です！",
        timestamp: "10:03",
        isRead: true,
      },
      {
        id: "r3",
        type: "received",
        text: "それは良かったです",
        timestamp: "10:04",
      },
      {
        id: "s3",
        type: "sent",
        text: "ありがとうございます",
        timestamp: "10:05",
        isRead: true,
      },
      {
        id: "r4",
        type: "received",
        text: "今日は何か予定はありますか？",
        timestamp: "10:06",
      },
      {
        id: "s4",
        type: "sent",
        text: "特にありません",
        timestamp: "10:07",
        isRead: true,
      },
      { id: "r5", type: "received", text: "そうですか", timestamp: "10:08" },
      {
        id: "s5",
        type: "sent",
        text: "はい",
        timestamp: "10:09",
        isRead: true,
      },
    ]);

    const handleSubmit = () => {
      if (!value.trim()) return;

      // 現在時刻を取得してフォーマット
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const timestamp = `${hours}:${minutes}`;

      // メッセージを追加
      setMessages([
        ...messages,
        {
          id: `sent-${Date.now()}`,
          type: "sent",
          text: value,
          timestamp,
          isRead: false,
        },
      ]);
      // 入力をクリア
      setValue("");

      // 自動返信（デモ用）
      setTimeout(() => {
        const replyNow = new Date();
        const replyHours = replyNow.getHours().toString().padStart(2, "0");
        const replyMinutes = replyNow.getMinutes().toString().padStart(2, "0");
        const replyTimestamp = `${replyHours}:${replyMinutes}`;

        setMessages((prev) => [
          ...prev,
          {
            id: `recv-${Date.now()}`,
            type: "received",
            text: `「${value}」というメッセージを受け取りました`,
            timestamp: replyTimestamp,
          },
        ]);

        // 少し遅れて既読をつける
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.type === "sent" && !msg.isRead
                ? { ...msg, isRead: true }
                : msg,
            ),
          );
        }, 1500);
      }, 1000);
    };

    return (
      <Chat.Wrapper
        onSubmit={() => console.log("スクロールが最下部に移動しました")}
      >
        <Chat.Content>
          {messages.map((msg) => (
            <Chat.Message
              key={msg.id}
              type={msg.type as "sent" | "received"}
              timestamp={msg.timestamp}
              isRead={msg.isRead}
            >
              {msg.text}
            </Chat.Message>
          ))}
        </Chat.Content>
        <Chat.Input value={value} onChange={setValue} onSubmit={handleSubmit} />
      </Chat.Wrapper>
    );
  },
};
