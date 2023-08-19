import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, PanResponder, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, Link, useRouter} from "expo-router";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Projects = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  const loadProjectsFromAsyncStorage = async () => {
    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const getProjectPressHandler = (projectIndex) => {
    return () => {
      console.log(projectIndex);
      console.log(JSON.stringify(projects));
      router.push({ pathname: `/${projectIndex}` });
    };
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
  }, []);

  const createProject = () => {
    const newProject = {
      name: `Project ${projects.length + 1}`,
      dancers: [],
      index: `${projects.length}`,
    };
    setProjects([...projects, newProject]);
    saveProjectsToAsyncStorage([...projects, newProject]);
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={createProject}>
        <Text style={styles.buttonText}>Create Project</Text>
      </TouchableOpacity>
      <ScrollView style={styles.projectsContainer}>
        {projects.map((project, projectIndex) => (
          <TouchableOpacity
            key={projectIndex}
            onPress={getProjectPressHandler(project.index)}
            style={[
              styles.projectButton
            ]}>
            <Text>{project.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
});

export default Projects;
