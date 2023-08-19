import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, PanResponder, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useNavigation, useRouter, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you want to use FontAwesome icons

const Formations = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams(); // Retrieve the project details from local search parameters
  const projectIndex = params.project;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToolbar, setShowToolbar] = useState(false);
  const [selectedDancerIndex, setSelectedDancerIndex] = useState(null);
   
  const loadProjectsFromAsyncStorage = async () => {
    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
      setLoading(false); // Set loading to false once projects are loaded
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

   
  const saveProjectsToAsyncStorage = async (updatedProjects) => {
    try {
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  useEffect(() => {
    loadProjectsFromAsyncStorage();
  }, [projectIndex]);

  const addDancerToProject = (projectIndex) => {
    const newDancer = {
      x: 100, // Initial x-coordinate
      y: 100, // Initial y-coordinate
    };
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].dancers.push(newDancer);
    setProjects(updatedProjects);
    saveProjectsToAsyncStorage(updatedProjects);
  };
  
  const removeDancer = (dancerIndex) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].dancers.splice(dancerIndex, 1);
    setProjects(updatedProjects);
    saveProjectsToAsyncStorage(updatedProjects);
  };
  
  const createPanResponder = (dancerIndex) =>
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
        setShowToolbar(true);
        setSelectedDancerIndex(dancerIndex);
      },
    onPanResponderMove: (evt, gestureState) => {
      // Handle dancer movement here
      const updatedProjects = [...projects];
      updatedProjects[projectIndex].dancers[dancerIndex].x += gestureState.dx;
      updatedProjects[projectIndex].dancers[dancerIndex].y += gestureState.dy;
      setProjects(updatedProjects);
    },
    onPanResponderRelease: () => {
      // Snap dancer position to grid
      const gridSize = 50; // Adjust the grid size as needed
      const updatedProjects = [...projects];
      const dancer = updatedProjects[projectIndex].dancers[dancerIndex];
      dancer.x = Math.round(dancer.x / gridSize) * gridSize;
      dancer.y = Math.round(dancer.y / gridSize) * gridSize;
      setProjects(updatedProjects);

      // Save the updated dancer positions
      saveProjectsToAsyncStorage(updatedProjects);
    },
  });



  if (loading) {
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        );
  }
    return (
      <View style={styles.container}>
        <Text>{projects[projectIndex].name}</Text>   
          <React.Fragment>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => addDancerToProject(projectIndex)}>
              <Text style={styles.buttonText}>Add Dancer</Text>
            </TouchableOpacity>
            {projects[projectIndex].dancers.map((dancer, dancerIndex) => (
              <View
                key={dancerIndex}
                style={[styles.dancer, { left: dancer.x, top: dancer.y }]}
                {...createPanResponder(dancerIndex).panHandlers}
              />
            ))}
          </React.Fragment>
          {showToolbar && selectedDancerIndex !== null && (
  <View style={styles.toolbar}>
    <TouchableOpacity
      onPress={() => {
        removeDancer(selectedDancerIndex);
        setShowToolbar(false);
        setSelectedDancerIndex(null);
      }}
    >
      <Icon name="trash" size={20} color="red" />
    </TouchableOpacity>
  </View>
)}

      </View>
      
    );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  projectsContainer: {
    flex: 1,
    marginTop: 10,
  },
  projectButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  focusedProject: {
    backgroundColor: 'lightblue',
  },
  dancer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    position: 'absolute',
  },
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  
});

export default Formations;
