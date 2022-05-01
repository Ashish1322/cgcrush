import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Button, LogBox } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  LogBox.ignoreLogs(['Warning: ...']);
  return (
    <NavigationContainer>
      
    <AuthProvider>
        <StackNavigator /> 
      </AuthProvider>
        
      
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
 
});
