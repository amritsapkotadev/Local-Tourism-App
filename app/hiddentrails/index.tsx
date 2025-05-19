import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { MapPin, Clock, TrendingUp, Star, ChevronRight } from 'lucide-react-native';
import { hiddenTrails } from '@/services/hiddentrails';

export default function HiddenTrailsScreen() {
  const renderTrailCard = ({ item }: { item: HiddenTrail }) => (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getDifficultyColor(item.difficulty) }]}
      onPress={() => router.push(`/hiddentrails/${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.name}</Text>
          {item.featured && (
            <View style={styles.featuredBadge}>
              <Star size={14} color="#fff" fill="#fff" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        <View style={styles.locationRow}>
          <MapPin size={16} color="#64748B" />
          <Text style={styles.location}>{item.location}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Clock size={16} color="#64748B" />
            <Text style={styles.statText}>{item.duration}</Text>
          </View>

          <View style={styles.stat}>
            <TrendingUp size={16} color="#64748B" />
            <Text style={styles.statText}>{item.elevationGain}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>

          <View style={styles.ctaContainer}>
            <Text style={styles.ctaText}>Explore Trail</Text>
            <ChevronRight size={18} color="#3B82F6" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Hidden Trails',
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 24,
            color: '#0F172A',
            
          },
          headerShadowVisible: false,
        }}
      />
      <FlatList
        data={hiddenTrails}
        renderItem={renderTrailCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.listHeader}>Hidden Trails</Text>
            <Text style={styles.subHeader}>Explore offbeat trails, filtered by difficulty</Text>
          </View>
        }
      />
    </>
  );
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': 
      return '#10B981';     // Emerald
    case 'moderate': 
      return '#F59E0B';     // Amber
    case 'hard': 
    case 'challenging':     // treat 'challenging' as red
      return '#EF4444';     // Red
    case 'expert': 
      return '#7C3AED';     // Purple
    default: 
      return '#3B82F6';     // Blue
  }
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    backgroundColor: '#F1F5F9', // Softer blue-gray background
  },
  headerContainer: {
    marginBottom: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  listHeader: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    textAlign: 'center',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'capitalize',
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 42,
  },
  subHeader: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 16,
    marginTop: 4,
    lineHeight: 22,
    letterSpacing: 0.25,
  },
  card: {
    borderRadius: 18,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 6,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
        shadowColor: '#000',
      },
    }),
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
    lineHeight: 28,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  featuredText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#475569',
    marginLeft: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#3B82F6',
    marginRight: 6,
    textDecorationLine: 'underline',
  },
});
