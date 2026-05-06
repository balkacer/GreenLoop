import { Share } from 'react-native';

export async function shareText(title: string, message: string): Promise<void> {
  await Share.share({ title, message });
}
