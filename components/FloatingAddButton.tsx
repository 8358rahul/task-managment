import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { ms, ScaledSheet } from 'react-native-size-matters';

export default function FloatingAddButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="add" size={ms(28)} color={Colors.white} />
    </TouchableOpacity>
  );
}

const styles = ScaledSheet.create({
  fab: {
    position: 'absolute',
    bottom: "20@vs",
    right: "24@s",
    backgroundColor: Colors.primary,
    width: "56@ms",
    height: "56@ms",
    borderRadius: "28@ms",
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
