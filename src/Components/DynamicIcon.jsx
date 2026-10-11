import PropTypes from "prop-types";
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

export const ICON_MAP = {
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

function DynamicIcon({ name, size = 20, className = "", defaultIcon = Server }) {
  const IconComponent = ICON_MAP[name] || defaultIcon;
  return <IconComponent size={size} className={className} />;
}

DynamicIcon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  defaultIcon: PropTypes.elementType,
};

export default DynamicIcon;
