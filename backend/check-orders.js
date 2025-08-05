const mongoose = require('mongoose');
const Order = require('./models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saptmarkets')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Get recent orders
      const orders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .select('_id invoice status createdAt cart');
      
      console.log('\n=== Recent Orders ===');
      orders.forEach(order => {
        console.log(`ID: ${order._id}`);
        console.log(`Invoice: ${order.invoice}`);
        console.log(`Status: ${order.status}`);
        console.log(`Created: ${order.createdAt}`);
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
        .limit(5);
      
      console.log('\n=== Delivered Orders ===');
      deliveredOrders.forEach(order => {
        console.log(`ID: ${order._id}, Invoice: ${order.invoice}, Updated: ${order.updatedAt}`);
      });
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 