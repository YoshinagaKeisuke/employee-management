import {
  Mail,
  Phone,
  User,
  Calendar,
  FileText,
  Building2,
  Briefcase,
  MapPin,
  Clock,
} from "lucide-react";

export const employeeFields = [
  { key: "email", label: "メールアドレス", icon: Mail, color: "blue" },
  { key: "phoneNumber", label: "電話番号", icon: Phone, color: "green" },
  { key: "gender", label: "性別", icon: User, color: "purple" },
  { key: "birthDate", label: "生年月日", icon: Calendar, color: "red" },
  { key: "employeeNumber", label: "社員番号", icon: FileText, color: "yellow" },
  { key: "department", label: "部署", icon: Building2, color: "indigo" },
  { key: "position", label: "役職", icon: Briefcase, color: "pink" },
  { key: "location", label: "拠点", icon: MapPin, color: "teal" },
  { key: "hireDate", label: "入社年月日", icon: Calendar, color: "orange" },
  { key: "updatedAt", label: "最終更新日", icon: Clock, color: "gray" },
];

export const personalInfoFields = [
  "lastName",
  "firstName",
  "lastNameKana",
  "firstNameKana",
];

export const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
  yellow: "bg-yellow-50 text-yellow-600",
  indigo: "bg-indigo-50 text-indigo-600",
  pink: "bg-pink-50 text-pink-600",
  teal: "bg-teal-50 text-teal-600",
  orange: "bg-orange-50 text-orange-600",
  gray: "bg-gray-50 text-gray-600",
};

export const requiredFields = [
  "lastName",
  "firstName",
  "email",
  "employeeNumber",
  "department",
  "hireDate",
];
