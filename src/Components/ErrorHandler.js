import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ErrorHandler = ({ 
  error, 
  onDismiss, 
  type = 'error', // 'error', 'success', 'warning', 'info'
  duration = 4000,
  position = 'top' // 'top', 'bottom'
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(position === 'top' ? -100 : 100));

  useEffect(() => {
    if (error) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [error]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  if (!error) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          icon: 'check-circle',
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          icon: 'warning',
          iconColor: '#FFFFFF',
        };
      case 'info':
        return {
          backgroundColor: '#3B82F6',
          icon: 'info',
          iconColor: '#FFFFFF',
        };
      default: // error
        return {
          backgroundColor: '#EF4444',
          icon: 'error',
          iconColor: '#FFFFFF',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          [position]: 20,
        },
      ]}
    >
      <View style={[styles.errorContainer, { backgroundColor: typeStyles.backgroundColor }]}>
        <MaterialIcons 
          name={typeStyles.icon} 
          size={20} 
          color={typeStyles.iconColor} 
          style={styles.icon}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <MaterialIcons name="close" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  errorText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});

export default ErrorHandler;
