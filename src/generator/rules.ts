import type { UtilityRule } from "../plugins/index";
import { colorRules } from "../utilities/colors";
import { spacingRules } from "../utilities/spacing";
import { typographyRules } from "../utilities/typography";
import { displayRules } from "../utilities/display";
import { flexboxRules } from "../utilities/flexbox";
import { sizingRules } from "../utilities/sizing";
import { borderRules } from "../utilities/borders";
import { effectRules } from "../utilities/effects";

export const UTILITY_RULES: UtilityRule[] = [
  ...typographyRules,
  ...displayRules,
  ...flexboxRules,
  ...sizingRules,
  ...borderRules,
  ...effectRules,
  colorRules,
  ...spacingRules,
];
