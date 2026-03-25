import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../services/supabase'

interface FormErrors {
  title?: string
  price?: string
  description?: string
}

export default function CreateListingScreen() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('compute')
  const [location, setLocation] = useState('')
  const [isNegotiable, setIsNegotiable] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required'
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Enter a valid price'
    } else if (parseFloat(price) > 1000000) {
      newErrors.price = 'Price seems too high'
    }

    if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    setSuccess(false)

    try {
      if (supabase) {
        const { error } = await supabase.from('listings').insert({
          title,
          description,
          price: parseFloat(price),
          category: category || 'compute',
          location: location || 'Denmark',
          negotiable: isNegotiable,
          status: 'active',
          agent_id: 'manual_post',
        })

        if (error) throw error
      }

      setSuccess(true)
      setTitle('')
      setDescription('')
      setPrice('')
      setCategory('compute')
      setLocation('')
      setErrors({})

      // Navigate to marketplace after success
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (err) {
      Alert.alert('Error', 'Failed to create listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>CREATE LISTING</Text>
      <Text style={styles.subheader}>
        Post a new listing to the marketplace
      </Text>

      {/* Success Message */}
      {success && (
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successText}>Listing created successfully!</Text>
        </View>
      )}

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>TITLE *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="e.g., Industrial GPU Node V3"
          placeholderTextColor="#45474b"
          value={title}
          onChangeText={(text) => {
            setTitle(text)
            if (errors.title) setErrors({ ...errors, title: undefined })
          }}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        <Text style={styles.charCount}>{title.length}/100</Text>
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          placeholder="Describe your offering..."
          placeholderTextColor="#45474b"
          value={description}
          onChangeText={(text) => {
            setDescription(text)
            if (errors.description) setErrors({ ...errors, description: undefined })
          }}
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        <Text style={styles.charCount}>{description.length}/500</Text>
      </View>

      {/* Price */}
      <View style={styles.row}>
        <View style={[styles.field, { flex: 2, marginRight: 12 }]}>
          <Text style={styles.label}>PRICE ($) *</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            placeholder="0.00"
            placeholderTextColor="#45474b"
            value={price}
            onChangeText={(text) => {
              setPrice(text)
              if (errors.price) setErrors({ ...errors, price: undefined })
            }}
            keyboardType="decimal-pad"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>NEGOTIABLE</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isNegotiable}
              onValueChange={setIsNegotiable}
              trackColor={{ false: '#45474b', true: '#00e1ab' }}
              thumbColor={isNegotiable ? '#fff' : '#dae2fd'}
            />
          </View>
        </View>
      </View>

      {/* Category */}
      <View style={styles.field}>
        <Text style={styles.label}>CATEGORY</Text>
        <View style={styles.categoryButtons}>
          {['compute', 'data', 'models', 'services'].map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryBtn,
                category === cat && styles.categoryBtnActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryBtnText,
                  category === cat && styles.categoryBtnTextActive,
                ]}
              >
                {cat.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Location */}
      <View style={styles.field}>
        <Text style={styles.label}>LOCATION</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Aarhus, Denmark"
          placeholderTextColor="#45474b"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* Submit */}
      <Pressable
        style={[styles.submitBtn, loading && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#002f65" />
        ) : (
          <Text style={styles.submitBtnText}>POST LISTING</Text>
        )}
      </Pressable>

      <Pressable
        style={styles.cancelBtn}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.cancelBtnText}>CANCEL</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1326',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    fontFamily: 'Space Grotesk',
    fontSize: 28,
    fontWeight: '700',
    color: '#abc7ff',
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subheader: {
    color: '#8f9095',
    fontSize: 14,
    marginBottom: 32,
  },
  // Success
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 225, 171, 0.1)',
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 2,
    borderLeftColor: '#00e1ab',
  },
  successIcon: {
    fontSize: 20,
    color: '#00e1ab',
    marginRight: 12,
  },
  successText: {
    color: '#00e1ab',
    fontSize: 14,
    fontWeight: '600',
  },
  // Fields
  field: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Space Grotesk',
    fontSize: 10,
    color: '#45474b',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#131b2e',
    padding: 16,
    fontSize: 16,
    color: '#dae2fd',
    borderBottomWidth: 2,
    borderBottomColor: '#222a3d',
  },
  inputError: {
    borderBottomColor: '#ffb4ab',
    backgroundColor: 'rgba(255, 180, 171, 0.05)',
  },
  errorText: {
    color: '#ffb4ab',
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    color: '#45474b',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  switchContainer: {
    backgroundColor: '#131b2e',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#222a3d',
    alignItems: 'flex-start',
  },
  // Category buttons
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    backgroundColor: '#131b2e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#222a3d',
  },
  categoryBtnActive: {
    borderBottomColor: '#abc7ff',
    backgroundColor: '#222a3d',
  },
  categoryBtnText: {
    color: '#8f9095',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  categoryBtnTextActive: {
    color: '#abc7ff',
  },
  // Buttons
  submitBtn: {
    backgroundColor: '#abc7ff',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 24,
  },
  submitBtnText: {
    color: '#002f65',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cancelBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelBtnText: {
    color: '#8f9095',
    fontSize: 14,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.5,
  },
})
