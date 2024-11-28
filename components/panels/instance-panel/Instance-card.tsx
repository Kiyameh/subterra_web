import React from "react";
import Link from "next/link";
import LinkButton from "@/components/navigation/link-button";
import InfoBadge from "@/components/displaying/info-badge";
import OnlineIndicator from "@/components/displaying/online-indicator";
import { PopulatedInstance } from "@/database/models/Instance.model";

import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { MdOutlineTravelExplore } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { MdVisibility } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { MdMoreTime } from "react-icons/md";
import { HiLink } from "react-icons/hi";

interface InstanceCardProps {
  instance: PopulatedInstance;
}
export default function InstanceCard({ instance }: InstanceCardProps) {
  const {
    name,
    is_online,
    territory,
    owner,
    public_visibility,
    public_edition,
    fullname,
    description,
    createdAt,
  } = instance;

  return (
    <Card className="w-80 max-w-[90%] border border-gray-600">
      <CardHeader>
        <div className="flex items-center gap-2">
          <OnlineIndicator isOnline={is_online} />
          <CardTitle>{fullname}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {territory && (
            <div className="flex items-center gap-2">
              <MdOutlineTravelExplore />
              {territory}
            </div>
          )}

          {owner && (
            <Link
              className="flex items-center gap-2"
              href={`/group/${owner.name}`}
            >
              <RiAdminLine />
              {owner.fullname}
              <HiLink className="text-primary" />
            </Link>
          )}
          {public_visibility && (
            <div className="flex items-center gap-2">
              <MdVisibility />
              Visibilidad:{" "}
              {public_visibility ? (
                <InfoBadge
                  label="Pública"
                  description="Cualquier persona puede ver"
                />
              ) : (
                <InfoBadge
                  label="Solo autorizados"
                  description="Solo usuarios autorizados"
                />
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <MdModeEdit />
            Edición:{" "}
            {public_edition ? (
              <InfoBadge
                label="Solo registrados"
                description="Solo usarios registrados en Subterra"
              />
            ) : (
              <InfoBadge
                label="Privada"
                description="Solo usuarios autorizados"
              />
            )}
          </div>
          {createdAt && (
            <div className="flex items-center gap-2">
              <MdMoreTime />
              {`Creado el ${new Date(createdAt).toLocaleDateString()}`}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <LinkButton
          href={`/instance/${name}`}
          label="Acceder"
          disabled={!instance.is_online}
        />
      </CardFooter>
    </Card>
  );
}
