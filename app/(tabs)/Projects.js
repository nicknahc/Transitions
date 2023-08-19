import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, PanResponder, TouchableOpacity, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, Link, useRouter } from "expo-router";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you want to use FontAwesome icons

const Projects = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
   
  const getProjectPressHandler = (projectIndex) => {
    return () => {
      console.log(projectIndex);
      console.log(JSON.stringify(projects));
      router.push({ pathname: `/${projectIndex}` });
    };
  };
  
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

  const finishEditingProjectName = (projectIndex) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].editing = false;
    setProjects(updatedProjects);
    saveProjectsToAsyncStorage(updatedProjects);
  };

  const handleProjectNameChange = (projectIndex, newName) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].name = newName;
    setProjects(updatedProjects);
  };

  const cancelEditingProjectName = (projectIndex) => {
    const updatedProjects = [...projects];
    if (updatedProjects[projectIndex].originalName) {
      updatedProjects[projectIndex].name = updatedProjects[projectIndex].originalName;
    }
    updatedProjects[projectIndex].editing = false;
    setProjects(updatedProjects);
  };

  const editProjectName = (projectIndex) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].editing = true;
    updatedProjects[projectIndex].originalName = updatedProjects[projectIndex].name;
    setProjects(updatedProjects);
  };

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
          <View key={projectIndex} style={styles.projectItem}>
            <TouchableOpacity
              onPress={getProjectPressHandler(project.index)}
              style={[styles.projectButton]}
            >
              {project.editing ? (
                <View style={styles.editableProjectNameContainer}>
                  <TextInput
                    style={styles.editableProjectName}
                    value={project.name}
                    onChangeText={(newName) =>
                      handleProjectNameChange(projectIndex, newName)
                    }
                    autoFocus
                  />
                  <View style={styles.editButtonsContainer}>
                    <TouchableOpacity
                      onPress={() => finishEditingProjectName(projectIndex)}
                    >
                      <Text style={styles.saveButton}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => cancelEditingProjectName(projectIndex)}
                    >
                      <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text>{project.name}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => editProjectName(projectIndex)}
              style={styles.editButton}
            >
              <Icon name="edit" size={20} color="gray" />
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editableProjectName: {
    flex: 1,
    fontSize: 16,
  },
  editButton: {
    paddingHorizontal: 10,
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
  editableProjectNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editableProjectName: {
    flex: 1,
    fontSize: 16,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    color: 'green',
    marginRight: 10,
  },
  cancelButton: {
    color: 'red',
  },
});

export default Projects;
