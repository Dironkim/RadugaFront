import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as signalR from "@microsoft/signalr"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let connection: signalR.HubConnection | null = null

export const getConnection = () =>{ 
  if (!connection){
  connection = new signalR.HubConnectionBuilder()
  .withUrl(import.meta.env.VITE_SERVER_URL+"/chathub", {
    accessTokenFactory: () => localStorage.getItem("token") ?? ""
  })
  .withAutomaticReconnect()
  .build()
  }
  return connection
}
