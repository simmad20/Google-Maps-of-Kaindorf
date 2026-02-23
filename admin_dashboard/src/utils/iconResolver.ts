import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

/**
 * Wandelt einen String aus der DB in ein Lucide-Icon um
 * z. B. "graduation-cap" → GraduationCap
 */
export function resolveIcon(iconName?: string): LucideIcon {
    if (!iconName) return Icons.Box;

    const pascalCase = iconName
        .split("-")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

    return (Icons as unknown as Record<string, LucideIcon>)[pascalCase] ?? Icons.Box;
}