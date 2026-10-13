import React from "react";
import { SERVER_ORIGIN } from "../services/api";
import defaultProfileImg from "../assets/MyImg.webp";
import defaultResumePdf from "../assets/My_Cv.pdf";
import airbnbImg from "../assets/airbnb.png";
import arkartImg from "../assets/arkart.png";
import jobPortalImg from "../assets/job-portal.png";
import eventPlannerImg from "../assets/event-planner.png";
import weatherAppImg from "../assets/weather-app.png";
import noteAppImg from "../assets/note-app.png";
import playerImg from "../assets/player.png";
import foreignExchangeImg from "../assets/foreign-exchange.png";
import ticTacToeImg from "../assets/tic-tac-toe.png";
import pssLogoImg from "../assets/PSS_logo.svg";

import {
  Server,
  Layout,
  Smartphone,
  Terminal,
  GraduationCap,
  Layers,
  Code2,
  Database,
  Cpu,
  Globe,
  GitBranch,
  Shield,
  Zap,
  FolderGit2,
  CheckCircle2,
} from "lucide-react";

export const PROJECT_IMAGES = {
  airbnb: airbnbImg,
  arkart: arkartImg,
  "job-portal": jobPortalImg,
  "event-planner": eventPlannerImg,
  "weather-app": weatherAppImg,
  "note-app": noteAppImg,
  player: playerImg,
  "foreign-exchange": foreignExchangeImg,
  "tic-tac-toe": ticTacToeImg,
  PSS_logo: pssLogoImg,
};

export const AVAILABLE_ICONS = {
  Server,
  Layout,
  Smartphone,
  Terminal,
  GraduationCap,
  Layers,
  Code2,
  Database,
  Cpu,
  Globe,
  GitBranch,
  Shield,
  Zap,
  FolderGit2,
  CheckCircle2,
};

export const AVAILABLE_ICON_NAMES = Object.keys(AVAILABLE_ICONS);

function formatMediaUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("/uploads/") && SERVER_ORIGIN) {
    return `${SERVER_ORIGIN}${url}`;
  }
  return url;
}

export function resolveProjectImage(project) {
  if (!project) return airbnbImg;
  if (project.img) return formatMediaUrl(project.img);
  if (project.imageUrl && typeof project.imageUrl === "string" && project.imageUrl.trim() !== "") {
    return formatMediaUrl(project.imageUrl);
  }
  if (project.imageKey && PROJECT_IMAGES[project.imageKey]) {
    return PROJECT_IMAGES[project.imageKey];
  }
  return airbnbImg;
}

export function resolveProfileImage(customUrl) {
  if (customUrl && typeof customUrl === "string" && customUrl.trim() !== "") {
    return formatMediaUrl(customUrl);
  }
  return defaultProfileImg;
}

export function resolveResumeUrl(customUrl) {
  if (customUrl && typeof customUrl === "string" && customUrl.trim() !== "") {
    return formatMediaUrl(customUrl);
  }
  return defaultResumePdf;
}

export function getDynamicIcon(iconName, defaultIcon = Server, props = {}) {
  const Component = AVAILABLE_ICONS[iconName] || defaultIcon;
  return React.createElement(Component, props);
}
