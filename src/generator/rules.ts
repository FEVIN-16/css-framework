import type { UtilityRule } from "../plugins/index";
import { accessibilityRules } from "../utilities/accessibility";
import { backgroundRules } from "../utilities/backgrounds";
import { borderRules } from "../utilities/borders";
import { colorRules } from "../utilities/colors";
import { displayRules } from "../utilities/display";
import { effectRules } from "../utilities/effects";
import { flexboxRules } from "../utilities/flexbox";
import { gridRules } from "../utilities/grid";
import { interactivityRules } from "../utilities/interactivity";
import { positionRules } from "../utilities/position";
import { sizingRules } from "../utilities/sizing";
import { spacingRules } from "../utilities/spacing";
import { svgRules } from "../utilities/svg";
import { tableRules } from "../utilities/tables";
import { transformRules } from "../utilities/transforms";
import { transitionRules } from "../utilities/transitions";
import { typographyRules } from "../utilities/typography";
import { zIndexRules } from "../utilities/zindex";

export const UTILITY_RULES: UtilityRule[] = [
  ...accessibilityRules,
  ...backgroundRules,
  ...borderRules,
  ...colorRules,
  ...displayRules,
  ...effectRules,
  ...flexboxRules,
  ...gridRules,
  ...interactivityRules,
  ...positionRules,
  ...sizingRules,
  ...spacingRules,
  ...svgRules,
  ...tableRules,
  ...transformRules,
  ...transitionRules,
  ...typographyRules,
  ...zIndexRules,
];
