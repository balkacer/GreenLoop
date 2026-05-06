import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import LogoMainClean from '../../../assets/brand/logo_green_loop_main_clean.svg';
import LogoMainCleanBlack from '../../../assets/brand/logo_green_loop_main_clean_black.svg';
import LogoMainCleanWhite from '../../../assets/brand/logo_green_loop_main_clean_white.svg';
import LogoSymbolBlack from '../../../assets/brand/logo_green_loop_symbol_black.svg';
import LogoSymbolGreen from '../../../assets/brand/logo_green_loop_symbol_green.svg';
import LogoSymbolWhite from '../../../assets/brand/logo_green_loop_symbol_white.svg';

/** viewBox altura / ancho según cada archivo SVG */
const ASPECT_BY_VARIANT: Record<GreenLoopLogoVariant, number> = {
  symbol_green: 274 / 450,
  symbol_black: 274 / 450,
  symbol_white: 274 / 450,
  main_clean: 746 / 1117,
  main_clean_black: 746 / 1117,
  main_clean_white: 746 / 1117,
};

export type GreenLoopLogoVariant =
  | 'symbol_green'
  | 'symbol_black'
  | 'symbol_white'
  | 'main_clean'
  | 'main_clean_black'
  | 'main_clean_white';

const VARIANT_COMPONENT: Record<
  GreenLoopLogoVariant,
  React.FC<SvgProps>
> = {
  symbol_green: LogoSymbolGreen,
  symbol_black: LogoSymbolBlack,
  symbol_white: LogoSymbolWhite,
  main_clean: LogoMainClean,
  main_clean_black: LogoMainCleanBlack,
  main_clean_white: LogoMainCleanWhite,
};

export interface GreenLoopLogoProps extends Omit<SvgProps, 'width' | 'height'> {
  /** Por defecto `symbol_green` (recomendado para marca en app). */
  variant?: GreenLoopLogoVariant;
  /** Ancho en px; la altura se calcula con la proporción del arte (450×274). */
  width?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Logos vectoriales desde `src/assets/brand/` (copia de `/lgo` en la raíz del monorepo).
 */
export function GreenLoopLogo({
  variant = 'symbol_green',
  width = 168,
  style,
  accessibilityLabel = 'GreenLoop',
  ...svgRest
}: GreenLoopLogoProps) {
  const SvgComp = VARIANT_COMPONENT[variant];
  const height = width * ASPECT_BY_VARIANT[variant];
  return (
    <SvgComp
      width={width}
      height={height}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={style}
      {...svgRest}
    />
  );
}
