import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface PriceTagProps {
  price: number
  currency?: string
  size?: 'small' | 'medium' | 'large'
  highlight?: boolean
}

export default function PriceTag({
  price,
  currency = 'DKK',
  size = 'medium',
  highlight = false,
}: PriceTagProps) {
  const sizeStyles = {
    small: { price: 16, currency: 10 },
    medium: { price: 20, currency: 12 },
    large: { price: 28, currency: 14 },
  }

  const styles = sizeStyles[size]

  return (
    <View style={[baseStyles.container, highlight && baseStyles.highlight]}>
      <Text
        style={[
          baseStyles.price,
          { fontSize: styles.price },
          highlight && baseStyles.highlightText,
        ]}
      >
        {price.toLocaleString('da-DK')}
      </Text>
      <Text
        style={[
          baseStyles.currency,
          { fontSize: styles.currency },
          highlight && baseStyles.highlightText,
        ]}
      >
        {' '}{currency}
      </Text>
    </View>
  )
}

const baseStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  highlight: {
    backgroundColor: 'rgba(0, 225, 171, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  price: {
    fontWeight: '700',
    color: '#dae2fd',
  },
  currency: {
    fontWeight: '400',
    color: '#8f9095',
  },
  highlightText: {
    color: '#00e1ab',
  },
})
