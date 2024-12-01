"use client";
import React from "react";
import ResponsiveTooltip from "@/components/displaying/responsive-tooltip";
import { Badge } from "@/components/ui/badge";
import { SidebarGroup, useSidebar } from "@/components/ui/sidebar";

interface SidebarRoleIndicatorProps {
  isEditor: boolean;
  isAdmin: boolean;
  editorTag?: string;
  adminTag?: string;
  editorText?: string;
  adminText?: string;
}
/**
 * Componente para sidebar que indica el rol del usuario
 * @param isEditor
 * @param isAdmin
 * @param editorTag default: 'Editor'
 * @param adminTag default: 'Admin'
 * @param editorText default: 'Eres editor de esta instancia'
 * @param adminText default: 'Eres administrador de esta instancia'
 */

export default function SidebarRoleIndicator({
  isEditor,
  isAdmin,
  editorTag = "Editor",
  adminTag = "Admin",
  editorText = "Eres editor de esta instancia",
  adminText = "Eres administrador de esta instancia",
}: SidebarRoleIndicatorProps) {
  const isOpen = useSidebar().open;
  return (
    <SidebarGroup className="flex flex-row gap-2">
      {isEditor && isOpen && (
        <ResponsiveTooltip content={editorText}>
          <Badge className="w-fit cursor-help border-2 border-editor/70 bg-sidebar text-editor/70 hover:bg-card">
            {editorTag}
          </Badge>
        </ResponsiveTooltip>
      )}
      {isAdmin && isOpen && (
        <ResponsiveTooltip content={adminText}>
          <Badge className="w-fit cursor-help border-2 border-admin/70 bg-sidebar text-admin/70 hover:bg-card">
            {adminTag}
          </Badge>
        </ResponsiveTooltip>
      )}
    </SidebarGroup>
  );
}