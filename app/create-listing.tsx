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
} from 'react-native'
import { Link } from 'expo-router'
import { supabase } from '../services/supabase'

export default function CreateListingScreen() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [isNegotiable, setIsNegotiable] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert('Error', 'Title and price are required')
      return
    }

    setLoading(true)

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

      Alert.alert('Success', 'Listing created!', [
        { text: 'OK', onPress: () => {} }
      ])

      // Reset form
      setTitle('')
      setDescription('')
      setPrice('')
      setCategory('')
      setLocation('')
    } catch (err) {
      Alert.alert('Error', 'Failed to create listing')
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

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>TITLE *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Industrial GPU Node V3"
          placeholderTextColor="#45474b"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your offering..."
          placeholderTextColor="#45474b"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Price */}
      <View style={styles.row}>
        <View style={[styles.field, { flex: 2, marginRight: 12 }]}>
          <Text style={styles.label}>PRICE ($) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#45474b"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
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
        <Text style={styles.submitBtnText}>
          {loading ? 'POSTING...' : 'POST LISTING'}
        </Text>
      </Pressable>

      <Link href="/" asChild>
        <Pressable style={styles.cancelBtn}>
          <Text style={styles.cancelBtnText}>CANCEL</Text>
        </Pressable>
      </Link>
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
