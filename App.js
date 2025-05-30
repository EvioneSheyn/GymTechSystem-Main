import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  ImageBackground,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

// Import your background image (make sure you have this image in your project)
const backgroundImage = require('./assets/barbel.jpg');

export default function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = () => setIsSignUp(!isSignUp);

  const handleAuth = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    if (isSignUp) {
      Alert.alert('Sign Up', `Email: ${email}\nPassword: ${password}`);
    } else {
      Alert.alert('Login', `Email: ${email}\nPassword: ${password}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.gradientShape} />

        <Text style={styles.welcomeTitle}>Welcome to
          <Text style={styles.wTitle}> GYMTECH</Text>
        </Text>

        <View style={styles.innerContainer}>
          <Text style={styles.title}>{isSignUp ? 'Create Account' : 'L O G I N'}</Text>

          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="email"
              size={24}
              color="#4e8cff"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { paddingLeft: 50 }]}
              placeholder="Email"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoComplete="email"
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIconWrapper}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#4e8cff"
              />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, { paddingLeft: 50 }]}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              autoComplete="password"
              textContentType="password"
            />
          </View>

          <Pressable
            onPress={handleAuth}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
          </Pressable>

          <TouchableOpacity onPress={toggleMode} activeOpacity={0.7}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'Already have an account? Login'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gradientShape: {
    position: 'absolute',
    top: -200,
    left: -150,
    width: 400,
    height: 400,
    backgroundColor: '#4e8cff',
    borderRadius: 200,
    transform: [{ rotate: '-25deg' }],
    opacity: 0.15,
    zIndex: 0,
  },
  welcomeTitle: {
    fontFamily: 'poppins',
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 40,
    color: '#131833',
    letterSpacing: 2,
    zIndex: 1,

    // Highlight styles
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // translucent white
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,

    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wTitle:{
   fontFamily: 'georgia',
  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 28,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 15,
    zIndex: 1,
  },
  title: {
    fontFamily: 'georgia',
    fontSize: 33,
    fontWeight: '700',
    marginBottom: 28,
    textAlign: 'center',
    color: 'white',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 28,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 2,
  },
  eyeIconWrapper: {
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 2,
  },
  input: {
    height: 52,
    borderColor: '#bbb',
    borderWidth: 1.8,
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#131833',
    color: 'white',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4e8cff',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
    shadowColor: '#3b74f2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    backgroundColor: '#3b74f2',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  toggleText: {
    color: '#1015b3',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
