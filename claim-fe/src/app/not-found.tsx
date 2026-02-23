
import Lamp404 from "@/components/404/lamp";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Page Not Found | CLAIM Example",
  description:
    "CLAIM Example Error 404 page for CLAIM Example",
};

export default function NotFound() {
  return (
    <Lamp404 />
  );
}
