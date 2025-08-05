const mongoose = require('mongoose');
require('./models/StockMovementLog');
require('./models/Order');

// Use the provided connection string
const MONGODB_URI = 'mongodb+srv://asadji10001:a3BTsHNptI7dhk9G@saptmarkets.ipkaggw.mongodb.net/?retryWrites=true&w=majority&appName=saptmarkets';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if StockMovementLog collection exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log('Collections in database:', collectionNames);
      
      // Check if stockmovementlogs collection exists
      const hasStockMovements = collectionNames.includes('stockmovementlogs');
      console.log('Has stockmovementlogs collection:', hasStockMovements);
      
      // Get recent orders
      const Order = mongoose.model('Order');
      const orders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id invoice status createdAt updatedAt cart');
      
      console.log('\n=== Recent Orders ===');
      orders.forEach(order => {
        console.log(`ID: ${order._id}`);
        console.log(`Invoice: ${order.invoice}`);
        console.log(`Status: ${order.status}`);
        console.log(`Created: ${order.createdAt}`);
        console.log(`Updated: ${order.updatedAt}`);
        console.log(`Cart Items: ${order.cart ? order.cart.length : 0}`);
        console.log('---');
      });
      
      // Count orders by status
      const statusCounts = await Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      console.log('\n=== Order Status Counts ===');
      statusCounts.forEach(status => {
        console.log(`${status._id}: ${status.count}`);
      });
      
      // Check for delivered orders
      const deliveredOrders = await Order.find({ status: 'Delivered' })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('_id invoice status updatedAt');
      
      console.log('\n=== Delivered Orders ===');
      if (deliveredOrders.length > 0) {
        deliveredOrders.forEach(order => {
          console.log(`ID: ${order._id}, Invoice: ${order.invoice}, Updated: ${order.updatedAt}`);
        });
      } else {
        console.log('No delivered orders found');
      }
      
      // Check for stock movements
      if (hasStockMovements) {
        const StockMovementLog = mongoose.model('StockMovementLog');
        const stockMovements = await StockMovementLog.find({})
          .sort({ createdAt: -1 })
          .limit(5);
        
        console.log('\n=== Stock Movements ===');
        if (stockMovements.length > 0) {
          stockMovements.forEach(movement => {
            console.log(`ID: ${movement._id}`);
            console.log(`Product: ${movement.product}`);
            console.log(`Type: ${movement.movement_type}`);
            console.log(`Quantity Changed: ${movement.quantity_changed}`);
            console.log(`Invoice: ${movement.invoice_number}`);
            console.log(`Created: ${movement.createdAt || 'N/A'}`);
            console.log('---');
          });
        } else {
          console.log('No stock movements found');
        }
        
        // Count stock movements
        const movementCount = await StockMovementLog.countDocuments({});
        console.log(`Total stock movements: ${movementCount}`);
      }
      
      // Create a test stock movement
      if (hasStockMovements) {
        try {
          const StockMovementLog = mongoose.model('StockMovementLog');
          
          // Find a product ID to use
          const Product = mongoose.model('Product');
          const product = await Product.findOne({}).select('_id');
          
          if (product) {
            console.log('\n=== Creating Test Stock Movement ===');
            const testMovement = new StockMovementLog({
              product: product._id,
              movement_type: 'test',
              quantity_before: 100,
              quantity_changed: -5,
              quantity_after: 95,
              invoice_number: 'TEST-001',
              reference_document: 'Test Movement',
              user: '507f1f77bcf86cd799439011', // Placeholder admin ID
              cost_per_unit: 10,
              total_value: 50,
              odoo_sync_status: 'pending'
            });
            
            await testMovement.save();
            console.log('Test stock movement created successfully:', testMovement._id);
          } else {
            console.log('No products found to create test movement');
          }
        } catch (error) {
          console.error('Error creating test stock movement:', error.message);
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      mongoose.connection.close();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 