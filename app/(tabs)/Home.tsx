import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { Search, ChevronRight, Calendar, MapPin, Star, Compass, Mountain, BookOpen, Footprints, Landmark } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { getTopDestinations, getNearbyAttractions, getCategories } from '@/services/destinationService';
import { Destination, Category } from '@/types';
import DestinationCard from '@/components/DestinationCard';
import SearchBar from '@/components/SearchBar';

const iconMap = {
  Footprints,
  Mountain,
  Landmark,
  MapPin
};

export default function HomeScreen() {
  const [topDestinations, setTopDestinations] = useState<Destination[]>([]);
  const [nearbyAttractions, setNearbyAttractions] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    loadData();
    requestLocationPermission();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [topDest, categoriesData] = await Promise.all([
        getTopDestinations(),
        getCategories()
      ]);
      
      setTopDestinations(topDest);
      setCategories(categoriesData);
      
      // Load nearby attractions after getting location
      if (location) {
        const nearby = await getNearbyAttractions(
          location.coords.latitude,
          location.coords.longitude
        );
        setNearbyAttractions(nearby);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert(
        'Error Loading Data',
        'Please check your internet connection and try again.',
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        // Update nearby attractions with location
        const nearby = await getNearbyAttractions(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        setNearbyAttractions(nearby);
      } else {
        Alert.alert(
          'Location Access Required',
          'To show you nearby attractions, we need access to your location. You can enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.openSettings() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location:', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleDestinationPress = (id: string) => {
    router.push(`/destination/${id}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    if (categoryId === 'hidden-trails') {
      router.push('/hiddentrails');
    } else if (categoryId === 'nearby') {
      if (!location) {
        Alert.alert(
          'Location Required',
          'Please enable location services to see nearby attractions.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Enable Location', onPress: requestLocationPermission }
          ]
        );
        return;
      }
      router.push('/nearby');
    } else {
      router.push(`/category/${categoryId}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Namaste</Text>
          <Text style={styles.headerTitle}>Discover Nepal's Hidden Gems</Text>
        </View>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg' }}
          style={styles.avatar}
        />
      </View>

      <SearchBar value={searchQuery} onChangeText={handleSearch} />

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Explore Nepal</Text>
        <View style={styles.categoriesGrid}>
          {categories.map(category => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.8}
              >
                <IconComponent color="#FFFFFF" size={32} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <TouchableOpacity 
            onPress={() => router.push('/discover')}
            style={styles.viewAllButton}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color="#1E40AF" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={topDestinations}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DestinationCard 
              destination={item} 
              onPress={() => handleDestinationPress(item.id)}
            />
          )}
          contentContainerStyle={styles.destinationsList}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Attractions</Text>
          <TouchableOpacity 
            onPress={() => router.push('/map')}
            style={styles.viewAllButton}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View Map</Text>
            <ChevronRight size={16} color="#1E40AF" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={nearbyAttractions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DestinationCard 
              destination={item} 
              onPress={() => handleDestinationPress(item.id)}
              compact
            />
          )}
          contentContainerStyle={styles.destinationsList}
        />
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1E40AF',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#1E293B',
    width: '90%',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  categoriesContainer: {
    padding: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  categoryCard: {
    width: '47%',
    padding: 10,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 12,
  },
  categoryDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: 4,
    opacity: 0.9,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1E40AF',
    marginRight: 4,
  },
  destinationsList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  spacer: {
    height: 100,
  },
});