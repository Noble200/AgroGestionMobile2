import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View } from 'react-native';

// IMPORTAR TODOS TUS CONTEXTOS DE CAMPO-APP (sin cambios)
import { AuthProvider } from './src/contexts/AuthContext';
import { StockProvider } from './src/contexts/StockContext';
import { FumigationProvider } from './src/contexts/FumigationContext';
import { TransferProvider } from './src/contexts/TransferContext';
import { HarvestProvider } from './src/contexts/HarvestContext';
import { ExpenseProvider } from './src/contexts/ExpenseContext';
import { UsersProvider } from './src/contexts/UsersContext';
import { ActivityProvider } from './src/contexts/ActivityContext';

// Pantallas nativas (nuevas)
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
                        
                        {/* Stack Navigator */}
                        <Stack.Navigator
                          initialRouteName="Login"
                          screenOptions={{
                            headerStyle: {
                              backgroundColor: theme.primary,
                              elevation: 4,
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.25,
                              shadowRadius: 4,
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                              fontWeight: 'bold',
                              fontSize: 18,
                            },
                            cardStyle: {
                              backgroundColor: theme.background,
                            },
                          }}
                        >
                          <Stack.Screen 
                            name="Login" 
                            component={LoginScreen}
                            options={{ headerShown: false }}
                          />
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
                        </Stack.Navigator>
                        
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