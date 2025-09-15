import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// USAR TU CONTROLADOR DE CAMPO-APP (sin cambios)
import useDashboardController from '../controllers/DashboardController';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  // TU CONTROLADOR EXACTAMENTE IGUAL QUE EN CAMPO-APP
  const {
    stats,
    lowStockProducts,
    expiringSoonProducts,
    pendingTransfers,
    pendingFumigations,
    upcomingHarvests,
    loading,
    error,
    refreshData
  } = useDashboardController();

  // Función de navegación
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  // Componente de tarjeta estadística
  const StatCard = ({ title, value, icon, color, onPress, subtitle }) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statContent}>
        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Icon name={icon} size={24} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Componente de lista
  const ListSection = ({ title, items, icon, color, onViewAll, renderItem }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Icon name={icon} size={20} color={color} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{items.length}</Text>
          </View>
        </View>
        {items.length > 0 && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={[styles.viewAllText, { color }]}>Ver todo</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="check-circle" size={48} color="#e2e8f0" />
          <Text style={styles.emptyText}>Todo al día</Text>
        </View>
      ) : (
        <View>
          {items.slice(0, 3).map((item, index) => renderItem(item, index))}
          {items.length > 3 && (
            <TouchableOpacity style={styles.showMore} onPress={onViewAll}>
              <Text style={[styles.showMoreText, { color }]}>
                Ver {items.length - 3} más
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  // Renderizar producto con stock bajo
  const renderLowStockProduct = (product, index) => (
    <View key={product.id || index} style={styles.listItem}>
      <View style={styles.listContent}>
        <Text style={styles.itemTitle}>{product.name || 'Sin nombre'}</Text>
        <Text style={styles.itemSubtitle}>
          Stock: {product.stock || 0} | Mín: {product.minStock || 0}
        </Text>
      </View>
      <View style={[styles.statusBadge, styles.warningBadge]}>
        <Text style={styles.statusText}>BAJO</Text>
      </View>
    </View>
  );

  // Renderizar transferencia pendiente
  const renderPendingTransfer = (transfer, index) => (
    <View key={transfer.id || index} style={styles.listItem}>
      <View style={styles.listContent}>
        <Text style={styles.itemTitle}>{transfer.productName || 'Producto'}</Text>
        <Text style={styles.itemSubtitle}>
          {transfer.fromWarehouse} → {transfer.toWarehouse}
        </Text>
      </View>
      <View style={[styles.statusBadge, styles.infoBadge]}>
        <Text style={styles.statusText}>PENDIENTE</Text>
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={48} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshData} />
      }
    >
      {/* Header de bienvenida */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Buen día!</Text>
        <Text style={styles.subtitle}>Resumen de tu gestión agrícola</Text>
      </View>

      {/* Estadísticas principales */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Productos"
          value={stats.totalProducts || 0}
          icon="inventory"
          color="#4CAF50"
          subtitle="En inventario"
          onPress={() => navigateTo('Products')}
        />
        <StatCard
          title="Stock Bajo"
          value={stats.lowStockCount || 0}
          icon="warning"
          color="#FF9800"
          subtitle="Requieren atención"
          onPress={() => navigateTo('Products')}
        />
        <StatCard
          title="Transferencias"
          value={stats.pendingTransfersCount || 0}
          icon="swap-horiz"
          color="#2196F3"
          subtitle="Pendientes"
          onPress={() => navigateTo('Transfers')}
        />
        <StatCard
          title="Almacenes"
          value={stats.warehouseCount || 0}
          icon="business"
          color="#9C27B0"
          subtitle="Activos"
          onPress={() => Alert.alert('Info', 'Próximamente')}
        />
      </View>

      {/* Secciones de información */}
      <ListSection
        title="Stock Bajo"
        items={lowStockProducts || []}
        icon="warning"
        color="#FF9800"
        onViewAll={() => navigateTo('Products')}
        renderItem={renderLowStockProduct}
      />

      <ListSection
        title="Transferencias Pendientes"
        items={pendingTransfers || []}
        icon="swap-horiz"
        color="#2196F3"
        onViewAll={() => navigateTo('Transfers')}
        renderItem={renderPendingTransfer}
      />

      {/* Navegación rápida */}
      <View style={styles.quickActions}>
        <Text style={styles.quickTitle}>Acceso Rápido</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => navigateTo('Products')}
          >
            <Icon name="inventory" size={28} color="white" />
            <Text style={styles.actionText}>Productos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => navigateTo('Transfers')}
          >
            <Icon name="swap-horiz" size={28} color="white" />
            <Text style={styles.actionText}>Transferencias</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
            onPress={() => navigateTo('Fumigations')}
          >
            <Icon name="grass" size={28} color="white" />
            <Text style={styles.actionText}>Fumigaciones</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#9C27B0' }]}
            onPress={() => navigateTo('Fields')}
          >
            <Icon name="landscape" size={28} color="white" />
            <Text style={styles.actionText}>Campos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '300',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  listContent: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  warningBadge: {
    backgroundColor: '#fef3c7',
  },
  infoBadge: {
    backgroundColor: '#dbeafe',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
  },
  showMore: {
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    margin: 16,
    marginBottom: 30,
  },
  quickTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 48) / 2,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    color: 'white',
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    marginVertical: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;