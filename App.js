import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, ActivityIndicator } from 'react-native';

// IMPORTAR TODOS TUS CONTEXTOS DE CAMPO-APP (sin cambios)
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { StockProvider } from './src/contexts/StockContext';
import { FumigationProvider } from './src/contexts/FumigationContext';
import { TransferProvider } from './src/contexts/TransferContext';
import { HarvestProvider } from './src/contexts/HarvestContext';
import { ExpenseProvider } from './src/contexts/ExpenseContext';
import { UsersProvider } from './src/contexts/UsersContext';
import { ActivityProvider } from './src/contexts/ActivityContext';

// Pantallas nativas
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import TransfersScreen from './src/screens/TransfersScreen';
import FumigationsScreen from './src/screens/FumigationsScreen';
import FieldsScreen from './src/screens/FieldsScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';

const Stack = createStackNavigator();

// Colores de tu tema (igual que campo-app)
const theme = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  secondary: '#2196F3',
  warning: '#FF9800',
  danger: '#F44336',
  background: '#f8f9fa'
};

// Componente que maneja la navegación según autenticación
const AppNavigator = () => {
  const { currentUser, loading } = useAuth();

  // Pantalla de carga mientras verifica autenticación
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={currentUser ? "Dashboard" : "Login"}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!currentUser ? (
        // Stack de autenticación
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        // Stack de aplicación autenticada
        <>
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ 
              title: 'Panel Principal',
              headerLeft: null, // No botón de volver
            }}
          />
          <Stack.Screen 
            name="Products" 
            component={ProductsScreen}
            options={{ title: 'Productos' }}
          />
          <Stack.Screen 
            name="Transfers" 
            component={TransfersScreen}
            options={{ title: 'Transferencias' }}
          />
          <Stack.Screen 
            name="Fumigations" 
            component={FumigationsScreen}
            options={{ title: 'Fumigaciones' }}
          />
          <Stack.Screen 
            name="Fields" 
            component={FieldsScreen}
            options={{ title: 'Campos' }}
          />
          <Stack.Screen 
            name="Expenses" 
            component={ExpensesScreen}
            options={{ title: 'Gastos' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        backgroundColor={theme.primary} 
        barStyle="light-content" 
      />
      
      <NavigationContainer>
        {/* TODOS TUS CONTEXTOS DE CAMPO-APP (orden exacto) */}
        <AuthProvider>
          <ActivityProvider>
            <StockProvider>
              <FumigationProvider>
                <TransferProvider>
                  <HarvestProvider>
                    <ExpenseProvider>
                      <UsersProvider>
                        
                        <AppNavigator />
                        
                      </UsersProvider>
                    </ExpenseProvider>
                  </HarvestProvider>
                </TransferProvider>
              </FumigationProvider>
            </StockProvider>
          </ActivityProvider>
        </AuthProvider>
      </NavigationContainer>
    </View>
  );
};

export default App;