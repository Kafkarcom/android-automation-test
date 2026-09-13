import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [error, setError] = useState('');

  function sayHello() {
    const trimmed = name.trim();

    if (!trimmed) {
      console.error('[E2E] Empty name submitted');
      setGreeting('');
      setError('Please enter your name');
      return;
    }

    console.log(`[E2E] Greeting generated for ${trimmed}`);
    setError('');
    setGreeting(`Hello, ${trimmed}!`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>AI Automation Demo</Text>
        <Text style={styles.subtitle}>
          A tiny Expo app designed to be controlled by an automated test runner.
        </Text>

        <TextInput
          testID="name-input"
          accessibilityLabel="Name input"
          placeholder="Enter your name"
          value={name}
          onChangeText={(value) => {
            setName(value);
            setError('');
          }}
          style={styles.input}
        />

        <Pressable
          testID="hello-button"
          accessibilityLabel="Say hello"
          onPress={sayHello}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Say hello</Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {greeting ? <Text style={styles.greeting}>{greeting}</Text> : null}

        <Text style={styles.status}>TEST_STATUS: READY</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#555', lineHeight: 23, marginBottom: 28 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 18,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 17, fontWeight: '600' },
  error: { marginTop: 16, fontSize: 16, color: '#b00020' },
  greeting: { marginTop: 16, fontSize: 22, fontWeight: '600' },
  status: { marginTop: 40, fontSize: 13, color: '#777' },
});
