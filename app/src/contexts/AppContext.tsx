import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile, Message, CompanionTag } from "@/types";
import { mockUserProfile, mockCompanionMessages } from "@/data/mockData";

interface AppContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  companionMessages: Message[];
  addCompanionMessage: (message: Message) => void;
  companionTags: CompanionTag[];
  addCompanionTags: (tags: CompanionTag[]) => void;
  textSize: "small" | "medium" | "large";
  setTextSize: (size: "small" | "medium" | "large") => void;
  calmAnimations: boolean;
  setCalmAnimations: (enabled: boolean) => void;
  onlineOnly: boolean;
  setOnlineOnly: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(mockUserProfile);
  const [companionMessages, setCompanionMessages] = useState<Message[]>(mockCompanionMessages);
  const [companionTags, setCompanionTags] = useState<CompanionTag[]>([
    { label: "Gentle introvert", source: "inferred" },
  ]);
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">("medium");
  const [calmAnimations, setCalmAnimations] = useState(true);
  const [onlineOnly, setOnlineOnly] = useState(false);

  const addCompanionMessage = (message: Message) => {
    setCompanionMessages(prev => [...prev, message]);
  };

  const addCompanionTags = (tags: CompanionTag[]) => {
    setCompanionTags(prev => {
      const newTags = tags.filter(
        newTag => !prev.some(existingTag => existingTag.label === newTag.label)
      );
      return [...prev, ...newTags];
    });
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        companionMessages,
        addCompanionMessage,
        companionTags,
        addCompanionTags,
        textSize,
        setTextSize,
        calmAnimations,
        setCalmAnimations,
        onlineOnly,
        setOnlineOnly,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
