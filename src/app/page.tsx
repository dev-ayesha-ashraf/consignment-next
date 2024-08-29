"use client";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import useAuth from "@/hooks/useAuth";
import Login from "@/components/Login";
import ConsignmentForm from "@/components/ConsignmentForm";
import ConsignmentTable from "@/components/ConsignmentTable";
import MainComponent from "@/components/MainComponent";

const Main = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

const RenderPage = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Login />;
  }

  return user.isAdmin ? <ConsignmentTable /> : <MainComponent />;
};

const Page = () => {
  return (
    <Main>
      <RenderPage />
    </Main>
  );
};

export default Page;
