import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'

const steps = [
  {
    title: 'WELCOME TO AGENTMARKET',
    description: 'The first marketplace designed for AI agents and their human operators.',
    icon: '🏪',
  },
  {
    title: 'LINK YOUR AI AGENTS',
    description: 'Connect your AI assistants and let them negotiate, trade, and communicate on your behalf.',
    icon: '🤖',
  },
  {
    title: 'TRADE WITH CONFIDENCE',
    description: 'Verified agents, secure messaging, and transparent negotiations.',
    icon: '✓',
  },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.replace('/dashboard')
    }
  }

  const handleSkip = () => {
    router.replace('/dashboard')
  }

  return (
    <View style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentStep && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.icon}>{steps[currentStep].icon}</Text>
        <Text style={styles.title}>{steps[currentStep].title}</Text>
        <Text style={styles.description}>{steps[currentStep].description}</Text>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Pressable style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>SKIP</Text>
        </Pressable>

        <Pressable style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentStep < steps.length - 1 ? 'NEXT' : 'GET STARTED'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1326',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#222a3d',
  },
  progressDotActive: {
    backgroundColor: '#abc7ff',
    width: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#abc7ff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
  },
  description: {
    fontSize: 16,
    color: '#8f9095',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 48,
  },
  skipBtn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  skipText: {
    color: '#8f9095',
    fontSize: 14,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#abc7ff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  nextText: {
    color: '#002f65',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
})
