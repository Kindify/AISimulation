import type { Role } from "./types";

/** Default institutional cast, used by any scenario that does not define its own `roles`. */
export const DEFAULT_ROLES: Role[] = [
  {
    id: "regulator",
    name: "The Regulator",
    icon: "🏛️",
    color: "#f59e0b",
    bg: "#f59e0b18",
    role: "You set policy and have formal authority to act. Your objective is public safety and institutional credibility.",
    incentive: "Political pressure to act fast OR appear measured. Your legitimacy depends on due process, but the crisis won't wait for process."
  },
  {
    id: "platform",
    name: "The Platform",
    icon: "📱",
    color: "#06b6d4",
    bg: "#06b6d418",
    role: "You control content distribution and user access. Your objective is a safe, trustworthy platform ecosystem.",
    incentive: "Revenue depends on engagement and growth. Legal liability pushes toward caution. Acting alone while competitors don't costs you users."
  },
  {
    id: "journalist",
    name: "The Journalist",
    icon: "📰",
    color: "#10b981",
    bg: "#10b98118",
    role: "You shape the public narrative through investigation and reporting. Your objective is informing the public accurately.",
    incentive: "Editorial pressure to publish fast and first. Competitor outlets are working the same story. Speed and accuracy pull in opposite directions."
  },
  {
    id: "ailab",
    name: "The AI Lab",
    icon: "🔬",
    color: "#a855f7",
    bg: "#a855f718",
    role: "You develop the technology and hold unique technical knowledge. Your objective is responsible development and deployment.",
    incentive: "Transparency has competitive costs. Competitors who don't share safety findings gain an advantage. Legal exposure increases with disclosure."
  },
];

export function rolesFor(scenario: { roles?: Role[] } | null | undefined): Role[] {
  return scenario?.roles && scenario.roles.length > 0 ? scenario.roles : DEFAULT_ROLES;
}
