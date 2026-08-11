import { AntDesign } from '@expo/vector-icons';

// Google's brand blue. Swap this component for a react-native-svg
// multi-color "G" if fuller brand fidelity is ever needed.
export function GoogleIcon({ size = 18, color = '#4285F4' }: { size?: number; color?: string }) {
  return <AntDesign name="google" size={size} color={color} />;
}