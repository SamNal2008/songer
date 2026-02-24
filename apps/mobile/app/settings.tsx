import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { integrationPlaceholders } from '../src/config/integrations';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Integrations are scaffolded and can be wired when keys are ready.</Text>

        <View style={styles.stackList}>
          {integrationPlaceholders.map((integration) => (
            <View key={integration.name} style={styles.stackRow}>
              <View>
                <Text style={styles.stackName}>{integration.name}</Text>
                <Text style={styles.stackKeys}>{integration.envKeys.join(', ')}</Text>
              </View>
              <Text style={integration.configured ? styles.ready : styles.pending}>
                {integration.configured ? 'Ready' : 'Pending'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  container: {
    gap: 16,
    padding: 18,
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
  stackList: {
    gap: 10,
    marginTop: 8,
  },
  stackRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  stackName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  stackKeys: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    maxWidth: 250,
  },
  ready: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '700',
  },
  pending: {
    color: '#9A3412',
    fontSize: 13,
    fontWeight: '700',
  },
});
